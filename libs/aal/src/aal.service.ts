import { createClient, ClickHouseClient } from '@clickhouse/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AALService {
  client: ClickHouseClient;

  constructor() {
    this.client = createClient({
      host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
      username: process.env.CLICKHOUSE_USER ?? 'default',
      password: process.env.CLICKHOUSE_PASSWORD ?? '',
      database: process.env.CLICKHOUSE_DATABASE ?? 'test',
      compression: {
        response: true,
      },
      clickhouse_settings: {
        date_time_input_format: 'best_effort',
        date_time_output_format: 'iso',
        async_insert: process.env.CLICKHOUSE_ASYNC_INSERT ? 1 : 0,
      },
      log: {
        level: 0,
      },
      max_open_connections: process.env.CLICKHOUSE_MAX_POOL_SIZE || 500,
    });
  }

  async isConnected(): Promise<boolean> {
    const res = await this.client.ping();

    return res.success;
  }

  async disconnect() {
    await this.client.close();
  }

  async destroy() {
    if (process.env.NODE_ENV !== 'test') throw new Error('Allowed only in test mode');

    throw new Error('not implemented');
  }
}
