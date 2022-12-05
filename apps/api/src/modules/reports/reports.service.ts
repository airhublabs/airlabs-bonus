import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { ApiError } from '../../common/errors/api.error';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportCreatorService } from './services/report-creator.service';

interface ListParams {
  filter?: Prisma.ReportWhereInput;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    const reportManager = new ReportCreatorService(createReportDto);

    if (!reportManager.isFromDateBeforeToDate())
      throw new ApiError('Report from date must be before the to date.', {
        meta: {
          from_date: createReportDto.from_date,
          to_date: createReportDto.to_date,
        },
      });

    const report = await this.prisma.report.create({
      data: {
        ...createReportDto,
        scheduled_hours_duration: reportManager.getReportDuration(),
      },
    });

    return report;
  }

  async list(params?: ListParams) {
    const reports = await this.prisma.report.findMany({
      where: {
        ...params?.filter,
      },
      orderBy: {start_date: "asc"},
      include: {employee: true}
    });

    return reports;
  }

  async retrieve(reportId: number) {
    const reports = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    return reports;
  }

  async update(reportId: number, updateReportDto: UpdateReportDto) {
    const updatedReport = await this.prisma.report.update({
      where: { id: reportId },
      data: updateReportDto,
    });

    return updatedReport;
  }

  async remove(reportId: number) {
    const deletedReport = await this.prisma.report.delete({
      where: { id: reportId },
    });

    return deletedReport;
  }
}
