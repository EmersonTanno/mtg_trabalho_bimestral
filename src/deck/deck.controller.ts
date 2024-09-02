import { Controller, Get, Query, Post, UseGuards, Param, Delete } from '@nestjs/common';
import { DeckService } from './deck.service';
import { AuthGuard } from '../auth/auth.guard';
import { Deck } from './deck.schema';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/enum/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @Post(':commanderName')
  async saveDeckComplete(@Param('commanderName') commanderName: string) {
    if (!commanderName) {
      return { error: 'Please provide a commanderName query parameter' };
    }
  
    const savedDeck = await this.deckService.buildAndSaveDeckInfo(commanderName);
    return savedDeck;
  }

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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteDeckById(@Param('id') id:string): Promise<String> {
    return this.deckService.deleteDeckById(id);
  }
}
