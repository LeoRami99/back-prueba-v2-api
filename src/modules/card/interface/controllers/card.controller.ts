import { Controller, Post, Body } from '@nestjs/common';
import { GetCardTokenUseCase } from '../../application/use-cases/get-token-card.use-case';
import { CardDto } from '../dtos/card.dto';

@Controller('cards')
export class CardController {
  constructor(private readonly getCardTokeUseCase: GetCardTokenUseCase) {}

  @Post('token')
  async getTokenCard(@Body() card: CardDto) {
    return await this.getCardTokeUseCase.execute(card);
  }
}
