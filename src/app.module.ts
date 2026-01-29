import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { ProductsModule } from './modules/products/products.module';
import { CardModule } from './modules/card/card.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: () => databaseConfig,
    }),
    ProductsModule,
    CardModule,
    TransactionModule,
    WebhookModule,
    CustomersModule,
    DeliveriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
