import { it, describe, expect } from 'vitest';
import { RegisterService } from './register-service';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Service', () => {

  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });

    expect(user.id).toEqual(expect.any(String));

  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    });

    const isPasswordHashed = await compare(
      'password123',
      user.password_hash,
    );

    expect(isPasswordHashed).toBe(true);

  });

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const email = 'johndoe@example.com';

    await registerService.execute({
      name: 'John Doe',
      email: email,
      password: 'password123',
    });

    expect(async () => {
      await registerService.execute({
        name: 'John Doe',
        email: email,
        password: 'password123',
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);

  });
});