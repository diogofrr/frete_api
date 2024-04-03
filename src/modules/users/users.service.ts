import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      name: 'Diogo',
      email: 'teste@gmail.com',
      password: 'diogo123',
      profile_type: 'company',
    },
    {
      id: 2,
      name: 'Ana',
      email: 'teste123@gmail.com',
      password: 'ana123',
      profile_type: 'delivery',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
