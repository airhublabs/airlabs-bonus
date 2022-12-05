import axios from 'axios';
import { BonusCalculatorServiceV2 } from 'libs/bonus-calculator/src/lib/bonus-calculator.service';
import { DangerZones } from './modules/danger-zone.access';
import { Employees } from './modules/employees.access';
import { Reports } from './modules/reports.access';
import { filterEmptyKeys } from './utils/object.utils';

const DEFAULT_HOST = 'https://localhost:5000';
const DEFAULT_VERSION: RequestParams['version'] = 'v1';

type RequestType = 'get' | 'post' | 'patch' | 'put' | 'delete';

interface RequestOptions {
  credentials: boolean;
}

interface RequestParams {
  version: 'v1';
  host: string;
}

interface RequestData {
  params?: object;
  body?: object;
}

export class Request {
  private DEFAULT_REQUEST_OPTIONS: RequestOptions = {
    credentials: true,
  };
  public params: RequestParams;

  constructor(params?: Partial<RequestParams>) {
    this.params = { host: DEFAULT_HOST, version: DEFAULT_VERSION, ...params };
  }

  async request<T>(
    type: RequestType,
    path: string,
    data: RequestData,
    options?: Partial<RequestOptions>
  ) {
    options = { ...this.DEFAULT_REQUEST_OPTIONS, ...options };

    const response = axios.request<T>({
      url: `${this.params.host}/${this.params.version}${path}`,
      method: type,
      withCredentials: true,
      data: data.body,
      params: data.params,
    });

    return response;
  }

  /**
   * Get request
   * @param path URL path denoting the resoruce to request EX. /users
   */
  async get<T, Q extends object = object>(
    path: string,
    queryParams?: Q,
    requestOptions?: Partial<RequestOptions>
  ) {
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

export class AirlabsApi {
  public employees: Employees;
  public reports: Reports;
  public dangerZones: DangerZones;

  constructor(public params?: Partial<RequestParams>) {
    const request = new Request(params);

    this.employees = new Employees(request);
    this.reports = new Reports(request);
    this.dangerZones = new DangerZones(request);
  }
}
