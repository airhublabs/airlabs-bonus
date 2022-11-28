import { EmployeesApi } from '@airlabs-bonus/types';
import { Request } from '../access';

export class Employees {
  constructor(private request: Request) {}

  async list() {
    const response = await this.request.get<EmployeesApi.ListResponseBody>('/boards');

    return response;
  }

  async retrive(boardId: number) {
    const response = await this.request.get<EmployeesApi.RetriveResponseBody>(`/boards/${boardId}`);

    return response;
  }

  async create(data: EmployeesApi.CreateData) {
    const response = await this.request.post<EmployeesApi.CreateResponse>('/boards', data);

    return response;
  }

  async update(boardId: number, data: EmployeesApi.UpdateResponse) {
    const response = await this.request.patch<EmployeesApi.UpdateResponse>(
      `/boards/${boardId}`,
      data
    );

    return response;
  }

  async delete(boardId: number) {
    const response = await this.request.delete<EmployeesApi.DeleteResponse>(`/boards/${boardId}`);

    return response;
  }
}
