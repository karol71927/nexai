import { OnEvent } from '@nestjs/event-emitter';
import { ClientAssignedEvent } from '../../../../events/client-assigned.event';
import { InjectModel } from '@nestjs/mongoose';
import { ClientAddress } from '../model/client-address.model';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClientAssignedUpsertAddressListener {
  private readonly logger = new Logger(
    ClientAssignedUpsertAddressListener.name,
  );

  constructor(
    @InjectModel(ClientAddress.name)
    private readonly clientAddressModel: Model<ClientAddress>,
  ) {}

  @OnEvent(ClientAssignedEvent.name)
  async handleClientAssignedEvent(event: ClientAssignedEvent) {
    this.logger.debug(`Handling event: ${JSON.stringify(event)}`);

    const clientAddress = await this.clientAddressModel
      .findOne({ email: event.email })
      .exec();

    if (!clientAddress) {
      this.logger.debug('Creating new client address');

      const newClientAddress = new ClientAddress(event.email, [event.address]);

      await this.clientAddressModel.create(newClientAddress);

      return;
    }

    if (clientAddress.addresses.includes(event.address)) {
      this.logger.debug('Address already exists');

      return;
    }

    clientAddress.addresses.push(event.address);

    await clientAddress.save();
  }
}
