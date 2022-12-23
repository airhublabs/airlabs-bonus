import { TransformedRoster } from './data-transformer';
import { parse, parseAsync } from 'json2csv';
import fs from 'fs';
import csvToJson from 'csvtojson/v2';
import { ReportData } from './data-transformer.service';

export abstract class CSVImporter {
  abstract import(): TransformedRoster;
}

export abstract class CSVStringImporter {
  abstract importString(csvString: string, callback: (json: any) => void): any;
}

export class CSVImporterService implements CSVStringImporter {
  constructor(private data: any) {}

  async importString(csvString: string, callback: (json: any) => void): Promise<any> {
    const json = csvToJson({ output: 'json' })
      .fromString(csvString)
      .then((json) => callback(json));

    return json;
  }

  async import(csvFIlePath: string, callback: (json: any) => void): Promise<any> {
    csvToJson()
      .fromFile(csvFIlePath)
      .then((json) => callback(json));
  }
}
