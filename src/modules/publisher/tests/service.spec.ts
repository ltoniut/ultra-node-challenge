import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Publisher } from 'typeorm/entities';
import { mockRepository } from 'shared/tests/baseMocks';
import { ResponseDTO } from 'shared/dtos/response.dto';

import {
  mockPublisher,
  mockPublisherDTO,
  mockPublisherRequestDTO,
} from './mocks';
import { PublisherService } from '../service';
import { NotFoundException } from '@nestjs/common';

describe('Publishers Service', () => {
  let service: PublisherService;
  let publisherRepository;
  const id = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherService,
        {
          provide: getRepositoryToken(Publisher),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
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

    it('Should return a list of publishers', async () => {
      publisherRepository.find.mockResolvedValue([mockPublisher]);
      jest.spyOn(service, 'getAll');

      const result = await service.getAll({ limit: 20, offset: 0 });

      expect(service.getAll).toHaveBeenCalled();
      await expect(result).toEqual(new ResponseDTO([mockPublisherDTO]));
    });
  });

  describe('When calling getById()', () => {
    it('Should have getById() defined', () => {
      expect(service.getById).toBeDefined();
      expect(service.getById).toBeInstanceOf(Function);
    });

    it('Should return a publisher DTO if it is found', async () => {
      publisherRepository.findOne.mockResolvedValue(mockPublisher);
      jest.spyOn(service, 'getAll');

      const result = await service.getById(id);

      await expect(result).toEqual(mockPublisherDTO);
    });

    it('Should throw an exception if publisher is not found', async () => {
      publisherRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'getAll');

      await expect(service.getById(id)).rejects.toThrow(
        new NotFoundException(`Publisher with id ${id} was not found`),
      );
    });
  });

  describe('When calling delete()', () => {
    it('Should have delete() defined', () => {
      expect(service.delete).toBeDefined();
      expect(service.delete).toBeInstanceOf(Function);
    });

    it('Should delete publisher if it is found', async () => {
      publisherRepository.findOne.mockResolvedValue(mockPublisher);
      jest.spyOn(service, 'delete');
      jest.spyOn(publisherRepository, 'delete');

      await service.delete(id);

      await expect(publisherRepository.delete).toHaveBeenCalledWith(id);
    });

    it('Should throw an exception if publisher is not found', async () => {
      publisherRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'delete');

      await expect(service.delete(id)).rejects.toThrow(
        new NotFoundException(`Publisher with id ${id} was not found`),
      );
    });
  });

  describe('When calling update()', () => {
    it('Should have update() defined', () => {
      expect(service.update).toBeDefined();
      expect(service.update).toBeInstanceOf(Function);
    });

    it('Should update publisher if it is found', async () => {
      publisherRepository.findOne.mockResolvedValue({
        ...mockPublisher,
        title: 'Previous name',
      });
      publisherRepository.save.mockResolvedValue(mockPublisher);
      jest.spyOn(service, 'update');
      jest.spyOn(publisherRepository, 'save');

      const response = await service.update(id, mockPublisherRequestDTO);

      expect(publisherRepository.save).toHaveBeenCalledWith({
        id,
        dto: { ...mockPublisherRequestDTO },
      });
      expect(response).toEqual(mockPublisherDTO);
    });

    it('Should throw an exception if publisher is not found', async () => {
      publisherRepository.findOne.mockResolvedValue(undefined);
      jest.spyOn(service, 'update');

      await expect(service.update(id, mockPublisherRequestDTO)).rejects.toThrow(
        new NotFoundException(`Publisher with id ${id} was not found`),
      );
    });
  });

  describe('When calling create()', () => {
    it('Should have create() defined', () => {
      expect(service.create).toBeDefined();
      expect(service.create).toBeInstanceOf(Function);
    });

    it('Should update publisher if it is found', async () => {
      jest.spyOn(service, 'create');
      jest.spyOn(publisherRepository, 'save');

      publisherRepository.save.mockResolvedValue(mockPublisher);

      const response = await service.create(mockPublisherRequestDTO);

      expect(publisherRepository.save).toHaveBeenCalledWith(
        mockPublisherRequestDTO,
      );

      expect(response).toEqual(mockPublisherDTO);
    });
  });
});
