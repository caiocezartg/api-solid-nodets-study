import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { registerService } from '../services/register-service';

export async function registerController (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  });
  
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    await registerService({name, email, password});
  } catch (error) {
    return reply.status(409).send();
  }
  
  return reply.status(201).send();
  
}