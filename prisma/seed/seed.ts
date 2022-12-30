/* Seed the databse with the Data given from Airlabs.  */
import data from '../../apps/api/src/common/helpers/cc_full.json';
import { Employee, Prisma, PrismaClient } from '@prisma/client';
import { transformRosterDate } from './time-converter';
import { EMP_DATA } from '../../apps/api/src/common/helpers/cc_emp';
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

let partialCabinCrewSlice = data['Report'] as unknown as CabinCrewData['Report'];
// partialCabinCrewSlice = partialCabinCrewSlice.slice(0, 25000);

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
      const lastReport = reports?.[i - 1];

      /* todo: Adding wrong days */
      if (lastReport) {
        const { fromDate: lastFromDate } = transformRosterDate({ ...lastReport });

        /* Is missing first day */
        if (DateTime.fromISO(fromDate).day === 2 && DateTime.fromISO(lastFromDate).day !== 1) {
          acc.push(
            prisma.report.create({
              data: {
                arr_string: lastReport.ArrString,
                dep_string: report.DepString,
                code: 'MISSING FIRST ',
                project_name_text: report.ProjectNameText,
                roster_designators: report.RosterDesignators,
                registration: report.Registration,
                vehicle_type: report.VehicleType,
                start_date: DateTime.fromISO(fromDate).startOf('month').toISO(),
                from_date: DateTime.fromISO(fromDate).startOf('month').toISO(),
                to_date: DateTime.fromISO(toDate).startOf('month').toISO(),
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
            })
          );
        }
      }

      if (nextReport) {
        const { fromDate: nextFromDate } = transformRosterDate(nextReport);

        if (DateTime.fromISO(nextFromDate).day > DateTime.fromISO(fromDate).day + 1) {
          const lNextFromDate = DateTime.fromISO(nextFromDate);
          const lFromDate = DateTime.fromISO(fromDate);

          const differenceInDays = lNextFromDate.day - lFromDate.day - 1;

          Array.from({ length: differenceInDays }).map((_, i) => {
            acc.push(
              prisma.report.create({
                data: {
                  arr_string: nextReport.DepString,
                  dep_string: report.ArrString,
                  code: 'MISSING FILL ',
                  project_name_text: report.ProjectNameText,
                  roster_designators: report.RosterDesignators,
                  registration: report.Registration,
                  vehicle_type: report.VehicleType,
                  start_date: DateTime.fromISO(fromDate)
                    .startOf('day')
                    .plus({ day: i + 1 })
                    .toISO(),
                  from_date: DateTime.fromISO(fromDate)
                    .startOf('day')
                    .plus({ day: i + 1 })
                    .toISO(),
                  to_date: DateTime.fromISO(fromDate)
                    .startOf('day')
                    .plus({ day: i + 1 })
                    .toISO(),
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
              })
            );
          });

          console.log('Detected missing date, filling date');
        }
      }

      return acc;
    }, [] as any[])
  );
};

const seedFromDataNT = async () => {
  const sortedReports = sortRawReports(partialCabinCrewSlice);

  sortedReports.map(async (report, i, reports) => {
    const { fromDate, toDate } = transformRosterDate({ ...report });

    const nextReport = reports?.[i + 1];
    if (nextReport) {
      const { fromDate: nextFromDate, toDate: nextToDate } = transformRosterDate(nextReport);

      if (DateTime.fromISO(nextFromDate).day > DateTime.fromISO(fromDate).day + 1) {
        console.log('Deteced missing date, filling');
        await prisma.report.create({
          data: {
            arr_string: report.ArrString,
            dep_string: report.DepString,
            code: 'MISSING FILL',
            project_name_text: report.ProjectNameText,
            roster_designators: report.RosterDesignators,
            registration: report.Registration,
            vehicle_type: report.VehicleType,
            start_date: DateTime.fromISO(fromDate).plus({ day: 1 }).toISO(),
            from_date: DateTime.fromISO(fromDate).plus({ day: 1 }).toISO(),
            to_date: DateTime.fromISO(fromDate).plus({ day: 1 }).toISO(),
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
        return;
      }
    }

    console.log('Seeding report number', i);
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
          connect: { emp_no: report.EmpNo },
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
    await createReports();
  } catch (error) {
    console.log('[TDATA] - Failed to seed transfer data', error);
  }
};

main();
