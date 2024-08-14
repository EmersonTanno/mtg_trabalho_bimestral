import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScryfallService } from './scryfall/scryfall.service';
import { DeckController } from './deck/deck.controller';
import { DeckService } from './deck/deck.service';

@Module({
  imports: [HttpModule],
  controllers: [DeckController],
  providers: [DeckService, ScryfallService],
})
export class AppModule {}
