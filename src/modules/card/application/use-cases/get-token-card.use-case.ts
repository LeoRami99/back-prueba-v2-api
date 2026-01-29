import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CardEntity } from '../../domain/entities/card.entity';
import { CardTokenEntity } from '../../domain/entities/card.token.entity';
import { CardRepository } from '../../domain/repositories/card.repository';

@Injectable()
export class GetCardTokenUseCase {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(data: CardEntity): Promise<CardTokenEntity> {
    const cardToken: CardTokenEntity =
      await this.cardRepository.getCardToken(data);
    if (!cardToken) {
      throw new InternalServerErrorException('Error creating card token');
    }
    return cardToken;
  }
}
