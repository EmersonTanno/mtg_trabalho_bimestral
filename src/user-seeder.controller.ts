import { Controller, Post } from '@nestjs/common';
import { UserSeederService } from './user-seeder.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seederService: UserSeederService) {}

  @Post('users')
  async seedUsers() {
    await this.seederService.seedUsers();
    return { message: 'Seeding completed!' };
  }
}
