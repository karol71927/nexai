export class ClientAssignedEvent {
  name = ClientAssignedEvent.name;

  constructor(
    public readonly carId: string,
    public readonly email: string,
    public readonly address: string,
  ) {}
}
