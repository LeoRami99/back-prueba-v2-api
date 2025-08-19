import { Controller, Post, Body } from '@nestjs/common';
import { GetCardTokenUseCase } from '../../application/use-cases/get-token-card.use-case';
import { CardDto } from '../dtos/card.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly getCardTokeUseCase: GetCardTokenUseCase) {}

  @ApiOperation({ summary: 'Generate card token' })
  @ApiBody({ type: CardDto })
  @ApiResponse({
    status: 201,
    description: 'Card token successfully generated',
    schema: {
      properties: {
        token: { type: 'string', example: 'tkn_live_1a2b3c4d5e6f7g8h9i0j' },
        card_type: { type: 'string', example: 'visa' },
        last_four: { type: 'string', example: '1111' },
        expiration_date: { type: 'string', example: '12/2025' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid card data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('token')
  async getTokenCard(@Body() card: CardDto) {
    return await this.getCardTokeUseCase.execute(card);
  }
}
