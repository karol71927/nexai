import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Car {
  _id: string;

  @Prop()
  brand: string;

  @Prop({ unique: true })
  vin: string;

  @Prop({ unique: true })
  registrationNumber: string;

  @Prop({
    required: false,
    type: {
      email: String,
      address: String,
    },
  })
  client: {
    email: string;
    address: string;
  } | null;

  @Prop({ required: false, type: String })
  location: string | null;

  constructor(brand: string, vin: string, registrationNumber: string) {
    this.brand = brand;
    this.vin = vin;
    this.registrationNumber = registrationNumber;
  }
}

export const CarSchema = SchemaFactory.createForClass(Car);
