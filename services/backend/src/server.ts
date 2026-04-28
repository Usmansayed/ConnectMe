import Fastify from 'fastify';
import cors from '@fastify/cors';
import { initDb } from './db/database';
import { workspaceRoutes } from './routes/workspaces';
import { threadRoutes } from './routes/threads';
import { providerRoutes } from './routes/providers';
import { chatRoutes } from './routes/chat';
import { logsRoutes } from './routes/logs';
import { messageRoutes } from './routes/messages';
import { settingsRoutes } from './routes/settings';

const server = Fastify({ logger: true });

async function main() {
  // Init database
  initDb();

  // CORS for frontend
  await server.register(cors, { origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true });

  // Register routes
  await server.register(workspaceRoutes);
  await server.register(threadRoutes);
  await server.register(providerRoutes);
  await server.register(chatRoutes);
  await server.register(logsRoutes);
  await server.register(messageRoutes);
  await server.register(settingsRoutes);

  // Health check
  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  const port = parseInt(process.env.PORT || '3001');
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`ConnectMe backend running on http://localhost:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
