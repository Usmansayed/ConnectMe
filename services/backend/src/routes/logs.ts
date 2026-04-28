import { FastifyInstance } from 'fastify';
import * as logsService from '../modules/logs/logs.service';

export async function logsRoutes(fastify: FastifyInstance) {
  fastify.get('/logs', async (req) => {
    const query = req.query as { limit?: string };
    const limit = query.limit ? parseInt(query.limit) : 100;
    return logsService.getLogs(limit);
  });
}
