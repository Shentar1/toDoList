/*
  Warnings:

  - Made the column `time_created` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time_created` on table `lists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time_created` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
UPDATE "jobs" SET "time_created" = now();
update "lists" set "time_created" = now();
update "users" set "time_created" = now();

-- AlterTable
ALTER TABLE "jobs" ALTER COLUMN "time_created" SET NOT NULL;

-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "time_created" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "time_created" SET NOT NULL;
