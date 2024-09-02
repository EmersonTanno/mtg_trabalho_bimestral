import { Controller, Post, Body, Get, Param, NotFoundException, ConflictException, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('roles') roles: string[]
  ) {
    const existingUser = await this.usersService.findOne(username);
    
    if (existingUser) {
      throw new ConflictException(`User "${username}" already exists`);
    }
    
    const user = await this.usersService.createUser(username, password, roles);
    
    return { message: `User "${user.username}" created successfully` };
  }
  

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<Partial<User>> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  @Put(':username')
  async updateUser(@Param('username') username: string, @Body('newUserName') newUserName: string, @Body('newPassword') newPassword: string): Promise<{username:string}>{
    const updatedUser = await this.usersService.updateUser(username, newUserName, newPassword);

    return { username: updatedUser.username };
  }

  @Delete(':username')
  async deleteUser(@Param('username') username: string): Promise<{ username: string }> {
    const deletedUser = await this.usersService.deleteUser(username);
  
    return { username: deletedUser.username };
  }

}