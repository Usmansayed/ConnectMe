import { FastifyInstance } from 'fastify';
import { ProviderCapabilities, ProviderName } from '@connectme/shared-types';

// Default capabilities - will be replaced by real browser detection in Phase 2
const defaultCapabilities: Record<ProviderName, ProviderCapabilities> = {
  chatgpt: {
    loggedIn: false,
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    tools: ['web_search', 'code_interpreter', 'dall_e'],
    features: { research: true, files: true, canvas: true }
  },
  claude: {
    loggedIn: false,
    models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
    tools: [],
    features: { artifacts: true, files: true }
  },
  gemini: {
    loggedIn: false,
    models: ['gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-pro'],
    tools: [],
    features: { thinking: true, deepResearch: true, files: true }
  }
};

export async function providerRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { name: string } }>('/provider/:name/capabilities', async (req, reply) => {
    const name = req.params.name as ProviderName;
    if (!['chatgpt', 'claude', 'gemini'].includes(name)) {
      return reply.code(404).send({ error: 'Unknown provider' });
    }
    return defaultCapabilities[name];
  });
}
