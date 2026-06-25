/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin', 'Owner');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

ALTER TABLE "users" ADD CONSTRAINT "role_check" CHECK ("role" IN ('User', 'Admin', 'Owner'))