import { ZohoApi } from '@airlabs-bonus/zoho-wrapper';
import { Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';

@Module({
  controllers: [AutomationController],
  providers: [
    AutomationService,
    {
      provide: ZohoApi,
      useValue: new ZohoApi({ accountOwnerName: 'adam_webrevived', appLinkName: 'adwa' }),
    },
  ],
})
export class AutomationModule {}
