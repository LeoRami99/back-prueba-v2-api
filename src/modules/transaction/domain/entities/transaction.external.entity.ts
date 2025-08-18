export class TransactionExternal {
  constructor(
    public acceptance_token: string,
    public amount_in_cents: number,
    public currency: string,
    public signature: string,
    public reference: string,
    public redirect_url: string,
    public customer_email: string,
    public payment_method: {
      type: string;
      installments: number;
      token: string;
    },
  ) {}
}
