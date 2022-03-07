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
import { GameService } from './service';
import { GetGameResponseDTO } from './dtos/get.response.dto';
import { GetFilterDTO } from 'shared/get-filter';
import { ResponseDTO } from 'shared/dtos/response.dto';
import { GetPublisherResponseDTO } from 'modules/publisher/dtos/get.response.dto';
import CreateGameRequestDto from './dtos/create.request.dto';
import UpdateGameRequestDto from './dtos/update.request.dto';

@ApiTags('inbound/transactions/wood-pallets')
@Controller('game')
export class GameController extends BaseController {
  constructor(private readonly gameService: GameService) {
    super();
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<GetGameResponseDTO> {
    return await this.gameService.getById(id);
  }

  @Get('/:id/publisher')
  async getPublisherByGameId(
    @Param('id') id: number,
  ): Promise<GetPublisherResponseDTO> {
    return await this.gameService.getPublisherByGameId(id);
  }

  @Get('/')
  async findAll(
    @Query(ParseFilterPipe, ValidationPipe) filter: GetFilterDTO,
  ): Promise<ResponseDTO<GetGameResponseDTO>> {
    return await this.gameService.getAll(filter);
  }

  @Post('/')
  async create(
    @Body()
    body: CreateGameRequestDto,
  ): Promise<GetGameResponseDTO> {
    return await this.gameService.create(body);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body()
    body: UpdateGameRequestDto,
  ): Promise<GetGameResponseDTO> {
    return await this.gameService.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.gameService.delete(id);
  }
}
