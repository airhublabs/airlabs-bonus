import { CSVExporter, CSVImporterService, DataTransformer } from '@airlabs-bonus/data-converter';
import { ScanningService } from '@airlabs-bonus/calculator-logic';

export class AutomationService {
  async convertData() {
    const transformer = new DataTransformer({
      exporter: new CSVExporter(),
      importer: new CSVImporterService({ csvFilePath: '' }),
    });

    await transformer.init();
    transformer.transformAndExport();
  }

  async runBonusCalculator() {
    //
  }

  async prepareZohoExport() {
    //
  }

  async uploadToZoho() {
    //
  }
}
