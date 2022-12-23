import fs from 'fs';
import { parseAsync } from 'json2csv';
import type { Readable, TransformOptions } from 'stream';

interface WriteFileParams {
  file: string;
  fileName: string;
  /**File extension without the leading dot. IE csv, xlsx */
  fileExtension?: string;
}

interface CSVExporterParams<T = any> {
  outputFileLocation: string;
  outputFileName: string;
  data: Readonly<T> | ReadonlyArray<T> | Readable;
  options: json2csv.Options<any>;
  transformOptions?: TransformOptions;
}

export abstract class DataExporter {
  abstract export(params: CSVExporterParams): Promise<string>;
}

export class CSVExporter implements DataExporter {
  async export(params: CSVExporterParams): Promise<string> {
    const csv = await parseAsync(params.data, params.options, params.transformOptions);
    console.log('[INFO] Data successfully transformed into CSV');
    const file = this.writeFile({ file: csv, fileName: params.outputFileName });

    return csv;
  }

  private writeFile(params: WriteFileParams) {
    const fullFileNameAndExt = `${params.fileName}.${params.fileExtension || 'csv'}`;
    try {
      fs.writeFileSync(fullFileNameAndExt, params.file);
      console.log(
        `[INFO] '${fullFileNameAndExt}' has successfully been written to the file system.`
      );
    } catch (error) {
      console.error('Error occurred while writing file', error);
    }
  }
}
