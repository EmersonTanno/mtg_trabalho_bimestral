import { Injectable } from '@nestjs/common';
import { ScryfallService } from '../scryfall/scryfall.service';

@Injectable()
export class DeckService {
  constructor(private readonly scryfallService: ScryfallService) {}

  async chooseCommander(commanderName: string) {
    const commander = await this.scryfallService.getCardByName(commanderName).toPromise();
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

  async buildDeck(commanderName: string) {
    const commander = await this.chooseCommander(commanderName);

    const colors = commander.color_identity.join('');
    const cardQuery = `c:${colors} -type:commander -is:commander`;

    // Busca cartas não-terreno
    const cards = await this.scryfallService.searchCards(cardQuery).toPromise();
    let deck = cards.data.slice(0, 69).map(card => card.name); // Extrai apenas o nome das primeiras 69 cartas

    // Busca terrenos básicos
    const basicLands = await this.searchBasicTerrain(colors);
    let lands = basicLands.slice(0, 30).map(card => card.name);

    // Adiciona terrenos básicos até completar 99 cartas no deck
    let landIndex = 0;
    while (deck.length < 99) {
      deck.push(lands[landIndex % lands.length]); // Cicla pelos terrenos encontrados
      landIndex++;
    }

    // Retorna o deck com o comandante (nome) na primeira posição
    return [commander.name, ...deck];
  }


  async buildDeckAllInfo(commanderName: string) {
    const commander = await this.chooseCommander(commanderName);

    const colors = commander.color_identity.join('');
    const cardQuery = `c:${colors} -type:commander -is:commander`;
  
    // Busca cartas não-terreno
   const cards = await this.scryfallService.searchCards(cardQuery).toPromise();
    let deck = cards.data.slice(0, 69); // Seleciona as primeiras 69 cartas
  
    // Busca terrenos básicos
    const basicLands = await this.searchBasicTerrain(colors);
    let lands = basicLands.slice(0, 30);

    
    // Adiciona terrenos básicos até completar 99 cartas no deck
    let landIndex = 0;
    while (deck.length < 99) {
      deck.push(basicLands[landIndex % basicLands.length]); // Cicla pelos terrenos encontrados
      landIndex++;
    }
  
    // Retorna o deck com o comandante na primeira posição
    return [commander, ...deck];
  }
}
