import { ReportsApi } from '@airlabs-bonus/types';
import { SchemaQuery } from 'libs/types/src/lib/utils.types';
import { Request } from '../access';

interface ListParams {
  employeeId?: number;
  query?: ReportsApi.ListQuery;
}

export class Reports {
  constructor(private request: Request) {}

  async list(params?: ListParams) {
    const URL = params?.employeeId ? `/employees/${params.employeeId}/reports` : '/reports';
    const response = await this.request.get<ReportsApi.ListResponseBody>(URL, params?.query);

    return response;
  }

  async retrive(employeeId: number) {
    const response = await this.request.get<ReportsApi.RetriveResponseBody>(
      `/reports/${employeeId}`
    );

    return response;
  }

  async create(data: ReportsApi.CreateData) {
    const response = await this.request.post<ReportsApi.CreateResponse>('/reports', data);

    return response;
  }

  async update(employeeId: number, data: ReportsApi.UpdateResponse) {
    const response = await this.request.patch<ReportsApi.UpdateResponse>(
      `/reports/${employeeId}`,
      data
    );

    return response;
  }

  async delete(employeeId: number) {
    const response = await this.request.delete<ReportsApi.DeleteResponse>(`/reports/${employeeId}`);

    return response;
  }
}
