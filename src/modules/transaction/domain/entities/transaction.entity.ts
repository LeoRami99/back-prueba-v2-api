export class TransactionEntity {
  constructor(
    public amount: number,
    public userId: string,
    public methodPayment: string,
    public productId: string,
    public price: number,
    public referenceInternalTransaction?: string,
    public idExternalTransaction?: string,
    public id?: string,
    public status?: string,
  ) {}
}

export class TransactionExternalParams {
  constructor(
    public idEsternalTransaction: string,
    public status: string,
  ) {}
}
