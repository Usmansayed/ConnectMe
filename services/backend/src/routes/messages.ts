import { FastifyInstance } from 'fastify';
import * as messageService from '../modules/message/message.service';

export async function messageRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { threadId: string } }>('/messages/:threadId', async (req) => {
    return messageService.getMessages(req.params.threadId);
  });
}
