/* Seed the databse with the Data given from Airlabs.  */
import data from '../../apps/api/src/common/helpers/cc_nov-jan.json';
import sepData from '../../apps/api/src/common/helpers/cc_full.json'
import { Employee, EmployeeType, Prisma, PrismaClient } from '@prisma/client';
import { transformRosterDate } from './time-converter';
import { EMP_DATA, RawEmployee } from '../../apps/api/src/common/helpers/cc_emp';
import { DateTime } from 'luxon';

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

let partialCabinCrewSlice = [...data['Report'], ...sepData['Report']] as unknown as CabinCrewData['Report'];

const createEmployees = async () => {
  const getEmpType = (type: RawEmployee['Rank']): EmployeeType => {
    if (type === 'Senior Cabin Crew' || type === 'Cabin Crew') return 'CABIN';

    return 'FLIGHT';
  };

  await prisma.employee.createMany({
    data: EMP_DATA.map((emp) => ({
      emp_no: emp.EmpNo,
      agency: emp.Agency,
      contract_type: emp['Contract Type'],
      employment_type: emp['Employment Type'],
      type: getEmpType(emp.Rank),
      homebase: emp['Home Base'],
      human_resource_brq: 'Adam',
      human_resource_full_name: `${emp['Name']} ${emp['Surname']}`,
      human_resource_rank: emp['Rank'],
    })),
  });
};

const sortRawReports = (data: CabinCrewData['Report']) => {
  return data.sort((a, z) => {
    const aDate = DateTime.fromFormat(
      `${a.ValidFromDate} ${a.ValidFromTime}`,
      'dd-MMM-yyyy hh:mm:ss'
    );
    const zDate = DateTime.fromFormat(`${z.StartDate} ${z.ValidFromTime}`, 'dd-MMM-yyyy hh:mm:ss');

    if (a.EmpNo < z.EmpNo) return -1;
    if (a.EmpNo > z.EmpNo) return 1;

    if (aDate.toJSDate() < zDate.toJSDate()) return -1;
    if (aDate.toJSDate() > zDate.toJSDate()) return 1;

    return 0;
  });
};

/**
 * Seed data from JSON file into database
 */
const createReports = async () => {
  const sortedReports = sortRawReports(partialCabinCrewSlice);

  await prisma.$transaction(
    sortedReports.reduce((acc, report, i, reports) => {
      const { fromDate, toDate } = transformRosterDate({ ...report });
      let lFromDate = DateTime.fromISO(fromDate);

      console.log('Seeding report count: ', i);

      acc.push(
        prisma.report.create({
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
                  agency: 'DEFAULT',
                  contract_type: 'DEFAULT',
                  employment_type: 'DEFAULT',
                  human_resource_brq: report.HumanResourceBRQ,
                  human_resource_full_name: report.HumanResourceFullName,
                  human_resource_rank: report.HumanResourceRank,
                },
              },
            },
          },
        })
      );

      const nextReport = reports?.[i + 1];

      if (nextReport) {
        const { fromDate: nextFromDate } = transformRosterDate({ ...nextReport });
        const lNextFromDate = DateTime.fromISO(nextFromDate);

        const differenceInDays =
          lNextFromDate.startOf('day').diff(lFromDate.startOf('day'), ['day']).days - 1;

        if (differenceInDays >= 1 && differenceInDays < 30) {
          Array.from({ length: differenceInDays }).forEach((_, i) => {
            acc.push(
              prisma.report.create({
                data: {
                  arr_string: nextReport.DepString,
                  dep_string: report.ArrString,
                  code: 'MISSING FILL',
                  project_name_text: report.ProjectNameText,
                  roster_designators: report.RosterDesignators,
                  registration: report.Registration,
                  vehicle_type: report.VehicleType,
                  start_date: DateTime.fromISO(fromDate)
                    .plus({ day: i + 1, minute: 1 })
                    .toISO(),
                  from_date: DateTime.fromISO(fromDate)
                    .plus({ day: i + 1, minute: 1 })
                    .toISO(),
                  to_date: DateTime.fromISO(fromDate)
                    .plus({ day: i + 1, minute: 1 })
                    .toISO(),
                  scheduled_hours_duration: report.ScheduledHoursDuration,
                  employee: {
                    // connect: {emp_no: report.EmpNo}
                    connectOrCreate: {
                      where: { emp_no: report.EmpNo },
                      create: {
                        homebase: 'DEFAULT',
                        emp_no: report.EmpNo,
                        agency: 'DEFAULT',
                        contract_type: 'DEFAULT',
                        employment_type: 'DEFAULT',
                        human_resource_brq: report.HumanResourceBRQ,
                        human_resource_full_name: report.HumanResourceFullName,
                        human_resource_rank: report.HumanResourceRank,
                      },
                    },
                  },
                },
              })
            );
          });
        }
      }

      return acc;
    }, [] as any[])
  );
};

const createSecurityBonus = async () => {
  const DANGER_ZONES = ['DSS', 'EBL', 'LOS'];

  await prisma.dangerZone.createMany({ data: DANGER_ZONES.map((zone) => ({ zone })) });
};

const main = async () => {
  try {
    await createEmployees();
    await createReports();
    await createSecurityBonus();
  } catch (error) {
    console.log('[TDATA] - Failed to seed transfer data', error);
  }
};

main();
