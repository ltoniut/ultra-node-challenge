import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Game, Publisher } from 'typeorm/entities';
import { mockRepository } from 'shared/tests/baseMocks';

import {
  mockGames,
  mockGameDTOs,
  mockGameRequestDTO,
  mockPublisher,
} from './mocks';
import { GameService } from '../service';
import { NotFoundException } from '@nestjs/common';
import { mockPublisherDTO } from 'modules/publisher/tests/mocks';

describe('Games Service', () => {
  let service: GameService;
  let gameRepository;
  let publisherRepository;
  const id = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Publisher),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepository = module.get(getRepositoryToken(Game));
    publisherRepository = module.get(getRepositoryToken(Publisher));
  });

  it('Should have defined properties', () => {
    expect(service).toBeDefined();
  });

  describe('When calling getAll()', () => {
    it('Should have getAll() defined', () => {
      expect(service.getAll).toBeDefined();
      expect(service.getAll).toBeInstanceOf(Function);
    });

    it('Should return a list of games', async () => {
      gameRepository.find.mockResolvedValue(mockGames);
      jest.spyOn(service, 'getAll');

      const result = await service.getAll({ limit: 20, offset: 0 });

      expect(service.getAll).toHaveBeenCalled();
      await expect(result).toEqual({ data: mockGameDTOs });
    });
  });

  describe('When calling getById()', () => {
    it('Should have getById() defined', () => {
      expect(service.getById).toBeDefined();
      expect(service.getById).toBeInstanceOf(Function);
    });

    it('Should return a game DTO if it is found', async () => {
      gameRepository.findOne.mockResolvedValue(mockGames[0]);
      jest.spyOn(service, 'getAll');

      const result = await service.getById(1);

      await expect(result).toEqual(mockGameDTOs[0]);
    });

    it('Should throw an exception if game is not found', async () => {
      gameRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'getAll');

      await expect(service.getById(id)).rejects.toThrow(
        new NotFoundException(`Game with id ${id} was not found`),
      );
    });
  });

  describe('When calling getPublisherByGameId()', () => {
    it('Should have getPublisherByGameId() defined', () => {
      expect(service.getPublisherByGameId).toBeDefined();
      expect(service.getPublisherByGameId).toBeInstanceOf(Function);
    });

    it('Should return a publisher DTO if it is found', async () => {
      gameRepository.findOne.mockResolvedValue(mockGames[0]);
      publisherRepository.findOne.mockResolvedValue(mockPublisher);
      jest.spyOn(service, 'getPublisherByGameId');

      const result = await service.getPublisherByGameId(1);

      await expect(result).toEqual(mockPublisherDTO);
    });

    it('Should throw an exception if game is not found', async () => {
      gameRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'getPublisherByGameId');

      await expect(service.getPublisherByGameId(id)).rejects.toThrow(
        new NotFoundException(`Game with id ${id} was not found`),
      );
    });

    it('Should throw an exception if publisher is not found', async () => {
      gameRepository.findOne.mockResolvedValue(mockGames[0]);
      publisherRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'getPublisherByGameId');

      await expect(service.getPublisherByGameId(id)).rejects.toThrow(
        new NotFoundException(`Publisher with id ${id} was not found`),
      );
    });
  });

  describe('When calling delete()', () => {
    it('Should have delete() defined', () => {
      expect(service.delete).toBeDefined();
      expect(service.delete).toBeInstanceOf(Function);
    });

    it('Should delete game if it is found', async () => {
      gameRepository.findOne.mockResolvedValue(mockGames[0]);
      jest.spyOn(service, 'delete');
      jest.spyOn(gameRepository, 'delete');

      await service.delete(id);

      await expect(gameRepository.delete).toHaveBeenCalledWith(1);
    });

    it('Should throw an exception if game is not found', async () => {
      gameRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'delete');

      await expect(service.delete(id)).rejects.toThrow(
        new NotFoundException(`Game with id ${id} was not found`),
      );
    });
  });

  describe('When calling update()', () => {
    it('Should have update() defined', () => {
      expect(service.update).toBeDefined();
      expect(service.update).toBeInstanceOf(Function);
    });

    it('Should update game if it is found', async () => {
      gameRepository.findOne.mockResolvedValue({
        ...mockGames[0],
        name: 'Previous name',
      });
      publisherRepository.findOne.mockResolvedValue(mockPublisher);
      gameRepository.save.mockResolvedValue(mockGames[0]);
      jest.spyOn(service, 'update');
      jest.spyOn(gameRepository, 'save');

      const response = await service.update(id, mockGameRequestDTO);

      expect(gameRepository.save).toHaveBeenCalledWith({
        id,
        ...mockGameRequestDTO,
        tags: 'Action||Adventure',
      });
      expect(response).toEqual(mockGameDTOs[0]);
    });

    it('Should throw an exception if game is not found', async () => {
      gameRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'update');

      await expect(service.update(id, mockGameRequestDTO)).rejects.toThrow(
        new NotFoundException(`Game with id ${id} was not found`),
      );
    });

    it('Should throw an exception if publisher is not found', async () => {
      gameRepository.findOne.mockResolvedValue({
        ...mockGames[0],
        name: 'Previous name',
      });
      publisherRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'update');

      await expect(service.update(id, mockGameRequestDTO)).rejects.toThrow(
        new NotFoundException(
          `Publisher with id ${mockGameRequestDTO.publisherId} was not found`,
        ),
      );
    });
  });

  describe('When calling create()', () => {
    it('Should have create() defined', () => {
      expect(service.create).toBeDefined();
      expect(service.create).toBeInstanceOf(Function);
    });

    it('Should create game if publisher is found', async () => {
      jest.spyOn(service, 'create');
      jest.spyOn(gameRepository, 'save');
      publisherRepository.findOne.mockResolvedValue(mockPublisher);
      gameRepository.save.mockResolvedValue(mockGames[0]);

      const response = await service.create(mockGameRequestDTO);

      expect(gameRepository.save).toHaveBeenCalledWith({
        ...mockGameRequestDTO,
        tags: 'Action||Adventure',
      });

      expect(response).toEqual(mockGameDTOs[0]);
    });

    it('Should throw an exception if publisher is not found', async () => {
      publisherRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'update');

      await expect(service.create(mockGameRequestDTO)).rejects.toThrow(
        new NotFoundException(
          `Publisher with id ${mockGameRequestDTO.publisherId} was not found`,
        ),
      );
    });
  });

  describe('When calling applyGameMaintenance()', () => {
    it('Should have applyGameMaintenance() defined', () => {
      expect(service.applyGameMaintenance).toBeDefined();
      expect(service.applyGameMaintenance).toBeInstanceOf(Function);
    });

    it('Should update and delete corresponding games', async () => {
      jest.spyOn(service, 'applyGameMaintenance');
      jest.spyOn(gameRepository, 'save');
      jest.spyOn(gameRepository, 'delete');

      gameRepository.find.mockResolvedValueOnce([mockGames[2]]);
      gameRepository.find.mockResolvedValueOnce([mockGames[3]]);

      await service.applyGameMaintenance();

      expect(gameRepository.save).toHaveBeenCalledWith({
        id: mockGameDTOs[2].id,
        price: mockGameDTOs[2].price * 0.8,
      });
      expect(gameRepository.delete).toHaveBeenCalledWith(mockGames[3].id);
    });
  });
});
