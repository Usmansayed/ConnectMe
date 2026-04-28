import db from '../../db/database';
import { v4 as uuidv4 } from 'uuid';
import { Thread } from '@connectme/shared-types';

export function getThreads(workspaceId: string): Thread[] {
  return db.prepare('SELECT * FROM threads WHERE workspace_id = ? ORDER BY created_at DESC').all(workspaceId) as unknown as Thread[];
}

export function createThread(workspaceId: string, name: string): Thread {
  const now = new Date().toISOString();
  const thread: Thread = { id: uuidv4(), workspace_id: workspaceId, name, created_at: now };
  db.prepare('INSERT INTO threads (id, workspace_id, name, created_at) VALUES (?, ?, ?, ?)').run(thread.id, thread.workspace_id, thread.name, thread.created_at);
  return thread;
}

export function deleteThread(id: string): void {
  db.prepare('DELETE FROM threads WHERE id = ?').run(id);
}
