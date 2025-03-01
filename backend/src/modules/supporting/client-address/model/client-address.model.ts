import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ClientAddress {
  name = 'client_address';

  @Prop({
    unique: true,
  })
  email: string;

  @Prop({
    type: [String],
  })
  addresses: string[];

  constructor(email: string, addresses: string[]) {
    this.email = email;
    this.addresses = addresses;
  }
}

export const ClientAddressSchema = SchemaFactory.createForClass(ClientAddress);
