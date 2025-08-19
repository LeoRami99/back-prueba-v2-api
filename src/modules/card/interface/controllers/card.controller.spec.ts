import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { GetCardTokenUseCase } from '../../application/use-cases/get-token-card.use-case';
import { CardDto } from '../dtos/card.dto';
import { CardTokenEntity } from '../../domain/entities/card.token.entity';

describe('CardController', () => {
  let controller: CardController;
  let getCardTokenUseCase: GetCardTokenUseCase;

  const mockCardDto: CardDto = {
    number: '4242424242424242',
    cvc: '123',
    exp_month: '12',
    exp_year: '2030',
    card_holder: 'Test User',
  };

  const mockCardTokenEntity: CardTokenEntity = {
    id: 'tok_test_12345',
    created_at: '2025-08-19T10:00:00.000Z',
    brand: 'VISA',
    name: 'Test User',
    last_four: '4242',
    bin: '424242',
    exp_year: '2030',
    exp_month: '12',
    card_holder: 'Test User',
    created_with_cvc: true,
    expires_at: '2025-08-20T10:00:00.000Z',
    validity_ends_at: '2025-08-20T10:00:00.000Z',
  };

  beforeEach(async () => {
    const getCardTokenUseCaseMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: GetCardTokenUseCase,
          useValue: getCardTokenUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    getCardTokenUseCase = module.get<GetCardTokenUseCase>(GetCardTokenUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTokenCard', () => {
    it('should return a card token successfully', async () => {
      // Arrange
      jest
        .spyOn(getCardTokenUseCase, 'execute')
        .mockResolvedValue(mockCardTokenEntity);

      // Act
      const result = await controller.getTokenCard(mockCardDto);

      // Assert
      expect(getCardTokenUseCase.execute).toHaveBeenCalledWith(mockCardDto);
      expect(result).toEqual(mockCardTokenEntity);
    });

    it('should handle errors when card token creation fails', async () => {
      // Arrange
      const expectedError = new Error('Error creating card token');
      jest
        .spyOn(getCardTokenUseCase, 'execute')
        .mockRejectedValue(expectedError);

      // Act & Assert
      await expect(controller.getTokenCard(mockCardDto)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
