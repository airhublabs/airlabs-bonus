import csvToJson from 'csvtojson/v2';

export abstract class FileImporterService {
  abstract importFile(): any;
}

export interface CSVImporterServiceParams {
  csvFilePath: string;
}

export class CSVImporterService extends FileImporterService {
  constructor(private params: CSVImporterServiceParams) {
    super();
  }

  async importFile(): Promise<any> {
    const json = await csvToJson().fromFile(this.params.csvFilePath);
    return json;
  }
}
