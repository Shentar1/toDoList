/*
  Warnings:

  - Made the column `user_uuid` on table `lists` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "user_uuid" SET NOT NULL;
