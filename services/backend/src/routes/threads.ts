import { FastifyInstance } from 'fastify';
import * as threadService from '../modules/thread/thread.service';

export async function threadRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { workspaceId: string } }>('/threads/:workspaceId', async (req) => {
    return threadService.getThreads(req.params.workspaceId);
  });

  fastify.post<{ Body: { workspaceId: string; name: string } }>('/threads', async (req, reply) => {
    const { workspaceId, name } = req.body;
    if (!workspaceId || !name) return reply.code(400).send({ error: 'workspaceId and name required' });
    return threadService.createThread(workspaceId, name);
  });

  fastify.delete<{ Params: { id: string } }>('/threads/:id', async (req) => {
    threadService.deleteThread(req.params.id);
    return { success: true };
  });
}
