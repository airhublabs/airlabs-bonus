import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

interface ListParams {
  filters?: Prisma.EmployeeWhereInput;
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.prisma.employee.create({
      data: createEmployeeDto,
    });

    return employee;
  }

  async list(params?: ListParams) {
    const employee = await this.prisma.employee.findMany({
      where: params?.filters,
    });

    return employee;
  }

  async retrive(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    return employee;
  }

  async update(employeeId: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.update({
      where: { id: employeeId },
      data: updateEmployeeDto,
    });
  }

  async remove(employeeId: number) {
    const deletedEmployee = await this.prisma.employee.delete({
      where: { id: employeeId },
    });

    return deletedEmployee;
  }
}
