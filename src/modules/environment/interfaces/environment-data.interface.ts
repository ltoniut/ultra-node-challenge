export interface EnvironmentData {
  // TypeORM Envs
  DB_TYPE: 'postgres' | 'mysql' | 'mssql';
  DB_HOSTNAME: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;

  // Application Envs
  APP_ENV?: string;
  APP_DEBUG?: boolean;
  GLOBAL_ROUTES_PREFIX: string;

  // Redis Envs
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
}
