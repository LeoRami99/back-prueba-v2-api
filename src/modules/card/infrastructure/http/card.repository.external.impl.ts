import { CardRepository } from '../../domain/repositories/card.repository';
import { CardEntity } from '../../domain/entities/card.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios/dist';
import { CardTokenEntity } from '../../domain/entities/card.token.entity';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CardRepositoryExternalHttp implements CardRepository {
  constructor(private readonly httpService: HttpService) {}
  async getCardToken(card: CardEntity): Promise<CardTokenEntity> {
    try {
      const urlTokenCard = process.env.UAT_SANDBOX_URL;
      const uriTokenCard = `${urlTokenCard}/tokens/cards`;
      const response: AxiosResponse<CardTokenEntity> = await firstValueFrom(
        this.httpService.post<CardTokenEntity>(uriTokenCard, card, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.PUBLIC_KEY}`,
          },
        }),
      );
      if (!response?.data) {
        throw new HttpException(
          {
            statusCode: 400,
            message: 'Error creating card token',
          },
          400,
        );
      }
      return response.data;
    } catch (error: unknown) {
      throw new HttpException(
        {
          statusCode: 500,
          message: 'Error creating card token',
          error: error,
        },
        500,
      );
    }
  }
}
