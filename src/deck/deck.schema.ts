import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeckDocument = Deck & Document;

@Schema()
export class Deck {
  @Prop({ required: true })
  commanderName: string;

  @Prop({ required: true, type: Array })
  cards: string[];
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
