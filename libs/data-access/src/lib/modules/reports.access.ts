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

  async retrive(reportId: number) {
    const response = await this.request.get<ReportsApi.RetriveResponseBody>(
      `/reports/${reportId}`
    );

    return response;
  }

  async create(data: ReportsApi.CreateData) {
    const response = await this.request.post<ReportsApi.CreateResponse>('/reports', data);

    return response;
  }

  async update(reportId: number, data: ReportsApi.UpdateData) {
    const response = await this.request.patch<ReportsApi.UpdateResponse>(
      `/reports/${reportId}`,
      data
    );

    return response;
  }

  async delete(reportId: number) {
    const response = await this.request.delete<ReportsApi.DeleteResponse>(`/reports/${reportId}`);

    return response;
  }
}
