import { Model, Column, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'customers',
  timestamps: true,
})
class CustomerModel extends Model<CustomerModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(120),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  phone?: string;
}

export { CustomerModel };
