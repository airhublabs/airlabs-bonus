import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { CreateReportDto } from '../modules/reports/dto/create-report.dto';

@Injectable()
export class TestingPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    return value;
  }
}
