-- AlterTable
ALTER TABLE "jobs" ALTER COLUMN "time_created" DROP DEFAULT,
ALTER COLUMN "time_created" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "time_created" DROP DEFAULT,
ALTER COLUMN "time_created" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "time_created" DROP DEFAULT,
ALTER COLUMN "time_created" SET DATA TYPE TIMESTAMP(6);
