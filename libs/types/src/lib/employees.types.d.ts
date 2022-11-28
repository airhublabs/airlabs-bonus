import { SchemaCreateResponseBody, SchemaRequestBody, SchemaResponseBody } from './utils.types';

/* ------- LIST ------- */
export type ListResponseBody = SchemaResponseBody<'EmployeesController_list'>;

/* ------- GET ------- */
export type RetriveResponseBody = SchemaResponseBody<'EmployeesController_retrive'>;

/* ------- CREATE ------- */
export type CreateResponse = SchemaCreateResponseBody<'EmployeesController_create'>;
export type CreateData = SchemaRequestBody<'EmployeesController_create'>;

/* ------- UPDATE ------- */
export type UpdateData = SchemaRequestBody<'EmployeesController_update'>;
export type UpdateResponse = SchemaResponseBody<'EmployeesController_update'>;

/* ------- DELETE ------- */
export type DeleteResponse = SchemaResponseBody<'EmployeesController_remove'>;
