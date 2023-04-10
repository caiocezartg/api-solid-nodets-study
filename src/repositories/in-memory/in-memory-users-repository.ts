import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {

  public users: User[] = [];

  async create({ name, email, password_hash }: Prisma.UserCreateInput){
    const user = {
      id: String(Math.random()),
      name,
      email,
      password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }
  async findByEmail(email: string){
    const user = this.users.find(user => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

}