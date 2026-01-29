import { CardRepository } from '../../domain/repositories/card.repository';
import { CardEntity } from '../../domain/entities/card.entity';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
      if (!urlTokenCard) {
        throw new InternalServerErrorException(
          'UAT_SANDBOX_URL is not defined',
        );
      }
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
        throw new BadGatewayException('Empty response from token provider');
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number; data?: any };
        message?: string;
      };

      const status = axiosError?.response?.status;
      const providerMessage =
        axiosError?.response?.data?.error?.reason ??
        axiosError?.response?.data?.error?.message ??
        axiosError?.response?.data?.message ??
        axiosError?.message ??
        'Unknown error';

      if (status === 400) {
        throw new BadRequestException({
          message: 'Invalid card payload',
          providerMessage,
        });
      }
      if (status === 422) {
        throw new UnprocessableEntityException({
          message: 'Card data rejected by provider',
          providerMessage,
        });
      }
      if (status && status >= 400 && status < 500) {
        throw new BadRequestException({
          message: 'Client error from provider',
          providerMessage,
        });
      }
      if (status && status >= 500) {
        throw new BadGatewayException({
          message: 'Provider error creating card token',
          providerMessage,
        });
      }

      throw new InternalServerErrorException({
        message: 'Unexpected error creating card token',
        providerMessage,
      });
    }
  }
}
