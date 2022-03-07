import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { ParseFilterPipe } from 'shared/pipes/parse-filter.pipe';
import { BaseController } from 'shared/baseModules/controller';

import { ApiTags } from '@nestjs/swagger';
import { PublisherService } from './service';
import { GetPublisherResponseDTO } from './dtos/get.response.dto';
import { GetFilterDTO } from 'shared/get-filter';
import { ResponseDTO } from 'shared/dtos/response.dto';
import CreatePublisherRequestDto from './dtos/create.request.dto';
import UpdatePublisherRequestDto from './dtos/update.request.dto';

@ApiTags('inbound/transactions/wood-pallets')
@Controller('publisher')
export class PublisherController extends BaseController {
  constructor(private readonly publisherService: PublisherService) {
    super();
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<GetPublisherResponseDTO> {
    return await this.publisherService.getById(id);
  }

  @Get('/')
  async findAll(
    @Query(ParseFilterPipe, ValidationPipe) filter: GetFilterDTO,
  ): Promise<ResponseDTO<GetPublisherResponseDTO>> {
    return await this.publisherService.getAll(filter);
  }

  @Post('/')
  async create(
    @Body()
    body: CreatePublisherRequestDto,
  ): Promise<GetPublisherResponseDTO> {
    return await this.publisherService.create(body);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body()
    body: UpdatePublisherRequestDto,
  ): Promise<GetPublisherResponseDTO> {
    return await this.publisherService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.publisherService.delete(id);
  }
}
