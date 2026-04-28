import db from '../../db/database';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@connectme/shared-types';

export function getMessages(threadId: string): Message[] {
  return db.prepare('SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at ASC').all(threadId) as Message[];
}

export function saveMessage(threadId: string, provider: string, role: 'user' | 'assistant', content: string): Message {
  const now = new Date().toISOString();
  const msg: Message = { id: uuidv4(), thread_id: threadId, provider: provider as Message['provider'], role, content, created_at: now };
  db.prepare('INSERT INTO messages (id, thread_id, provider, role, content, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(msg.id, msg.thread_id, msg.provider, msg.role, msg.content, msg.created_at);
  return msg;
}
