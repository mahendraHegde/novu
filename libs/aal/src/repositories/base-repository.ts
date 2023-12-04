/* eslint-disable @typescript-eslint/no-explicit-any */
import { AALService } from '../aal.service';

export class BaseRepository<T_DBModel, T_MappedEntity, T_Enforcement> {
  constructor(protected table: string, protected service: AALService) {}

  async create(data: Array<T_DBModel & T_Enforcement>): Promise<void> {
    await this.service.client.insert({
      table: this.table,
      values: data,
      format: 'JSON',
    });
  }

  async findOne(filter: Partial<T_DBModel> & T_Enforcement): Promise<T_MappedEntity | null> {
    const where = Object.keys(filter)
      .reduce((res, key) => {
        res.push(`${key}='${filter[key]}'`);

        return res;
      }, [] as string[])
      .join(' AND ');
    const query = `select * from ${this.table} where ${where} limit 1`;
    const data = await this.service.client.query({
      query,
      format: 'JSONEachRow',
    });
    if (!data) return null;

    const res = await data.json<Array<T_MappedEntity>>();
    if (res?.length) {
      return res[0];
    }

    return null;
  }

  async find(
    filter: Partial<T_DBModel> & T_Enforcement,
    project?: Array<keyof T_MappedEntity>
  ): Promise<Array<T_MappedEntity>> {
    const where = Object.keys(filter)
      .reduce((res, key) => {
        res.push(`${key}='${filter[key]}'`);

        return res;
      }, [] as string[])
      .join(' AND ');
    const projection = project?.length ? project.map((col) => col).join(' , ') : '*';
    const query = `select ${projection} from ${this.table} where ${where}`;
    console.log({ query });
    const data = await this.service.client.query({
      query,
      format: 'JSONEachRow',
    });
    if (!data) return [];

    return data.json<Array<T_MappedEntity>>();
  }
}
