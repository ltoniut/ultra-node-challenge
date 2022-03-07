import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Publisher } from 'typeorm/entities';
import { mockRepository } from 'shared/tests/baseMocks';

import { PublisherController } from '../controller';
import { PublisherService } from '../service';
import { mockPublisherDTO, mockPublisherRequestDTO } from './mocks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const publisherServiceMock: () => PublisherService = jest.fn(() => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
}));

describe('Publishers Controller', () => {
  let controller: PublisherController;
  let service: PublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
      providers: [
        {
          provide: PublisherService,
          useFactory: publisherServiceMock,
        },
        {
          provide: getRepositoryToken(Publisher),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PublisherController>(PublisherController);
    service = module.get<PublisherService>(PublisherService);
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
      jest
        .spyOn(service, 'getAll')
        .mockResolvedValue({ data: [mockPublisherDTO] });

      const result = await controller.findAll({ limit: 20 });

      expect(service.getAll).toHaveBeenCalledTimes(1);
      expect(service.getAll).toHaveBeenCalledWith({ limit: 20 });
      expect(result).toEqual({ data: [mockPublisherDTO] });
    });
  });

  describe('When calling findById()', () => {
    it('Should have a method called findAll', () => {
      expect(controller.findById).toBeDefined();
      expect(controller.findById).toBeInstanceOf(Function);
    });

    it('Should call service.findById', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockPublisherDTO);

      const result = await controller.findById(1);

      expect(service.getById).toHaveBeenCalledTimes(1);
      expect(service.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPublisherDTO);
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
      jest.spyOn(service, 'update').mockResolvedValue(mockPublisherDTO);

      const result = await controller.update(1, { ...mockPublisherRequestDTO });

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, {
        ...mockPublisherRequestDTO,
      });
      expect(result).toEqual(mockPublisherDTO);
    });
  });

  describe('When calling create()', () => {
    it('Should have a method called create', () => {
      expect(controller.create).toBeDefined();
      expect(controller.create).toBeInstanceOf(Function);
    });

    it('Should call service.create', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockPublisherDTO);

      const result = await controller.create(mockPublisherRequestDTO);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(mockPublisherRequestDTO);
      expect(result).toEqual(mockPublisherDTO);
    });
  });
});
