import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScryfallService } from './scryfall.service';

@Module({
  imports: [HttpModule],
  providers: [ScryfallService],
  exports: [ScryfallService], 
})
export class ScryfallModule {}