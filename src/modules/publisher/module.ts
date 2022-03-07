import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Publisher } from 'typeorm/entities';

// Modules
import { PublisherController } from './controller';
import { PublisherService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher]), Logger],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}
