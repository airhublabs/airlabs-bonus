import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReportEntity } from './entities/report.entity';
import { ListReportsDto } from './dto/get-report.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { BatchCreateReportDto } from './dto/batch-create-report.dto';
import { BatchGetReportDto } from './dto/batch-get-report.dto';

@Controller()
@ApiTags('Reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiCreatedResponse({ type: ReportEntity })
  @Post('reports')
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @ApiOkResponse({ type: ReportEntity, isArray: true })
  @Get('reports')
  list() {
    return this.reportsService.list();
  }

  @ApiOkResponse({ type: ReportEntity, isArray: true })
  @Get('employees/:employeeId/reports')
  listByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query() query: ListReportsDto
  ) {
    return this.reportsService.list({
      filter: {
        AND: [
          { employee_id: employeeId },
          { start_date: { gte: query.start_date, lte: query.end_date } },
        ],
      },
    });
  }

  @ApiOkResponse({ type: BatchGetReportDto, isArray: true })
  @Get('/reports/bonus')
  async runBonusReport(@Query('month', ParseIntPipe) month: number) {
    const result = await this.reportsService.runReport(month);

    return result;
  }

  @Post('reports/batch')
  @UseInterceptors(FileInterceptor('reports'))
  async batchUploadReports(
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'application/json' })] })
    )
    reports: Express.Multer.File
  ) {
    const reportsJson = JSON.parse(reports.buffer.toString()) as { Report: BatchCreateReportDto[] };
    const createdCount = await this.reportsService.batchCreate(reportsJson.Report);

    return { count: createdCount };
  }

  @ApiOkResponse({ type: ReportEntity })
  @Get('reports/:id')
  retrive(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.retrieve(id);
  }

  @ApiOkResponse({ type: ReportEntity })
  @Patch('reports/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @ApiOkResponse({ type: ReportEntity })
  @Delete('reports/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.remove(id);
  }
}
