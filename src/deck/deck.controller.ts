import { Controller, Get } from '@nestjs/common';
import { buildDeckCardNames, chooseCommander } from './deck_builder';
import { ScryfallService } from 'src/scryfall/scryfall.service';

@Controller('deck')
export class DeckController {
  constructor(private readonly scryfallService: ScryfallService) {}

  @Get()
  async getDeck() {
    // Escolhe um comandante
    const commander = await chooseCommander(this.scryfallService);

    // Constrói o deck baseado no comandante escolhido
    const deck = await buildDeckCardNames(this.scryfallService, commander);

    // Retorna o deck
    return deck;
  }
}