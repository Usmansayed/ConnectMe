import { FastifyInstance } from 'fastify';
import * as workspaceService from '../modules/workspace/workspace.service';

export async function workspaceRoutes(fastify: FastifyInstance) {
  fastify.get('/workspaces', { config: { rateLimit: { max: 100, timeWindow: '1 minute' } } }, async () => {
    return workspaceService.getWorkspaces();
  });

  fastify.post<{ Body: { name: string } }>('/workspaces', async (req, reply) => {
    const { name } = req.body;
    if (!name) return reply.code(400).send({ error: 'name required' });
    return workspaceService.createWorkspace(name);
  });

  fastify.put<{ Params: { id: string }; Body: { name: string } }>('/workspaces/:id', async (req, reply) => {
    const ws = workspaceService.updateWorkspace(req.params.id, req.body.name);
    if (!ws) return reply.code(404).send({ error: 'not found' });
    return ws;
  });

  fastify.delete<{ Params: { id: string } }>('/workspaces/:id', async (req) => {
    workspaceService.deleteWorkspace(req.params.id);
    return { success: true };
  });
}
