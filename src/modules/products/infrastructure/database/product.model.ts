import { Model, Column, Table, DataType } from 'sequelize-typescript';
@Table({
  tableName: 'products',
  timestamps: true,
})
class ProductModel extends Model<ProductModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: 'COP',
  })
  currency: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;
  @Column
  category: string;
  @Column
  stock: number;
}

export { ProductModel };
