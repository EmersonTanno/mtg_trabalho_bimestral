import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckModule } from './deck/deck.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './user-seeder.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mtg-dp'),
    DeckModule,
    AuthModule,
    UsersModule,
    SeedModule,
  ],

})
export class AppModule {}