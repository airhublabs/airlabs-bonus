import { join } from 'path';
import { CSVExporter } from './lib/services/data-exporter.service';
import { DataTransformer } from './lib/services/data-transformer.service';
import { CSVImporterService } from './lib/services/importer/csv-importer.service';
import { JSONImporterService } from './lib/services/importer/json-importer.service';

const transformer = new DataTransformer({
  exporter: new CSVExporter(),
  // Example with JSON
  importer: new CSVImporterService({
    csvFilePath: join(process.cwd(), './lib/data/cc_roster_csv.csv'),
  }),
  // importer: new JSONImporterService({data: report})
});

/* Currently using class based service architecture, so it required initializing the data before transforming */
const bootstrap = async () => {
  await transformer.init();
  transformer.transformAndExport();
};

// bootstrap();

export { DataTransformer, CSVExporter, CSVImporterService, JSONImporterService };
