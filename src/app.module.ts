import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckModule } from './deck/deck.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/roles.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mtg-dp'),
    DeckModule,
    AuthModule,
    UsersModule,
  ],

})
export class AppModule {}