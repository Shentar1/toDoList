/*
  Warnings:

  - You are about to drop the column `user_id` on the `lists` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "user_lists";

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "user_id",
ADD COLUMN     "user_uuid" UUID;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "user_lists" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
