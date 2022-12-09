import { SchemaCreateResponseBody, SchemaQuery, SchemaRequestBody, SchemaResponseBody } from './utils.types';

/* ------- LIST ------- */
export type ListResponseBody = SchemaResponseBody<'ReportsController_list'>;
export type ListQuery = SchemaQuery<'ReportsController_listByEmployee'>;
export type RunBonusReportBody = SchemaResponseBody<'ReportsController_runBonusReport'>;

/* ------- GET ------- */
export type RetriveResponseBody = SchemaResponseBody<'ReportsController_retrive'>;

/* ------- CREATE ------- */
export type CreateResponse = SchemaCreateResponseBody<'ReportsController_create'>;
export type CreateData = SchemaRequestBody<'ReportsController_create'>;

/* ------- UPDATE ------- */
export type UpdateData = SchemaRequestBody<'ReportsController_update'>;
export type UpdateResponse = SchemaResponseBody<'ReportsController_update'>;

/* ------- DELETE ------- */
export type DeleteResponse = SchemaResponseBody<'ReportsController_remove'>;
