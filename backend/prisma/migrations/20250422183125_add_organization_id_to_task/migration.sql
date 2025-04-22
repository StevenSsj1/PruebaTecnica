-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
