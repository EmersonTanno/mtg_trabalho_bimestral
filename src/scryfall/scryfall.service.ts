import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class ScryfallService {
  private readonly apiUrl = 'https://api.scryfall.com';

  constructor(private readonly httpService: HttpService) {}

  searchCards(query: string) {
    return this.httpService.get(`${this.apiUrl}/cards/search?q=${query}`).pipe(
      map(response => response.data)
    );
  }

  getCardByName(name: string) {
    return this.httpService.get(`${this.apiUrl}/cards/named?exact=${name}`).pipe(
      map(response => response.data)
    );
  }
}

