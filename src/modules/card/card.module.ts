import { Module } from '@nestjs/common';
import { CardController } from './interface/controllers/card.controller';
import { GetCardTokenUseCase } from './application/use-cases/get-token-card.use-case';
import { HttpModule } from '@nestjs/axios';
import { CardRepositoryExternalHttp } from './infrastructure/http/card.repository.external.impl';
import { CardRepository } from './domain/repositories/card.repository';

@Module({
  imports: [HttpModule],
  controllers: [CardController],
  providers: [
    GetCardTokenUseCase,
    {
      provide: CardRepository,
      useClass: CardRepositoryExternalHttp,
    },
  ],
})
export class CardModule {}
