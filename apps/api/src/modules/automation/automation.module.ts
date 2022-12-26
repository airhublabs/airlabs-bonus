import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { ZohoApi } from '@airlabs-bonus/zoho-wrapper';
import { APP_PIPE } from '@nestjs/core';
const l = new ZohoApi({
  accountOwnerName: 'adam_webrevived',
  appLinkName: '',
});

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
