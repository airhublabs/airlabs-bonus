-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "emp_no" TEXT NOT NULL,
    "homebase" TEXT NOT NULL,
    "human_resource_full_name" TEXT NOT NULL,
    "human_resource_brq" TEXT NOT NULL,
    "human_resource_rank" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL DEFAULT E'N/A',
    "registration" TEXT,
    "vehicle_type" TEXT NOT NULL,
    "dep_string" TEXT NOT NULL,
    "arr_string" TEXT NOT NULL,
    "scheduled_hours_duration" TEXT NOT NULL,
    "roster_designators" TEXT NOT NULL,
    "project_name_text" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
