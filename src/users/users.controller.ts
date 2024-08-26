import { Controller, Post, Body, Get, Param, NotFoundException, ConflictException, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body('username') username: string, @Body('password') password: string) {
    const existinguser = await this.usersService.findOne(username);
    if(existinguser){
      throw new ConflictException(`User "${username}" alredy exists`);
    }
    const user = await this.usersService.createUser(username, password);
    return (`User "${user.username}" create sucess`);
    
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