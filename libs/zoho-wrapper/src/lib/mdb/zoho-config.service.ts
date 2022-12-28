import { mdb } from './mdb';

interface ZohoConfigKey {
  refresh_token: string;
  access_token: string;
  access_token_expiration: string;
}
class ZohoConfigService {
  async upsert<T extends keyof ZohoConfigKey>(key: T, value: ZohoConfigKey[T]) {
    try {
      const response = await mdb.push(`.zoho.${key}`, value);

      return response;
    } catch (error) {
      return undefined;
    }
  }

  async retrive<T extends keyof ZohoConfigKey>(key: T): Promise<ZohoConfigKey[T] | undefined> {
    try {
      const response = await mdb.getData(`.zoho.${key}`);

      return response;
    } catch (error) {
      return undefined;
    }
  }
}

export const zohoConfig = new ZohoConfigService();
