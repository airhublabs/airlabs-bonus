import { Roster } from '../data-transformer';
import { ReportData } from '../data-transformer.service';

interface JSONImporterServiceParams {
  data: any;
}

export abstract class ImporterService {
  abstract import(): Roster[];
}

export class JSONImporterService extends ImporterService {
  constructor(private readonly params: JSONImporterServiceParams) {
    super();
  }

  /**
   * Verify if the JSON report schema is valid
   */
  private verifyReportStrecture() {
    throw new Error('Unimplemeneted');
  }

  import(): Roster[] {
    return (this.params.data as unknown as ReportData).Report;
  }
}
