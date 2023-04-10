import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RegisterService } from '@/services/register-service';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';

export async function registerController (request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string().min(6),
  });
  
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRepository);

    await registerService.execute({name, email, password});
  } catch (error) {

    if (error instanceof UserAlreadyExistsError){
      return reply.status(409).send({
        statusCode: 409,
        message: error.message,
      });
    }

    throw error;

  }
  
  return reply.status(201).send();
  
}