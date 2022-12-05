import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DatabaseError } from '../../common/errors/databse.error';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateDangerZoneDto } from './dto/create-danger-zone.dto';
import { UpdateDangerZoneDto } from './dto/update-danger-zone.dto';

@Injectable()
export class DangerZonesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDangerZoneDto: CreateDangerZoneDto) {
    const zone = await this.prisma.dangerZone.create({ data: createDangerZoneDto });

    return zone;
  }

  async list() {
    const zones = await this.prisma.dangerZone.findMany({});

    return zones;
  }

  async retrive(id: number) {
    const zone = await this.prisma.dangerZone.findUnique({ where: { id } });

    return zone;
  }

  async update(id: number, updateDangerZoneDto: UpdateDangerZoneDto) {
    const zone = await this.prisma.dangerZone.update({ where: { id }, data: updateDangerZoneDto });

    return zone;
  }

  async remove(id: number) {
    const zone = await this.prisma.dangerZone.delete({ where: { id } });

    return zone;
  }
}
