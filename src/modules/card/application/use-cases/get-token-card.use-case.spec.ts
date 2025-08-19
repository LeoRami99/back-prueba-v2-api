import { Test, TestingModule } from '@nestjs/testing';
import { GetCardTokenUseCase } from './get-token-card.use-case';
import { CardRepository } from '../../domain/repositories/card.repository';
import { CardEntity } from '../../domain/entities/card.entity';
import { CardTokenEntity } from '../../domain/entities/card.token.entity';

describe('GetCardTokenUseCase', () => {
  let useCase: GetCardTokenUseCase;
  let cardRepository: CardRepository;

  const mockCardEntity: CardEntity = {
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
    const cardRepositoryMock = {
      getCardToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCardTokenUseCase,
        {
          provide: CardRepository,
          useValue: cardRepositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetCardTokenUseCase>(GetCardTokenUseCase);
    cardRepository = module.get<CardRepository>(CardRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a card token successfully', async () => {
      // Arrange
      jest
        .spyOn(cardRepository, 'getCardToken')
        .mockResolvedValue(mockCardTokenEntity);

      // Act
      const result = await useCase.execute(mockCardEntity);

      // Assert
      expect(cardRepository.getCardToken).toHaveBeenCalledWith(mockCardEntity);
      expect(result).toEqual(mockCardTokenEntity);
    });

    it('should throw an error when card token creation fails', async () => {
      // Arrange
      jest.spyOn(cardRepository, 'getCardToken').mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(mockCardEntity)).rejects.toThrow(
        'Error creating card token',
      );
    });

    it('should pass the error when repository throws', async () => {
      // Arrange
      const expectedError = new Error('External API error');
      jest
        .spyOn(cardRepository, 'getCardToken')
        .mockRejectedValue(expectedError);

      // Act & Assert
      await expect(useCase.execute(mockCardEntity)).rejects.toThrow(
        expectedError,
      );
    });
  });
});
