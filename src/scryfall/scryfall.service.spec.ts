import { Test, TestingModule } from '@nestjs/testing';
import { ScryfallService } from './scryfall.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ScryfallService', () => {
  let scryfallService: ScryfallService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScryfallService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    scryfallService = module.get<ScryfallService>(ScryfallService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(scryfallService).toBeDefined();
  });

  describe('searchCards', () => {
    it('should return cards from the api', async () => {
      const mockResponse = {
        data: {
          data: [
            { name: 'Mock Card', color_identity: ['G'] },
          ],
        },
      };

      const response = [
        { name: 'Mock Card', color_identity: ['G'] },
      ];

      (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await scryfallService.searchCards('mock query').toPromise();

      expect(result.data).toEqual(response);
    });
  });


  describe('searchCardByName', () => {
    it('should return one card from the api by name', async () => {
      const mockResponse = {
        data: {
          data: [
            { name: 'Mock Card', color_identity: ['G'] },
          ],
        },
      };

      const response = [
        { name: 'Mock Card', color_identity: ['G'] },
      ];

      (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await scryfallService.getCardByName('mock query').toPromise();
      
      expect(result.data).toEqual(response);
    });
  });
});
