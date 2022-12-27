import { ZohoApi } from '@airlabs-bonus/zoho-wrapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AutomationService {
  private logger = new Logger(AutomationService.name);

  constructor(private readonly zoho: ZohoApi) {}

  handleCron() {
    this.logger.debug('Called CRON job');
  }

  async run() {
    const response = await this.zoho.PerDiems.create([
      { EmpNo: '123', HumanResourceFullName: 'adam' },
    ]);
    // const response = await this.zoho.PerDiems.list();

    return response.data;
    // TODO: Make call to Radio
    // Transform data.
    // Run Security bonus calculator
    // Aggregate results into a table
    // Send to Zoho
  }
}
