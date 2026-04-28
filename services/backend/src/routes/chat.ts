import { FastifyInstance } from 'fastify';
import { ChatSendRequest, ChatCompareRequest } from '@connectme/shared-types';
import * as messageService from '../modules/message/message.service';
import * as logsService from '../modules/logs/logs.service';

export async function chatRoutes(fastify: FastifyInstance) {
  // POST /chat/send - sends prompt to a provider (placeholder for Phase 2 browser automation)
  fastify.post<{ Body: ChatSendRequest }>('/chat/send', async (req, reply) => {
    const { workspaceId, threadId, provider, prompt } = req.body;
    if (!prompt || !provider || !threadId || !workspaceId) {
      return reply.code(400).send({ error: 'workspaceId, threadId, provider, and prompt are required' });
    }

    // Save user message
    messageService.saveMessage(threadId, provider, 'user', prompt);
    logsService.addLog('info', `Chat send: provider=${provider}, threadId=${threadId}`);

    // Placeholder response - Phase 2 will wire up real browser automation
    const placeholderResponse = `[${provider.toUpperCase()} – browser automation coming in Phase 2] You asked: "${prompt}"`;
    messageService.saveMessage(threadId, provider, 'assistant', placeholderResponse);

    return {
      success: true,
      message: placeholderResponse,
      threadId,
      provider
    };
  });

  // POST /chat/compare - sends same prompt to multiple providers
  fastify.post<{ Body: ChatCompareRequest }>('/chat/compare', async (req, reply) => {
    const { providers, prompt, workspaceId, threadId } = req.body;
    if (!prompt || !providers?.length) {
      return reply.code(400).send({ error: 'providers and prompt required' });
    }

    logsService.addLog('info', `Compare mode: providers=${providers.join(',')}`);

    const results = providers.map((provider) => ({
      provider,
      message: `[${provider.toUpperCase()} – browser automation coming in Phase 2] You asked: "${prompt}"`
    }));

    return { results, prompt };
  });
}
