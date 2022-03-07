import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { GameModule } from 'modules/game/module';
import { PublisherModule } from 'modules/publisher/module';

// Services
import { EnvironmentService } from 'modules/environment/environment.service';
import { EnvironmentModule } from 'modules/environment/environment.module';
import { ScheduleModule } from '@nestjs/schedule';

const cacheImports: DynamicModule[] = [];

@Module({
  imports: [
    ...cacheImports,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: async (environmentService: EnvironmentService) =>
        environmentService.getTypeORMEnvs(),
      inject: [EnvironmentService],
    }),
    PublisherModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
