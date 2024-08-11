import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScryfallService } from './scryfall/scryfall.service';
import { chooseCommander, buildDeck, saveDeckToFile } from './deck_builder';

@Module({
  imports: [HttpModule],
  providers: [ScryfallService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly scryfallService: ScryfallService) {}

  async onModuleInit() {
    const commander = await chooseCommander(this.scryfallService);
    const deck = await buildDeck(this.scryfallService, commander);
    await saveDeckToFile(deck);
    console.log('Deck saved successfully.');
  }
}
