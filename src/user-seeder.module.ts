import { Module } from '@nestjs/common';
import { UserSeederService } from './user-seeder.service';
import { SeedController } from './user-seeder.controller';
import { UsersService } from './users/users.service'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserSeederService, UsersService],
  controllers: [SeedController],
})
export class SeedModule {}
