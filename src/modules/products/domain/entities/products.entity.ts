export class ProductsEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
    public currency: string = 'COP',
    public description: string,
    public image: string,
    public category?: string,
    public stock?: number,
  ) {}
}
