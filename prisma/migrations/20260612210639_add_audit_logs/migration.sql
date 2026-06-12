/*
  Warnings:

  - You are about to drop the column `category_id` on the `request` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `type_procedure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "audit"."logs" DROP CONSTRAINT "logs_request_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."documents" DROP CONSTRAINT "documents_request_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."request" DROP CONSTRAINT "request_category_id_fkey";

-- AlterTable
ALTER TABLE "audit"."logs" ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "message" DROP DEFAULT;

-- AlterTable
ALTER TABLE "core"."documents" ALTER COLUMN "request_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "core"."request" DROP COLUMN "category_id",
ADD COLUMN     "revisor_id" UUID,
ALTER COLUMN "observation" SET DEFAULT 'Sin observaciones';

-- AlterTable
ALTER TABLE "core"."type_procedure" ADD COLUMN     "category_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "core"."type_procedure" ADD CONSTRAINT "type_procedure_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "core"."category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_revisor_id_fkey" FOREIGN KEY ("revisor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."documents" ADD CONSTRAINT "documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "core"."request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."logs" ADD CONSTRAINT "logs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "core"."request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
