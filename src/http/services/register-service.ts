import { prisma } from '@/lib/prisma';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

interface IRegisterService {
    name: string;
    email: string;
    password: string;
}

export async function registerService({ name, email, password }: IRegisterService){

  const password_hash = await hash(password, 6);

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    }
  });
    
  if (userExists) {
    throw new Error('User already exists');
  }

  const prismaUsersRepository = new PrismaUsersRepository();
  
  await prismaUsersRepository.create({
    name, email, password_hash
  });
}