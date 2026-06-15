/*
  Warnings:

  - You are about to drop the column `message` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `request_id` on the `logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "audit"."logs" DROP CONSTRAINT "logs_request_id_fkey";

-- AlterTable
ALTER TABLE "audit"."logs" DROP COLUMN "message",
DROP COLUMN "request_id";
