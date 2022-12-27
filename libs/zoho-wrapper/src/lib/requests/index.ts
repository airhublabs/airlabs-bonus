import axios from 'axios';
import { OAuth } from '../auth/zoho-oauth.api';
import { PerDiems } from './per-diems.api';

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

interface RequestParams {
  version?: 'v2';
  apiHost?: string;
  accountsHost?: string;
  accountOwnerName: string;
  appLinkName: string;
}

interface RequestData {
  params?: object;
  body?: object;
}

/*
Zoho Request Wrapper

Scopes:
- ZohoCreator.report.ALL / ZohoCreator.report.READ
- ZohoCreator.FORM.ALL
- ZohoCreator.report.UPDATE
- ZohoCreator.report.ALL,ZohoCreator.form.CREATE,ZohoCreator.form.READ,,ZohoCreator.report.CREATE
*/
export class ZohoRequest {
  private DEFAULT_REQUEST_OPTIONS: RequestOptions = {
    credentials: true,
  };
  public params: RequestParams;
  public accessToken!: string;

  constructor(params?: Partial<RequestParams>) {
    // todo: Remove
    this.accessToken = '1000.aa6fab0c1f99352ff121d393b203ee20.180436b029aeab738f40d24b84030c7d';
    this.params = {
      accountsHost: DEFAULT_ACCOUNT_HOST,
      apiHost: DEFAULT_API_HOST,
      version: DEFAULT_VERSION,
      accountOwnerName: 'adam_webrevived',
      appLinkName: 'airhub',
      ...params,
    };
  }

  async request<T>(
    type: RequestType,
    path: string,
    data: RequestData,
    options?: Partial<RequestOptions>
  ) {
    options = { ...this.DEFAULT_REQUEST_OPTIONS, ...options };
    const BASE_URL = `${this.params.apiHost}/${this.params.version}/${this.params.accountOwnerName}/${this.params.appLinkName}${path}`;

    const response = axios.request<T>({
      url: BASE_URL,
      method: type,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      withCredentials: true,
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFTOKEN',
      data: data.body,
      params: data.params,
    });

    return response;
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

export class ZohoApi {
  // public OAuth: OAuth;
  public PerDiems: PerDiems;

  // accountOwnerName, appLinkName
  constructor(private readonly params: RequestParams) {
    const request = new ZohoRequest(params);

    this.PerDiems = new PerDiems(request);
    // this.OAuth = new OAuth(request);
  }
}
