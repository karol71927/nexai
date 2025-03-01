import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ClientAddress,
  ClientAddressSchema,
} from './model/client-address.model';
import { ClientAssignedUpsertAddressListener } from './listener/client-assigned-upsert-address.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientAddress.name, schema: ClientAddressSchema },
    ]),
  ],
  providers: [ClientAssignedUpsertAddressListener],
})
export class ClientAddressModule {}
