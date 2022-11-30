export const QUERY_KEY = {
  listEmployees: ['employees'],
  retrieveEmployee: (id: number) => ['employees', id],
  listReports: ['reports'],
  listReportsByEmployee: (employeeId: number) => ['reports', 'employees', employeeId],
} as const;
