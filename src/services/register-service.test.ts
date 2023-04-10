import { it, describe, expect } from 'vitest';
import { RegisterService } from './register-service';
import { compare } from 'bcryptjs';

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const registerService = new RegisterService({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async findByEmail(email){
        return null;
      },

      async create({ name, email, password_hash }) {
        return {
          id: 'user-1',
          name,
          email,
          password_hash,
          created_at: new Date(),
        };
      },
    });

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
});