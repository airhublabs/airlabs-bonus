import axios from 'axios';
import { ZohoRequest } from './index';

interface PerDiemsCreateData {
  EmpNo: string;
  HumanResourceFullName: string;
}

export class PerDiems {
  constructor(private readonly request: ZohoRequest) {}

  async create(data: PerDiemsCreateData | PerDiemsCreateData[]) {
    // const response = await this.request.post('/report/roster', data);
    const response = await axios.post(
      'https://creator.zoho.com/api/v2/adam_webrevived/airhub/form/roster_report',
      data,
      {
        headers: {
          Authorization: `Bearer 1000.e9aa01b2566b29235a88819bbe20c5b1.ff926b288cd87b50fec62dec65457184`,
        },
      }
    );

    return response;
  }

  async list() {
    // const response = await axios.get(
    //   'https://creator.zoho.com/api/v2/adam_webrevived/airhub/report/roster_report',
    //   {
    //     headers: {
    //       Authorization: `Bearer 1000.e9aa01b2566b29235a88819bbe20c5b1.ff926b288cd87b50fec62dec65457184`,
    //     },
    //   }
    // );


    const response = await this.request.get('/report/roster_report');

    return response;
  }
}
