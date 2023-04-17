import { it, describe, expect } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate-service';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate Service', () => {

  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('password123', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'password123',
    });

    expect(user.id).toEqual(expect.any(String));

  });

  it('should not be able to authenticate with wrong e-mail', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'password123',
      })    
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('password123', 6),
    });

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '12313123',
      })    
    ).rejects.toBeInstanceOf(InvalidCredentialsError);

  });
});