import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { Zoho, ZohoApi } from '@airlabs-bonus/zoho-wrapper';

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
