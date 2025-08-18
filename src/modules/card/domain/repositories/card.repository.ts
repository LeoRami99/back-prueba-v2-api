import { CardEntity } from '../entities/card.entity';
import { CardTokenEntity } from '../entities/card.token.entity';

export abstract class CardRepository {
  abstract getCardToken(card: CardEntity): Promise<CardTokenEntity>;
}
