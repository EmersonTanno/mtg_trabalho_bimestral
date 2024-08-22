import { Controller, Get, Query, Post, UseGuards, Param } from '@nestjs/common';
import { DeckService } from './deck.service';
import { AuthGuard } from '../auth/auth.guard';
import { Deck } from './deck.schema';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(AuthGuard)
  @Post('/saveComplete')
  async saveDeckComplete(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    const savedDeck = await this.deckService.buildAndSaveDeckInfo(commanderName);
    return savedDeck;
  }

  /*
  @UseGuards(AuthGuard)
  @Post('/saveName')
  async saveDeckName(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    const savedDeck = await this.deckService.buildAndSaveDeck(commanderName);
    return savedDeck;
  }
  */

  @Get()
  async getDeck(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    // Constrói o deck usando o nome do comandante passado na query, retornando apenas o nome das cartas
    const deck = await this.deckService.buildDeck(commanderName);

    return deck;
  }

  @Get('allInfo')
  async getDeckAllInfo(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    // Constrói o deck usando o nome do comandante passado na query, retornando todas as infos das cartas
    const deck = await this.deckService.buildDeckAllInfo(commanderName);

    return deck;
  }

  @Get(':id')
  async getDeckById(@Param('id') id: string): Promise<Deck> {
    return this.deckService.getDeckById(id);
  }
}
