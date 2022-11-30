import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiCreatedResponse({ type: CreateEmployeeDto })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
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
