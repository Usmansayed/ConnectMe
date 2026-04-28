import db from '../../db/database';
import { v4 as uuidv4 } from 'uuid';
import { Log } from '@connectme/shared-types';

export function getLogs(limit = 100): Log[] {
  return db.prepare('SELECT * FROM logs ORDER BY created_at DESC LIMIT ?').all(limit) as Log[];
}

export function addLog(type: 'info' | 'error' | 'warn', message: string): Log {
  const now = new Date().toISOString();
  const log: Log = { id: uuidv4(), type, message, created_at: now };
  db.prepare('INSERT INTO logs (id, type, message, created_at) VALUES (?, ?, ?, ?)').run(log.id, log.type, log.message, log.created_at);
  return log;
}
