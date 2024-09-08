import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createUser(username: string, password: string, roles: string[]): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
  
    const newUser = await this.userModel.create({
      username,
      password: hashedPassword,
      roles 
    });
  
    return newUser;
  }
  

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).lean().exec();
  }

  async updateUser(username: string, newUserName: string, newPassword: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ username }).exec();
    
    if (!existingUser) {
      throw new NotFoundException(`User "${username}" not found`);
    }
  
    if (newUserName && newUserName !== username) {
      const userWithNewUsername = await this.userModel.findOne({ username: newUserName }).exec();
      if (userWithNewUsername) {
        throw new ConflictException(`User with username "${newUserName}" already exists`);
      }
      existingUser.username = newUserName;
    }
  
    if (newPassword) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      existingUser.password = hashedPassword;
    }
  
    await existingUser.save();
    return existingUser;
  }

  async deleteUser(username: string): Promise<User> {
    const existingUser = await this.userModel.findOneAndDelete({ username }).exec();
  
    if (!existingUser) {
      throw new NotFoundException(`User "${username}" not found`);
    }
  
    return existingUser;
  }
  

}

