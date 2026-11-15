-- 1. Crear la extensión para UUIDs (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear los esquemas definidos
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS audit;


-- ==========================================
-- --- SCHEMA: AUTH ---
-- ==========================================

CREATE TABLE auth.role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'active'
);

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dni VARCHAR(9) UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    rol_id UUID NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    pass VARCHAR NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL DEFAULT 'active',
    
    CONSTRAINT fk_users_role FOREIGN KEY (rol_id) REFERENCES auth.role(id)
);


-- ==========================================
-- --- SCHEMA: CORE ---
-- ==========================================

CREATE TABLE core.carrera (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'active'
);

CREATE TABLE core.category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL DEFAULT 'active'
);

CREATE TABLE core.type_procedure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR UNIQUE NOT NULL,
    requirements JSONB NOT NULL,
    category_id UUID NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL DEFAULT 'active',
    
    CONSTRAINT fk_type_procedure_category FOREIGN KEY (category_id) REFERENCES core.category(id)
);

CREATE TABLE core.request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    createByname VARCHAR NOT NULL,
    createByDNI VARCHAR NOT NULL,
    type_id UUID NOT NULL,
    carrera_id UUID NOT NULL,
    observation TEXT DEFAULT 'Sin observaciones',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL DEFAULT 'Enviado',
    revisor_id UUID,
    additionalData JSONB,
    
    CONSTRAINT fk_request_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT fk_request_revisor FOREIGN KEY (revisor_id) REFERENCES auth.users(id),
    CONSTRAINT fk_request_type_procedure FOREIGN KEY (type_id) REFERENCES core.type_procedure(id),
    CONSTRAINT fk_request_carrera FOREIGN KEY (carrera_id) REFERENCES core.carrera(id)
);

CREATE TABLE core.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID,
    name_requeriments VARCHAR NOT NULL,
    name_file VARCHAR NOT NULL,
    router_file VARCHAR NOT NULL,
    size_bytes BIGINT,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR NOT NULL DEFAULT 'active',
    
    CONSTRAINT fk_documents_request FOREIGN KEY (request_id) REFERENCES core.request(id)
);


-- ==========================================
-- --- SCHEMA: AUDIT ---
-- ==========================================

CREATE TABLE audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL,
    action VARCHAR NOT NULL,
    resource_type VARCHAR,
    resource_id UUID,
    description TEXT NOT NULL,
    
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);