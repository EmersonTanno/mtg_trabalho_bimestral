import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckService } from './deck.service';
import { DeckController } from './deck.controller';
import { Deck, DeckSchema } from './deck.schema';
import { ScryfallModule } from '../scryfall/scryfall.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
      ScryfallModule,
    ],
    controllers: [DeckController],
    providers: [DeckService],
    exports: [DeckService],
  })
  export class DeckModule {}

