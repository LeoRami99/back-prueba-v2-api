export class DeliveryEntity {
  constructor(
    public addressLine1: string,
    public city: string,
    public country: string,
    public postalCode: string,
    public customerId: string,
    public transactionId: string,
    public status: string = 'pending',
    public addressLine2?: string,
    public id?: string,
  ) {}
}
