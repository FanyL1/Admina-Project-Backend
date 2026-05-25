/*
  Warnings:

  - You are about to alter the column `dni` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(9)`.
  - A unique constraint covering the columns `[name]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dni]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `carrera` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `type_procedure` will be added. If there are existing duplicate values, this will fail.
  - Made the column `date` on table `logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `action` on table `logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `request_id` on table `logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dni` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rol_id` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pass` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `carrera` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `carrera` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `request_id` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name_requeriments` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name_file` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `router_file` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category_id` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type_id` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carrera_id` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `type_procedure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requirements` on table `type_procedure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `type_procedure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `type_procedure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `type_procedure` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "audit"."logs" DROP CONSTRAINT "logs_request_id_fkey";

-- DropForeignKey
ALTER TABLE "audit"."logs" DROP CONSTRAINT "logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth"."users" DROP CONSTRAINT "users_rol_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."documents" DROP CONSTRAINT "documents_request_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."request" DROP CONSTRAINT "request_carrera_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."request" DROP CONSTRAINT "request_category_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."request" DROP CONSTRAINT "request_type_id_fkey";

-- DropForeignKey
ALTER TABLE "core"."request" DROP CONSTRAINT "request_user_id_fkey";

-- AlterTable
ALTER TABLE "audit"."logs" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "action" SET NOT NULL,
ALTER COLUMN "request_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "auth"."role" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "auth"."users" ALTER COLUMN "dni" SET NOT NULL,
ALTER COLUMN "dni" SET DATA TYPE VARCHAR(9),
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL,
ALTER COLUMN "rol_id" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "pass" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "core"."carrera" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "core"."category" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "core"."documents" ALTER COLUMN "request_id" SET NOT NULL,
ALTER COLUMN "name_requeriments" SET NOT NULL,
ALTER COLUMN "name_file" SET NOT NULL,
ALTER COLUMN "router_file" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "core"."request" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "category_id" SET NOT NULL,
ALTER COLUMN "type_id" SET NOT NULL,
ALTER COLUMN "carrera_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Enviado';

-- AlterTable
ALTER TABLE "core"."type_procedure" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "requirements" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "auth"."role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "auth"."users"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "carrera_name_key" ON "core"."carrera"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "core"."category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "type_procedure_name_key" ON "core"."type_procedure"("name");

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "auth"."role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "core"."category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "core"."type_procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "core"."carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."documents" ADD CONSTRAINT "documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "core"."request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."logs" ADD CONSTRAINT "logs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "core"."request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
