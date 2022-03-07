import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentData } from './interfaces/environment-data.interface';

@Injectable()
export class EnvironmentService {
  private envs: EnvironmentData;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    let data: Record<string, any> = {};
    try {
      if (environment === 'development') {
        data = dotenv.parse(fs.readFileSync('.env'));
      } else {
        data = {
          ...data,
          ...process.env,
        };
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }

    data.APP_ENV = environment;
    data.APP_DEBUG = data.APP_DEBUG === 'true';
    data.DB_PORT = parseInt(data.DB_PORT, 10);

    this.envs = data as EnvironmentData;
  }

  getEnvs(): EnvironmentData {
    return this.envs;
  }

  getTypeORMEnvs(): TypeOrmModuleOptions {
    return {
      type: this.envs.DB_TYPE,
      host: this.envs.DB_HOSTNAME,
      port: this.envs.DB_PORT,
      username: this.envs.DB_USERNAME,
      password: this.envs.DB_PASSWORD,
      database: this.envs.DB_NAME,
      synchronize: false,
      entities: [`${__dirname}/../../typeorm/entities/*.{js,ts}`],
      options: {
        encrypt: true,
        // Prevent deprecation warning from MSSQL
        enableArithAbort: true,
      },
      logging: this.envs.APP_DEBUG,
    };
  }

  isDevelopment(): boolean {
    return this.envs.APP_ENV === 'development';
  }

  isProduction(): boolean {
    return this.envs.APP_ENV === 'production';
  }
}
