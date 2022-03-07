import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Publisher } from 'typeorm/entities';
import { mockRepository } from 'shared/tests/baseMocks';

import { GameController } from '../controller';
import { GameService } from '../service';
import { mockGameDTOs, mockGameRequestDTO, mockPublisher } from './mocks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const gameServiceMock: () => PublisherService = jest.fn(() => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  getPublisherByGameId: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
}));

describe('Games Controller', () => {
  let controller: GameController;
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useFactory: gameServiceMock,
        },
        {
          provide: getRepositoryToken(Publisher),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  it('Should have defined properties', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('When calling findAll()', () => {
    it('Should have a method called findAll', () => {
      expect(controller.findAll).toBeDefined();
      expect(controller.findAll).toBeInstanceOf(Function);
    });

    it('Should call service.getAll', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue({ data: mockGameDTOs });

      const result = await controller.findAll({ limit: 20 });

      expect(service.getAll).toHaveBeenCalledTimes(1);
      expect(service.getAll).toHaveBeenCalledWith({ limit: 20 });
      expect(result).toEqual({ data: mockGameDTOs });
    });
  });

  describe('When calling findById()', () => {
    it('Should have a method called findAll', () => {
      expect(controller.findById).toBeDefined();
      expect(controller.findById).toBeInstanceOf(Function);
    });

    it('Should call service.getById', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockGameDTOs[0]);

      const result = await controller.findById(1);

      expect(service.getById).toHaveBeenCalledTimes(1);
      expect(service.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGameDTOs[0]);
    });
  });

  describe('When calling getPublisherByGameId()', () => {
    it('Should have a method called getPublisherByGameId', () => {
      expect(controller.getPublisherByGameId).toBeDefined();
      expect(controller.getPublisherByGameId).toBeInstanceOf(Function);
    });

    it('Should call service.getPublisherByGameId', async () => {
      jest
        .spyOn(service, 'getPublisherByGameId')
        .mockResolvedValue(mockPublisher);

      const result = await controller.getPublisherByGameId(1);

      expect(service.getPublisherByGameId).toHaveBeenCalledTimes(1);
      expect(service.getPublisherByGameId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPublisher);
    });
  });

  describe('When calling delete()', () => {
    it('Should have a method called delete', () => {
      expect(controller.delete).toBeDefined();
      expect(controller.delete).toBeInstanceOf(Function);
    });

    it('Should call service.delete', async () => {
      jest.spyOn(service, 'delete');

      await controller.delete(1);

      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('When calling update()', () => {
    it('Should have a method called update', () => {
      expect(controller.update).toBeDefined();
      expect(controller.update).toBeInstanceOf(Function);
    });

    it('Should call service.update', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockGameDTOs[0]);

      const result = await controller.update(1, mockGameRequestDTO);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, mockGameRequestDTO);
      expect(result).toEqual(mockGameDTOs[0]);
    });
  });

  describe('When calling create()', () => {
    it('Should have a method called create', () => {
      expect(controller.create).toBeDefined();
      expect(controller.create).toBeInstanceOf(Function);
    });

    it('Should call service.create', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockGameDTOs[0]);

      const result = await controller.create(mockGameRequestDTO);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(mockGameRequestDTO);
      expect(result).toEqual(mockGameDTOs[0]);
    });
  });
});
