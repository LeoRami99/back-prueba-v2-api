export class CardTokenEntity {
  constructor(
    public id: string,
    public created_at: string,
    public brand: string,
    public name: string,
    public last_four: string,
    public bin: string,
    public exp_year: string,
    public exp_month: string,
    public card_holder: string,
    public created_with_cvc: boolean,
    public expires_at: string,
    public validity_ends_at: string,
  ) {}
}
