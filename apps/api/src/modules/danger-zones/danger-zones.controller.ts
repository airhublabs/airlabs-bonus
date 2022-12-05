import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DangerZonesService } from './danger-zones.service';
import { CreateDangerZoneDto } from './dto/create-danger-zone.dto';
import { UpdateDangerZoneDto } from './dto/update-danger-zone.dto';
import { DangerZoneEntity } from './entities/danger-zone.entity';

@Controller('danger-zones')
export class DangerZonesController {
  constructor(private readonly dangerZonesService: DangerZonesService) {}

  @ApiCreatedResponse({ type: DangerZoneEntity })
  @Post()
  create(@Body() createDangerZoneDto: CreateDangerZoneDto) {
    return this.dangerZonesService.create(createDangerZoneDto);
  }

  @ApiOkResponse({ type: DangerZoneEntity, isArray: true })
  @Get()
  list() {
    return this.dangerZonesService.list();
  }

  @ApiOkResponse({ type: DangerZoneEntity })
  @Get(':id')
  retrive(@Param('id', ParseIntPipe) id: number) {
    return this.dangerZonesService.retrive(id);
  }
  @ApiOkResponse({ type: DangerZoneEntity })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDangerZoneDto: UpdateDangerZoneDto) {
    return this.dangerZonesService.update(id, updateDangerZoneDto);
  }

  @ApiOkResponse({ type: DangerZoneEntity })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dangerZonesService.remove(id);
  }
}
