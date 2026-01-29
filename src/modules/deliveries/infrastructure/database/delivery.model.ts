import { Model, Column, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'deliveries',
  timestamps: true,
})
class DeliveryModel extends Model<DeliveryModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  addressLine1: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  addressLine2?: string;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
  })
  country: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  postalCode: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customerId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  transactionId: string;

  @Column({
    type: DataType.ENUM('pending', 'shipped', 'delivered', 'canceled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;
}

export { DeliveryModel };
