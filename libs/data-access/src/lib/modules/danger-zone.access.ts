import { DangerZonesApi } from '@airlabs-bonus/types';
import { SchemaQuery } from 'libs/types/src/lib/utils.types';
import { Request } from '../access';

export class DangerZones {
  constructor(private request: Request) {}

  async list() {
    const response = await this.request.get<DangerZonesApi.ListResponseBody>('/danger-zones');

    return response;
  }

  async retrive(dangerZoneId: number) {
    const response = await this.request.get<DangerZonesApi.RetriveResponseBody>(
      `/danger-zones/${dangerZoneId}`
    );

    return response;
  }

  async create(data: DangerZonesApi.CreateData) {
    const response = await this.request.post<DangerZonesApi.CreateResponse>('/danger-zones', data);

    return response;
  }

  async update(dangerZoneId: number, data: DangerZonesApi.UpdateData) {
    const response = await this.request.patch<DangerZonesApi.UpdateResponse>(
      `/danger-zones/${dangerZoneId}`,
      data
    );

    return response;
  }

  async delete(dangerZoneId: number) {
    const response = await this.request.delete<DangerZonesApi.DeleteResponse>(
      `/danger-zones/${dangerZoneId}`
    );

    return response;
  }
}
