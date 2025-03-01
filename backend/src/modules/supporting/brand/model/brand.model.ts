import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Brand {
  @Prop({ unique: true })
  name: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
