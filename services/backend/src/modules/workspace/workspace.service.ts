import db from '../../db/database';
import { v4 as uuidv4 } from 'uuid';
import { Workspace } from '@connectme/shared-types';

export function getWorkspaces(): Workspace[] {
  return db.prepare('SELECT * FROM workspaces ORDER BY created_at DESC').all() as Workspace[];
}

export function createWorkspace(name: string): Workspace {
  const now = new Date().toISOString();
  const workspace: Workspace = { id: uuidv4(), name, created_at: now, updated_at: now };
  db.prepare('INSERT INTO workspaces (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)').run(workspace.id, workspace.name, workspace.created_at, workspace.updated_at);
  return workspace;
}

export function updateWorkspace(id: string, name: string): Workspace | null {
  const now = new Date().toISOString();
  db.prepare('UPDATE workspaces SET name = ?, updated_at = ? WHERE id = ?').run(name, now, id);
  return db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id) as Workspace | null;
}

export function deleteWorkspace(id: string): void {
  db.prepare('DELETE FROM workspaces WHERE id = ?').run(id);
}
