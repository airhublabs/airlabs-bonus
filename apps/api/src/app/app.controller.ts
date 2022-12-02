import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

import { AppService } from './app.service';

@Controller({version: [VERSION_NEUTRAL, '1']})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
