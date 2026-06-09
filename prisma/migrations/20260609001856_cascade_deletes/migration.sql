-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "job_list";

-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "user_lists";

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "job_list" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "user_lists" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
