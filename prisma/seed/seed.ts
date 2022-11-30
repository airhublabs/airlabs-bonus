/* Seed the databse with the Data given from Airlabs.  */
import data from '../../apps/api/src/common/helpers/cc_roster.json';
import { Employee, Prisma, PrismaClient } from '@prisma/client';
import { transformRosterDate } from './time-converter';

const prisma = new PrismaClient();

interface CabinCrewData {
  Report: {
    EmpNo: string;
    HumanResourceFullName: string;
    HumanResourceBRQ: string;
    HumanResourceRank: string;
    StartDate: string;
    ValidFromDate: string;
    ValidFromTime: string;
    ValidToDate: string;
    ValidToTime: string;
    Code: string | 'N/A';
    Registration: string;
    VehicleType: string;
    DepString: string;
    ArrString: string;
    ScheduledHoursDuration: string;
    RosterDesignators: string;
    ProjectNameText: string;
  }[];
}

const partialCabinCrewSlice = data.Report as unknown as CabinCrewData['Report'];

const USERS = (
  params: CabinCrewData['Report'][number]
): Record<string, Prisma.EmployeeCreateInput> => ({
  AAR: {
    emp_no: params.EmpNo,
    homebase: 'FCO',
    human_resource_brq: params.HumanResourceBRQ,
    human_resource_full_name: params.HumanResourceFullName,
    human_resource_rank: params.HumanResourceRank,
  },
  ACG: {
    emp_no: params.EmpNo,
    homebase: 'MLA',
    human_resource_brq: params.HumanResourceBRQ,
    human_resource_full_name: params.HumanResourceFullName,
    human_resource_rank: params.HumanResourceRank,
  },
  ADI: {
    emp_no: params.EmpNo,
    homebase: 'BJV',
    human_resource_brq: params.HumanResourceBRQ,
    human_resource_full_name: params.HumanResourceFullName,
    human_resource_rank: params.HumanResourceRank,
  },
  ADJ: {
    emp_no: params.EmpNo,
    homebase: 'AYT',
    human_resource_brq: params.HumanResourceBRQ,
    human_resource_full_name: params.HumanResourceFullName,
    human_resource_rank: params.HumanResourceRank,
  },
});

/**
 * Seed data from JSON file into database
 */
const seedFromData = async () => {
  await prisma.$transaction(
    partialCabinCrewSlice.map((report) => {
      const { fromDate, toDate } = transformRosterDate({ ...report });

      return prisma.report.create({
        data: {
          arr_string: report.ArrString,
          dep_string: report.DepString,
          code: report.Code,
          project_name_text: report.ProjectNameText,
          roster_designators: report.RosterDesignators,
          registration: report.Registration,
          vehicle_type: report.VehicleType,
          start_date: fromDate,
          from_date: fromDate,
          to_date: toDate,
          scheduled_hours_duration: report.ScheduledHoursDuration,
          employee: {
            connectOrCreate: {
              where: { emp_no: report.EmpNo },
              create: USERS(report)[report.EmpNo],
            },
          },
        },
      });
    })
  );
};

const main = async () => {
  try {
    await seedFromData();
  } catch (error) {
    console.log('[TDATA] - Failed to seed transfer data', error);
  }
};

main();
