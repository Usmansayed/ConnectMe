import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export interface MemoryItem {
  id: string;
  workspace_id: string;
  content: string;
  keywords: string;
  created_at: string;
}

export class MemoryService {
  private db: Database.Database;

  constructor(dbPath: string) {
    const dir = path.dirname(dbPath);
    fs.mkdirSync(dir, { recursive: true });
    this.db = new Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memory_items (
        id TEXT PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        content TEXT NOT NULL,
        keywords TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_memory_workspace ON memory_items(workspace_id);
    `);
  }

  save(workspaceId: string, content: string): MemoryItem {
    const now = new Date().toISOString();
    const keywords = this.extractKeywords(content);
    const item: MemoryItem = {
      id: uuidv4(),
      workspace_id: workspaceId,
      content,
      keywords,
      created_at: now
    };
    this.db.prepare('INSERT INTO memory_items (id, workspace_id, content, keywords, created_at) VALUES (?, ?, ?, ?, ?)').run(item.id, item.workspace_id, item.content, item.keywords, item.created_at);
    return item;
  }

  search(workspaceId: string, query: string, limit = 10): MemoryItem[] {
    const keywords = this.extractKeywords(query);
    const keywordList = keywords.split(' ').filter(Boolean);

    if (keywordList.length === 0) {
      return this.db.prepare('SELECT * FROM memory_items WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ?').all(workspaceId, limit) as MemoryItem[];
    }

    // Simple keyword search
    const conditions = keywordList.map(() => '(content LIKE ? OR keywords LIKE ?)').join(' OR ');
    const params: string[] = [];
    keywordList.forEach((kw) => { params.push(`%${kw}%`, `%${kw}%`); });
    params.push(workspaceId, String(limit));

    return this.db.prepare(`SELECT * FROM memory_items WHERE (${conditions}) AND workspace_id = ? ORDER BY created_at DESC LIMIT ?`).all(...params) as MemoryItem[];
  }

  getRecent(workspaceId: string, limit = 5): MemoryItem[] {
    return this.db.prepare('SELECT * FROM memory_items WHERE workspace_id = ? ORDER BY created_at DESC LIMIT ?').all(workspaceId, limit) as MemoryItem[];
  }

  buildContextPacket(workspaceId: string, query: string): string {
    const recent = this.getRecent(workspaceId, 3);
    const relevant = this.search(workspaceId, query, 5);

    const all = [...new Map([...recent, ...relevant].map((m) => [m.id, m])).values()];
    if (all.length === 0) return '';

    return '--- Memory Context ---\n' + all.map((m) => `[${new Date(m.created_at).toLocaleDateString()}] ${m.content}`).join('\n') + '\n--- End Memory ---\n\n';
  }

  summarizeAndStore(workspaceId: string, messages: { role: string; content: string }[]): void {
    const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content);

    if (userMessages.length === 0) return;

    const summary = `User asked: ${userMessages.join(' | ')}`;
    this.save(workspaceId, summary);
  }

  private extractKeywords(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 20)
      .join(' ');
  }
}
