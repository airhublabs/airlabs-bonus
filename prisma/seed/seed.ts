/* Seed the databse with the Data given from Airlabs.  */
import data from '../../apps/api/src/common/helpers/cc_full.json';
import { Employee, Prisma, PrismaClient } from '@prisma/client';
import { transformRosterDate } from './time-converter';
import { EMP_DATA } from '../../apps/api/src/common/helpers/cc_emp';

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

const USERS = (params: CabinCrewData['Report'][number]) => {
  const HOMEBASES = {
    RIC: 'LIS',
    TTS: 'ATH',
    SAT: 'KTW',
    PKM: 'WAW',
    PAP: 'ATH',
    DIC: 'OLD',
    DRS: 'BUD',
  };

  return HOMEBASES[params.EmpNo];
};

const createEmployees = async () => {
  await prisma.employee.createMany({
    data: EMP_DATA.map((emp) => ({
      emp_no: emp.EmpNo,
      homebase: emp.HomeBases,
      human_resource_brq: 'Adam',
      human_resource_full_name: 'Adam Ghowiba',
      human_resource_rank: '123',
    })),
  });
};

/**
 * Seed data from JSON file into database
 */
const seedFromData = async () => {
  await prisma.$transaction(
    partialCabinCrewSlice.map((report, i) => {
      const { fromDate, toDate } = transformRosterDate({ ...report });

      console.log('Seeding report number', i);
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
            // connect: {emp_no: report.EmpNo}
            connectOrCreate: {
              where: { emp_no: report.EmpNo },
              create: {
                homebase: 'DEFAULT',
                emp_no: report.EmpNo,
                human_resource_brq: report.HumanResourceBRQ,
                human_resource_full_name: report.HumanResourceFullName,
                human_resource_rank: report.HumanResourceRank,
              },
            },
          },
        },
      });
    })
  );
};

const seedFromDataNT = async () => {
  partialCabinCrewSlice.forEach(async (report, i) => {
    const { fromDate, toDate } = transformRosterDate({ ...report });

    console.log('Seeding report', i);
    await prisma.report.create({
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
          // connect: {emp_no: report.EmpNo}
          connectOrCreate: {
            where: { emp_no: report.EmpNo },
            create: {
              homebase: 'DEFAULT',
              emp_no: report.EmpNo,
              human_resource_brq: report.HumanResourceBRQ,
              human_resource_full_name: report.HumanResourceFullName,
              human_resource_rank: report.HumanResourceRank,
            },
          },
        },
      },
    });
  });
};

const main = async () => {
  try {
    await createEmployees();
    await seedFromData();
  } catch (error) {
    console.log('[TDATA] - Failed to seed transfer data', error);
  }
};

main();
