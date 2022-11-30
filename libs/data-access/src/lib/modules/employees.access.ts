import { EmployeesApi } from '@airlabs-bonus/types';
import { Request } from '../access';

export class Employees {
  constructor(private request: Request) {}

  async list() {
    const response = await this.request.get<EmployeesApi.ListResponseBody>('/employees');

    return response;
  }

  async retrive(employeeId: number) {
    const response = await this.request.get<EmployeesApi.RetriveResponseBody>(`/employees/${employeeId}`);

    return response;
  }

  async create(data: EmployeesApi.CreateData) {
    const response = await this.request.post<EmployeesApi.CreateResponse>('/employees', data);

    return response;
  }

  async update(employeeId: number, data: EmployeesApi.UpdateResponse) {
    const response = await this.request.patch<EmployeesApi.UpdateResponse>(
      `/employees/${employeeId}`,
      data
    );

    return response;
  }

  async delete(employeeId: number) {
    const response = await this.request.delete<EmployeesApi.DeleteResponse>(`/employees/${employeeId}`);

    return response;
  }
}
