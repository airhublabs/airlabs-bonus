import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BatchCreateReportDto } from '@airlabs-bonus/types';
import { BatchCreateEmployeeDto } from './dto/batch-create-employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiCreatedResponse({ type: CreateEmployeeDto })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Post('batch')
  @UseInterceptors(FileInterceptor('employees'))
  async batchUploadReports(
    @UploadedFile(
      new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: 'application/json' })] })
    )
    reports: Express.Multer.File
  ) {
    const employeesJson = JSON.parse(reports.buffer.toString()) as BatchCreateEmployeeDto[];
    const createdCount = await this.employeesService.batchCreate(employeesJson);

    return { count: createdCount };
  }

  @ApiOkResponse({ type: CreateEmployeeDto, isArray: true })
  @Get()
  list() {
    return this.employeesService.list();
  }

  @ApiOkResponse({ type: CreateEmployeeDto })
  @Get(':id')
  retrive(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.retrive(id);
  }

  @ApiOkResponse({ type: CreateEmployeeDto })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @ApiOkResponse({ type: CreateEmployeeDto })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }

}
