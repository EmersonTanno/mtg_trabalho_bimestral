import { Controller, Get, Query } from '@nestjs/common';
import { DeckService } from './deck.service';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Get('/save')
  async saveDeck(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    const savedDeck = await this.deckService.buildAndSaveDeck(commanderName);
    return savedDeck;
  }

  @Get()
  async getDeck(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    // Constrói o deck usando o nome do comandante passado na query, retornando apenas o nome das cartas
    const deck = await this.deckService.buildDeck(commanderName);

    // Retorna o deck
    return deck;
  }

  @Get('allInfo')
  async getDeckAllInfo(@Query('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }

    // Constrói o deck usando o nome do comandante passado na query, retornando todas as infos das cartas
    const deck = await this.deckService.buildDeckAllInfo(commanderName);

    // Retorna o deck
    return deck;
  }
}
