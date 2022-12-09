/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BonusCalculatorServiceV2 } from '@airlabs-bonus/bonus-calculator';
import { ReportsApi } from '@airlabs-bonus/types';
import { Injectable } from '@nestjs/common';
import { Prisma, Report } from '@prisma/client';
import { DateTime } from 'luxon';
import { ApiError } from '../../common/errors/api.error';
import { currentMonth, endOfMonthDate, startOfMonthDate } from '../../common/helpers/date.utils';
import { PrismaService } from '../../common/services/prisma.service';
import { BatchCreateReportDto } from './dto/batch-create-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportCreatorService } from './services/report-creator.service';
import { ReportUploadService } from './services/report-upload.service';

interface ListParams {
  filter?: Prisma.ReportWhereInput;
}

interface AggergateReportReturn {
  currentMonthReports: ReportsApi.ListResponseBody;
  previousMonthReports: ReportsApi.ListResponseBody;
}

export const aggergateReportMonths = (params: {
  currentMonth: number;
  reports: Report[];
}): AggergateReportReturn => {
  if (!params?.reports) return { currentMonthReports: [], previousMonthReports: [] };

  return params.reports.reduce(
    (acc: AggergateReportReturn, report) => {
      const lStartDate = DateTime.fromISO(report.start_date.toISOString());

      if (lStartDate.month === params.currentMonth) {
        // @ts-ignore
        acc.currentMonthReports.push({
          ...report,
          start_date: report.start_date.toISOString(),
          to_date: report.to_date.toISOString(),
          from_date: report.from_date.toISOString(),
        });
        return acc;
      }

      if (lStartDate.month === params.currentMonth - 1) {
        //@ts-ignore
        acc.previousMonthReports.push({
          ...report,
          start_date: report.start_date.toISOString(),
          to_date: report.to_date.toISOString(),
          from_date: report.from_date.toISOString(),
        });
      }

      return acc;
    },
    { currentMonthReports: [], previousMonthReports: [] }
  );
};

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

  async batchCreate(batchCreateReportDto: BatchCreateReportDto[]) {
    const reportUpload = new ReportUploadService(batchCreateReportDto);
    const convertedReports = reportUpload.convertReportToPrismaSchema();

    const reports = await this.prisma.$transaction(
      convertedReports.map((report) => this.prisma.report.create({ data: report }))
    );

    return reports.length;
  }

  async list(params?: ListParams) {
    const reports = await this.prisma.report.findMany({
      where: {
        ...params?.filter,
      },
      orderBy: { start_date: 'asc' },
      include: { employee: true },
    });

    return reports;
  }

  async runReport(month: number) {
    const employees = await this.prisma.employee.findMany({
      include: {
        Report: {
          where: {
            start_date: {
              gte: startOfMonthDate(month - 1).toISO(),
              lte: endOfMonthDate(month).toISO(),
            },
          },
          orderBy: { start_date: 'asc' },
        },
      },
    });

    return employees.map((employee) => {
      const { currentMonthReports, previousMonthReports } = aggergateReportMonths({
        reports: employee.Report,
        currentMonth: month,
      });

      const bonus = new BonusCalculatorServiceV2({
        dangerZones: ['DSS', 'EBL', 'LOS'],
        employee: employee,
        hazardPayRate: 25.5,
        previousMonthReports: previousMonthReports,
        reports: currentMonthReports,
      });

      const days = bonus.getEligbleBonusHours();

      return { emp_no: employee.emp_no, bonus: Math.ceil(days), id: employee.emp_no  };
    });
    return {};
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
