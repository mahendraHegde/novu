declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface ProcessEnv {
    CLICKHOUSE_HOST: string;
    CLICKHOUSE_USER: string;
    NODE_ENV: 'test' | 'production' | 'dev';
    CLICKHOUSE_PASSWORD: string;
    CLICKHOUSE_MAX_POOL_SIZE: number;
  }
}
