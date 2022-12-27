import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { Zoho } from '@airlabs-bonus/zoho-wrapper';

@Module({
  controllers: [AutomationController],
  providers: [
    AutomationService,
    {
      provide: Zoho,
      useValue: new Zoho({ accountOwnerName: 'adam_webrevived', appLinkName: 'adwa' }),
    },
  ],
})
export class AutomationModule {}
