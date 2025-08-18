export class CardEntity {
  constructor(
    public number: string,
    public cvc: string,
    public exp_month: string,
    public exp_year: string,
    public card_holder: string,
  ) {}
}
