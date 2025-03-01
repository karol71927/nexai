export class CarHttpResponse {
  id: string;
  brand: string;
  vin: string;
  registrationNumber: string;
  client: {
    email: string;
    address: string;
  };
  isRented: boolean;
  location: string;
}
