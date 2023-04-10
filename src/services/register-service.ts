import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import type { User } from '@prisma/client';

interface IRegisterServiceRequest {
    name: string;
    email: string;
    password: string;
}

interface IRegisterServiceResponse {
  user: User;
}

export class RegisterService {

  constructor(private usersRepository: UsersRepository){}

  async execute({ name, email, password }: IRegisterServiceRequest): Promise<IRegisterServiceResponse>{

    const password_hash = await hash(password, 6);
  
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }
    
    const user = await this.usersRepository.create({
      name, email, password_hash
    });

    return { user };
  }
}

