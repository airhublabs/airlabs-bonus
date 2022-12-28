import * as csvToJson from 'csvtojson/v2';

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
    /* TODO: Fix CSV Importer */
    // const json = await csvToJson.fromFile(this.params.csvFilePath);
    return {};
  }
}
