import db from '../../db/database';
import { Setting } from '@connectme/shared-types';

export function getSetting(key: string): string | null {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string): void {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function getAllSettings(): Setting[] {
  return db.prepare('SELECT * FROM settings').all() as Setting[];
}
