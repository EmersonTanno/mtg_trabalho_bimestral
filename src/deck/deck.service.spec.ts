import { Test, TestingModule } from '@nestjs/testing';
import { DeckService } from './deck.service';
import { ScryfallService } from '../scryfall/scryfall.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './deck.schema';
import { of } from 'rxjs';

describe('DeckService', () => {
  let deckService: DeckService;
  let scryfallService: ScryfallService;
  let deckModel: Model<DeckDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckService,
        {
          provide: ScryfallService,
          useValue: {
            getCardByName: jest.fn(),
            searchCards: jest.fn(),
          },
        },
        {
          provide: getModelToken(Deck.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    deckService = module.get<DeckService>(DeckService);
    scryfallService = module.get<ScryfallService>(ScryfallService);
    deckModel = module.get<Model<DeckDocument>>(getModelToken(Deck.name));
  });

  it('should be defined', () => {
    expect(deckService).toBeDefined();
  });

  describe('buildAndSaveDeck', () => {
    it('should build and save a deck', async () => {
      const mockCommander = { name: 'Mock Commander', color_identity: ['G'] };
      const mockDeck = [{ name: 'Mock Commander', mana_cost: '{G}' }, 'Plains'];

      jest.spyOn(scryfallService, 'getCardByName').mockReturnValue(of(mockCommander));
      jest.spyOn(deckService, 'buildDeck').mockResolvedValue(mockDeck as any);

      const saveSpy = jest.fn().mockResolvedValue(mockDeck);
      (deckModel.create as jest.Mock).mockReturnValue({ save: saveSpy });

      const result = await deckService.buildAndSaveDeck('Mock Commander');

      expect(scryfallService.getCardByName).toHaveBeenCalledWith('Mock Commander');
      expect(deckService.buildDeck).toHaveBeenCalledWith('Mock Commander');
      expect(deckModel.create).toHaveBeenCalledWith({
        commanderName: mockCommander.name,
        cards: mockDeck,
      });
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual(mockDeck);
    });
  });

  describe('chooseCommander', () => {
    it('should return the commander if it is a Legendary Creature', async () => {
      const mockCommander = { name: 'Mock Commander', type_line: 'Legendary Creature — Elf', color_identity: ['G'] };
      jest.spyOn(scryfallService, 'getCardByName').mockReturnValue(of(mockCommander));

      const result = await deckService.chooseCommander('Mock Commander');

      expect(result).toEqual(mockCommander);
    });
  });

  describe('getDeckById', () => {
    it('should return a deck by id', async () => {
      const mockDeck = { _id: '123', commanderName: 'Mock Commander', cards: [] };
      jest.spyOn(deckModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDeck),
      } as any);

      const result = await deckService.getDeckById('123');

      expect(deckModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockDeck);
    });
  });
});
