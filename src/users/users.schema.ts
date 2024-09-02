import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/roles/enum/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    userId: number;

    @Prop({ required: true })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
