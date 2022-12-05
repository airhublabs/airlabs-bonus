import { SchemaCreateResponseBody, SchemaRequestBody, SchemaResponseBody } from './utils.types';

/* ------- LIST ------- */
export type ListResponseBody = SchemaResponseBody<'DangerZonesController_list'>;

/* ------- GET ------- */
export type RetriveResponseBody = SchemaResponseBody<'DangerZonesController_retrive'>;

/* ------- CREATE ------- */
export type CreateResponse = SchemaCreateResponseBody<'DangerZonesController_create'>;
export type CreateData = SchemaRequestBody<'DangerZonesController_create'>;

/* ------- UPDATE ------- */
export type UpdateData = SchemaRequestBody<'DangerZonesController_update'>;
export type UpdateResponse = SchemaResponseBody<'DangerZonesController_update'>;

/* ------- DELETE ------- */
export type DeleteResponse = SchemaResponseBody<'DangerZonesController_remove'>;
