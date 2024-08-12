import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScryfallService } from './scryfall/scryfall.service';
import { DeckController } from './deck/deck.controller';

@Module({
  imports: [HttpModule],
  controllers: [DeckController],
  providers: [ScryfallService],
})
export class AppModule {}
