import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { GetPublisherResponseDTO } from 'modules/publisher/dtos/get.response.dto';
import { BaseService } from 'shared/baseModules/service';
import { ResponseDTO } from 'shared/dtos/response.dto';
import { GetFilterDTO } from 'shared/get-filter';
import { deleteMonths, discountMonths } from 'shared/globalVars';
import { LessThan, Repository } from 'typeorm';
import { Game, Publisher } from 'typeorm/entities';
import CreateGameRequestDto from './dtos/create.request.dto';
import { GetGameResponseDTO } from './dtos/get.response.dto';
import UpdateGameRequestDto from './dtos/update.request.dto';

@Injectable()
export class GameService extends BaseService {
  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {
    super();
  }

  async getById(id: number): Promise<GetGameResponseDTO> {
    console.log(`Looking for game with id ${id}`);
    const game = await this.repository.findOne({ id });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} was not found`);
    }

    console.log(`Creating game response object`);
    const gameData = {
      ...game,
      tags: game.tags ? game.tags.split('||') : [],
      publisher: game.publisherEntity.name,
    };

    const gameResponse = plainToClass(GetGameResponseDTO, gameData);

    return gameResponse;
  }

  async getAll(filter: GetFilterDTO): Promise<ResponseDTO<GetGameResponseDTO>> {
    console.log(`Fetching games`);
    const games = await this.repository.find({
      skip: filter.offset,
      take: filter.limit,
    });

    console.log(`Mapping games to response objects`);
    const parsedData = games.map((game) => {
      return {
        ...game,
        tags: game.tags ? game.tags.split('||') : [],
        publisher: game.publisherEntity.name,
      };
    });

    const gameData = plainToClass(GetGameResponseDTO, parsedData);

    return { data: gameData };
  }

  async getPublisherByGameId(id: number): Promise<GetPublisherResponseDTO> {
    console.log(`Looking for game with id ${id}`);
    const game = await this.repository.findOne({ id });

    if (!game) {
      throw new NotFoundException(`Game with id ${id} was not found`);
    }

    console.log(`Looking for publisher with id ${game.publisher}`);
    const publisher = await this.publisherRepository.findOne({
      id: game.publisher,
    });

    // This should never be the case, but I'm verifying the publisher so that
    // it isn't considered a Publisher | undefined variable later on in the code.
    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} was not found`);
    }

    console.log(`Creating publisher response object`);
    const publisherResponse = plainToClass(GetPublisherResponseDTO, publisher);

    return publisherResponse;
  }

  async update(
    id: number,
    dto: UpdateGameRequestDto,
  ): Promise<GetGameResponseDTO> {
    console.log(`Looking for game with id ${id}`);
    const game = await this.repository.findOne(id);

    if (!game) {
      throw new NotFoundException(`Game with id ${id} was not found`);
    }

    console.log(`Looking for publisher with id ${dto.publisherId}`);
    const publisher = await this.publisherRepository.findOne(dto.publisherId);
    if (!publisher) {
      throw new NotFoundException(
        `Publisher with id ${dto.publisherId} was not found`,
      );
    }

    const tags = dto.tags.join('||');

    console.log(`Updating game data`);
    const gameResponse = await this.repository.save({ id, ...dto, tags });

    const gameData = plainToClass(GetGameResponseDTO, {
      ...gameResponse,
      publisher: publisher.name,
      tags: dto.tags,
    });

    return gameData;
  }

  async create(dto: CreateGameRequestDto): Promise<GetGameResponseDTO> {
    console.log(`Looking for publisher with id ${dto.publisherId}`);
    const publisher = await this.publisherRepository.findOne(dto.publisherId);

    if (!publisher) {
      throw new NotFoundException(
        `Publisher with id ${dto.publisherId} was not found`,
      );
    }

    const tags = dto.tags.join('||');

    console.log(`Creating new game entry`);
    const gameResponse = await this.repository.save({ ...dto, tags });

    const gameData = plainToClass(GetGameResponseDTO, {
      ...gameResponse,
      publisher: publisher.name,
      tags: dto.tags,
    });

    return gameData;
  }

  async delete(id: number) {
    console.log(`Looking for publisher with id ${id}`);
    const game = await this.repository.findOne({ id });

    if (!game) {
      throw new NotFoundException(`Game with id ${id} was not found`);
    }

    console.log(`Deleting game`);
    await this.repository.delete(id);
  }

  // applyGameMaintenance will run once per hour.
  @Cron('0 * * * *')
  async applyGameMaintenance() {
    const now = new Date();
    const deprecationDate = now;
    const discountDate = now;

    deprecationDate.setMonth(now.getMonth() - deleteMonths);
    discountDate.setMonth(now.getMonth() - discountMonths);

    console.log(`Looking for games set for discount`);
    const discountableGames = await this.repository.find({
      releaseDate: LessThan(discountDate),
    });

    console.log(`Looking for games set for deprecation`);
    const deletableGames = await this.repository.find({
      releaseDate: LessThan(deprecationDate),
    });

    console.log(
      `Applying discount to games older than ${discountMonths} months`,
    );
    await discountableGames.map(async (g) => {
      if (g.releaseDate && g.price)
        await this.repository.save({ id: g.id, price: g.price * 0.8 });
    });

    console.log(`Removing games older than ${deleteMonths} months`);
    await deletableGames.map(async (g) => {
      if (g.releaseDate) await this.repository.delete(g.id);
    });
  }
}
