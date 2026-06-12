/*
  Warnings:

  - You are about to drop the column `user_uuid` on the `lists` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "user_lists";

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "user_uuid",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "user_lists" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
