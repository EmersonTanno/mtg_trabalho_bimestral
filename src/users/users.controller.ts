import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.usersService.createUser(username, password);
    return { username: user.username }; 
  }
}