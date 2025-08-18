import { Model, Column, Table, DataType } from 'sequelize-typescript';

// id: string,
// amount: number,
// status: string,
// userId: string,
// methodPayment: string,
// productId: string,
// price: number,

@Table({
  tableName: 'transactions',
  timestamps: true,
})
class TransactionModel extends Model<TransactionModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  referenceInternalTransaction: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;
  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'canceled'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  idExternalTransaction: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  methodPayment: string;
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  productId: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;
}

export { TransactionModel };
