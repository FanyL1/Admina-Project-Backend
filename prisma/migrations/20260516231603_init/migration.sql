-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "audit";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateTable
CREATE TABLE "auth"."role" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "status" VARCHAR,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL,
    "dni" INTEGER,
    "name" VARCHAR,
    "lastname" VARCHAR,
    "rol_id" UUID,
    "email" VARCHAR,
    "pass" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "status" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."carrera" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "status" VARCHAR,

    CONSTRAINT "carrera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."category" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "status" VARCHAR,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."type_procedure" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "requirements" JSONB,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "status" VARCHAR,

    CONSTRAINT "type_procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."request" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "createByname" VARCHAR NOT NULL,
    "category_id" UUID,
    "type_id" UUID,
    "carrera_id" UUID,
    "observation" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "status" VARCHAR,

    CONSTRAINT "request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."documents" (
    "id" UUID NOT NULL,
    "request_id" UUID,
    "name_requeriments" VARCHAR,
    "name_file" VARCHAR,
    "router_file" VARCHAR,
    "size_bytes" BIGINT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "status" VARCHAR,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."logs" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "action" VARCHAR,
    "request_id" UUID,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "auth"."role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "core"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "core"."type_procedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."request" ADD CONSTRAINT "request_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "core"."carrera"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core"."documents" ADD CONSTRAINT "documents_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "core"."request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."logs" ADD CONSTRAINT "logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit"."logs" ADD CONSTRAINT "logs_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "core"."request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
