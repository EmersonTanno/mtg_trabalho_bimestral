import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ScryfallService } from '../scryfall/scryfall.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './deck.schema';

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<DeckDocument>,
    private readonly scryfallService: ScryfallService
  ) {}

  async buildAndSaveDeckInfo(commanderName: string) {
    const commander = await this.scryfallService.getCardByName(commanderName).toPromise();
    const deckNames = await this.buildDeckAllInfo(commanderName);

    // Salva o deck no Mongo
    const deck = new this.deckModel({
      commanderName: commander.name,
      cards: deckNames
    });
    return deck.save();
  }

  async buildAndSaveDeck(commanderName: string) {
    const commander = await this.scryfallService.getCardByName(commanderName).toPromise();
    const deckNames = await this.buildDeck(commanderName);

    const deck = await this.deckModel.create({
      commanderName: commander.name,
      cards: deckNames,
    });

    return deck.save();
  }
  
  async chooseCommander(commanderName: string) {
    const commander = await this.scryfallService.getCardByName(commanderName).toPromise();
    if(!commander.type_line.includes('Legendary Creature')){
      throw new BadRequestException(`${commanderName} is not a Legendary Creature and cannot be a commander.`);
    }
    return commander;
  }

  async searchBasicTerrain(colors: string[]) {
    const basicLands: any[] = [];
    const landTypes = {
      W: 'Plains',
      U: 'Island',
      B: 'Swamp',
      R: 'Mountain',
      G: 'Forest'
    };

    for (const landColor of colors) {
      const landName = landTypes[landColor];
      const landCard = await this.scryfallService.getCardByName(landName).toPromise();
      if (landCard) {
        basicLands.push(landCard);
      }
    }
    return basicLands;
  }

  //build deck apenas com nome e mana_cost
  async buildDeck(commanderName: string) {
    const commander = await this.chooseCommander(commanderName);

    const colors = commander.color_identity.join('');
    const cardQuery = `c:${colors} -type:commander -is:commander`;

    // Busca cartas não-terreno
    const cards = await this.scryfallService.searchCards(cardQuery).toPromise();
    let deck = cards.data
      .filter(card => {
        // Verifica se as cores no custo de mana da carta estão contidas nas cores do comandante
        const cardColors = card.color_identity.join('');
        return cardColors.split('').every(color => colors.includes(color));
      })
      .slice(0, 69)
      .map(card => ({
        name: card.name,
        mana_cost: card.mana_cost,
      }));

    // Busca terrenos básicos
    const basicLands = await this.searchBasicTerrain(colors);
    let lands = basicLands.slice(0, 30).map(card => card.name);

    // Adiciona terrenos básicos até completar 99 cartas no deck
    let landIndex = 0;
    while (deck.length < 99) {
      deck.push(lands[landIndex % lands.length]); // Cicla pelos terrenos encontrados
      landIndex++;
    }

    // Retorna o deck com o comandante na primeira posição
    return [{ name: commander.name, mana_cost: commander.mana_cost }, ...deck];
  }

  //build deck com todas as informações
  async buildDeckAllInfo(commanderName: string) {
    const commander = await this.chooseCommander(commanderName);

    const colors = commander.color_identity.join('');
    const cardQuery = `c:${colors} -type:commander -is:commander`;
  
    // Busca cartas não-terreno
    const cards = await this.scryfallService.searchCards(cardQuery).toPromise();
    let deck = cards.data
      .filter(card => {
        // Verifica se as cores no custo de mana da carta estão contidas nas cores do comandante
        const cardColors = card.color_identity.join('');
        return cardColors.split('').every(color => colors.includes(color));
      })
      .slice(0, 69)
  
    // Busca terrenos básicos
    const basicLands = await this.searchBasicTerrain(colors);
    let lands = basicLands.slice(0, 30);

    
    // Adiciona terrenos básicos até completar 99 cartas no deck
    let landIndex = 0;
    while (deck.length < 99) {
      deck.push(lands[landIndex % lands.length]); // Cicla pelos terrenos encontrados
      landIndex++;
    }
  
    // Retorna o deck com o comandante na primeira posição
    return [commander, ...deck];
  }

  async getDeckById(id: string): Promise<Deck> {
    const deck = await this.deckModel.findById(id).exec();
    
    if (!deck) {
      throw new NotFoundException(`Deck with id ${id} not found`);
    }
    
    return deck;
  }

  async deleteDeckById(id: string): Promise<string> {
    const deck = await this.deckModel.findByIdAndDelete(id).exec();
  
    if (!deck) {
      throw new NotFoundException(`Deck with id ${id} not found`);
    }
  
    return `Deck with commander ${deck.commanderName} deleted`;
  }
  
}
