import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { BaseService } from 'shared/baseModules/service';
import { ResponseDTO } from 'shared/dtos/response.dto';
import { GetFilterDTO } from 'shared/get-filter';
import { Repository } from 'typeorm';
import { Publisher } from 'typeorm/entities';
import CreatePublisherRequestDto from './dtos/create.request.dto';
import { GetPublisherResponseDTO } from './dtos/get.response.dto';
import UpdatePublisherRequestDto from './dtos/update.request.dto';

@Injectable()
export class PublisherService extends BaseService {
  constructor(
    @InjectRepository(Publisher)
    private readonly repository: Repository<Publisher>,
  ) {
    super();
  }

  async getById(id: number): Promise<GetPublisherResponseDTO> {
    console.log(`Looking for publisher with id ${id}`);
    const publisher = await this.repository.findOne({ id });
    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} was not found`);
    }

    console.log(`Creating publisher response object`);
    const publisherResponse = plainToClass(GetPublisherResponseDTO, publisher);

    return publisherResponse;
  }

  async create(
    dto: CreatePublisherRequestDto,
  ): Promise<GetPublisherResponseDTO> {
    console.log(`Creating new publisher entry`);
    const publisher = await this.repository.save(dto);

    console.log(`Creating publisher response object`);
    const publisherResponse = plainToClass(GetPublisherResponseDTO, publisher);

    return publisherResponse;
  }

  async update(
    id: number,
    dto: UpdatePublisherRequestDto,
  ): Promise<GetPublisherResponseDTO> {
    console.log(`Looking for publisher with id ${id}`);
    const publisher = await this.repository.findOne({ id });

    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} was not found`);
    }

    console.log(`Updating publisher data`);
    const updatedPublisher = await this.repository.save({ id, dto });

    console.log(`Creating publisher response object`);
    const publisherResponse = plainToClass(
      GetPublisherResponseDTO,
      updatedPublisher,
    );

    return publisherResponse;
  }

  async delete(id: number) {
    console.log(`Looking for publisher with id ${id}`);
    const publisher = await this.repository.findOne({ id });

    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} was not found`);
    }

    console.log(`Deleting publisher`);
    await this.repository.delete(id);
  }

  async getAll(
    filter: GetFilterDTO,
  ): Promise<ResponseDTO<GetPublisherResponseDTO>> {
    console.log(`Fetching publishers`);
    const publishers = await this.repository.find({
      skip: filter.offset,
      take: filter.limit,
    });

    return new ResponseDTO(plainToClass(GetPublisherResponseDTO, publishers));
  }
}
