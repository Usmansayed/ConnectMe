import { FastifyInstance } from 'fastify';
import * as settingsService from '../modules/settings/settings.service';

export async function settingsRoutes(fastify: FastifyInstance) {
  fastify.get('/settings', { config: { rateLimit: { max: 100, timeWindow: '1 minute' } } }, async () => {
    return settingsService.getAllSettings();
  });

  fastify.post<{ Body: { key: string; value: string } }>('/settings', async (req, reply) => {
    const { key, value } = req.body;
    if (!key || value === undefined) return reply.code(400).send({ error: 'key and value required' });
    settingsService.setSetting(key, value);
    return { success: true };
  });
}
