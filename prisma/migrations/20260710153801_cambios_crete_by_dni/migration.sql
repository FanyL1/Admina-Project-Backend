/*
  Warnings:

  - Added the required column `createByDNI` to the `request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "core"."documents" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "core"."request" ADD COLUMN     "additionalData" JSONB,
ADD COLUMN     "createByDNI" VARCHAR NOT NULL;
