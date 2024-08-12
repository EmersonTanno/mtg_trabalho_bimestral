import { ScryfallService } from '../scryfall/scryfall.service';
import { writeFileSync } from 'fs';


export async function chooseCommander(scryfallService: ScryfallService) {
  const commanderName = 'Miku, the Renowned'; // Exemplo Inferno of the Star Mounts
  console.log(commanderName)
  const commander = await scryfallService.getCardByName(commanderName).toPromise();
  return commander;
}


async function searchBasicTerrain(scryfallService: ScryfallService, commanderColor: string[]) {
  const basicLands: any[] = [];
  const landTypes = {
    W: 'Plains',
    U: 'Island',
    B: 'Swamp',
    R: 'Mountain',
    G: 'Forest'
  };

  for(const landColor of commanderColor){
    const landName = landTypes[landColor];

    // Busca os terrenos informados terennos
    const landCard = await scryfallService.getCardByName(landName).toPromise();
    if (landCard) {
      basicLands.push(landCard);
    }

    
  }
  return basicLands;
}

export async function buildDeck(scryfallService: ScryfallService, commander: any) {
  const colors = commander.color_identity.join('');
  const cardQuery = `c:${colors} -type:commander -is:commander`;

  // Busca cartas não-terreno
  const cards = await scryfallService.searchCards(cardQuery).toPromise();
  let deck = cards.data.slice(0, 69); // Seleciona as primeiras 69 cartas

  // Busca terrenos básicos
  const basicLands = await searchBasicTerrain(scryfallService, colors)
  
  // Adiciona terrenos básicos até completar 99 cartas no deck
  let landIndex = 0;
  while (deck.length < 99) {
    deck.push(basicLands[landIndex % basicLands.length]); // Cicla pelos terrenos encontrados
    landIndex++;
  }

  // Retorna o deck com o comandante na primeira posição
  return [commander, ...deck];
}

export async function buildDeckCardNames(scryfallService: ScryfallService, commander: any) {
  const colors = commander.color_identity.join('');
  const cardQuery = `c:${colors} -type:commander -is:commander`;

  // Busca cartas não-terreno
  const cards = await scryfallService.searchCards(cardQuery).toPromise();
  let deck = cards.data.slice(0, 69).map(card => card.name); // Extrai apenas o nome das primeiras 69 cartas

  // Busca terrenos básicos
  const basicLands = await searchBasicTerrain(scryfallService, colors);
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

export function saveDeckToFile(deck: any[]) {
  writeFileSync('deck.json', JSON.stringify(deck, null, 2));
}
