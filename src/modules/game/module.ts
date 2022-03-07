import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Game, Publisher } from 'typeorm/entities';

// Modules
import { GameController } from './controller';
import { GameService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Publisher]), Logger],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
