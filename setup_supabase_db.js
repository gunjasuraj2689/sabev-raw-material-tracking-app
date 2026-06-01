const { Client } = require('pg');

const client = new Client({
  user: 'postgres.hrusbblafrwwuunakgmr',
  password: 'Sabevrawmaterial@2026',
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = `
-- 1. FACTORIES (TENANTS) TABLE
CREATE TABLE IF NOT EXISTS public.factories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USERS (WORKFORCE PROFILE) TABLE
CREATE TABLE IF NOT EXISTS public.users (
    email TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role TEXT NOT NULL CHECK (role IN ('Boss', 'Operator', 'Guest')),
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PERMISSIONS MATRIX TABLE
CREATE TABLE IF NOT EXISTS public.permissions_matrix (
    role TEXT PRIMARY KEY CHECK (role IN ('Boss', 'Operator', 'Guest')),
    permissions JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default permissions if they don't exist
INSERT INTO public.permissions_matrix (role, permissions) VALUES
('Boss', '{"dashboard":true,"approvals":true,"items":true,"editItems":true,"warehouses":true,"rbac":true,"users":true,"audit":true,"movements":true,"verification":true,"adjustStock":true,"reports":true}'),
('Operator', '{"dashboard":true,"approvals":false,"items":true,"editItems":false,"warehouses":true,"rbac":false,"users":false,"audit":false,"movements":true,"verification":true,"adjustStock":false,"reports":true}'),
('Guest', '{"dashboard":true,"approvals":false,"items":true,"editItems":false,"warehouses":true,"rbac":false,"users":false,"audit":false,"movements":false,"verification":true,"adjustStock":false,"reports":false}')
ON CONFLICT (role) DO UPDATE SET permissions = EXCLUDED.permissions;

-- 4. MASTER RAW MATERIAL ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    container_unit TEXT NOT NULL,
    unit_conversion NUMERIC NOT NULL,
    cost_per_container NUMERIC NOT NULL,
    min_stock NUMERIC NOT NULL DEFAULT 0,
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WAREHOUSES TABLE
CREATE TABLE IF NOT EXISTS public.warehouses (
    name TEXT NOT NULL,
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE,
    stock JSONB NOT NULL DEFAULT '{}'::jsonb,
    PRIMARY KEY (name, tenant)
);

-- 6. INVENTORY MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.movements (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
    item_id TEXT REFERENCES public.items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    warehouse TEXT NOT NULL,
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE,
    supplier_name TEXT,
    container_number TEXT,
    mover_name TEXT,
    vehicle_number TEXT,
    approved_by TEXT NOT NULL
);

-- 7. PHYSICAL VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.verifications (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    warehouse TEXT NOT NULL,
    item_id TEXT REFERENCES public.items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    system_qty NUMERIC NOT NULL,
    physical_qty NUMERIC NOT NULL,
    variance NUMERIC NOT NULL,
    auditor TEXT NOT NULL,
    supervisor TEXT NOT NULL,
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE
);

-- 8. PENDING LOGIN APPROVALS (OTP QUEUE) TABLE
CREATE TABLE IF NOT EXISTS public.login_approvals (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL,
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE,
    otp TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Awaiting OTP',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    "user" TEXT NOT NULL,
    ip TEXT NOT NULL,
    level TEXT NOT NULL,
    signature TEXT NOT NULL,
    tenant TEXT REFERENCES public.factories(id) ON DELETE CASCADE
);
`;

async function main() {
  try {
    console.log("Connecting to Supabase PostgreSQL Database (via Pooler)...");
    await client.connect();
    console.log("Connected successfully!");

    console.log("Executing SQL schema to create tables...");
    await client.query(sql);
    console.log("SQL schema executed successfully! All tables created.");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

main();
