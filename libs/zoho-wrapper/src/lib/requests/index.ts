import axios, { AxiosError, AxiosResponse } from 'axios';
import { OAuth } from '../auth/zoho-oauth.api';
import { PerDiems } from './per-diems.api';
import { RequestParams } from '../../zoho';

export const filterEmptyKeys = (object: { [key: string]: any }) => {
  return Object.entries(object).reduce((acc: any, [key, value]) => {
    if (value !== null || value !== undefined) acc[key] = value;
    return acc;
  }, {});
};

const DEFAULT_ACCOUNT_HOST = 'https://accounts.zoho.com';
const DEFAULT_API_HOST = 'https://creator.zoho.com';
const DEFAULT_VERSION: RequestParams['version'] = 'v2';

type RequestType = 'get' | 'post' | 'patch' | 'put' | 'delete';

interface RequestOptions {
  credentials: boolean;
}

interface RequestData {
  params?: object;
  body?: object;
}

/*
Zoho Request Wrapper

Scopes:
- ZohoCreator.report.READ,ZohoCreator.report.create,ZohoCreator.report.UPDATE,ZohoCreator.form.ALL,ZohoCreator.form.CREATE,ZohoCreator.form.READ
*/
export class ZohoRequest {
  private DEFAULT_REQUEST_OPTIONS: RequestOptions = {
    credentials: true,
  };
  public params: RequestParams;
  public BASE_URL!: string;
  public OAuth: OAuth;

  constructor(params: RequestParams) {
    this.params = {
      accountsHost: DEFAULT_ACCOUNT_HOST,
      apiHost: DEFAULT_API_HOST,
      version: DEFAULT_VERSION,
      ...params,
    };

    this.BASE_URL = `${this.params.apiHost}/api/${this.params.version}/${this.params.accountOwnerName}/${this.params.appLinkName}`;
    this.OAuth = new OAuth(this);
  }

  async request<T>(
    type: RequestType,
    path: string,
    data: RequestData,
    options?: Partial<RequestOptions>
  ) {
    options = { ...this.DEFAULT_REQUEST_OPTIONS, ...options };
    const URL = `${this.BASE_URL}/${path}`;
    const accessToken = await this.OAuth.getAccessToken();

    try {
      const response = await axios.request<T>({
        url: URL,
        method: type,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFTOKEN',
        data: data.body,
        params: data.params,
      });

      return response;

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.code === 1030) {
          console.log('Auth error', error.response.data);
        }
      }
    }

    return undefined;
  }

  /**
   * Get request
   * @param path URL path denoting the resoruce to request EX. /users
   */
  async get<T, Q extends object = any>(
    path: string,
    queryParams?: Q,
    requestOptions?: Partial<RequestOptions>
  ) {
    /* TODO: FIlter empty keys */
    if (queryParams) queryParams = filterEmptyKeys(queryParams) as Q;

    return this.request<T>('get', path, { params: queryParams }, requestOptions);
  }

  async post<T>(path: string, body: object, params?: object) {
    return this.request<T>('post', path, { params, body });
  }

  async patch<T>(path: string, body: object, params?: object) {
    return this.request<T>('patch', path, { params, body });
  }

  async put<T>(path: string, body: object, params?: object) {
    return this.request<T>('put', path, { params, body });
  }

  async delete<T>(path: string, params?: object) {
    return this.request<T>('delete', path, { params });
  }
}
