import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service'; 
import { faker } from '@faker-js/faker';

@Injectable()
export class UserSeederService {
  constructor(private usersService: UsersService) {}

  async seedUsers() {
    for (let i = 0; i < 10; i++) {
      const name = faker.person.fullName();
      const password = faker.internet.password();
      const roles = ['user'];

      const user = {
        username: name,
        password,
        roles,
      };

      try {
        await this.usersService.createUser(user.username, user.password, user.roles);
        console.log(`Usuário ${name} salvo com sucesso!`);
      } catch (error) {
        console.error(`Erro ao salvar o usuário ${name}:`, error);
      }
    }
  }
}
