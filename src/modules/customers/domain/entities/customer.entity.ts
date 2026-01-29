export class CustomerEntity {
  constructor(
    public name: string,
    public email: string,
    public phone?: string,
    public id?: string,
  ) {}
}
