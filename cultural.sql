-- ===============================
-- EXTENSÕES
-- ===============================
create extension if not exists "uuid-ossp";

-- ===============================
-- SCHEMA
--create schema if not exists hackton;
-- ===============================


-- ===============================
-- DISCIPLINES
-- ===============================
create table if not exists disciplines (
  id uuid primary key,
  name text not null,
  grade text not null,
  created_at timestamp with time zone not null default now()
);

-- ===============================
-- UNITS
-- ===============================
create table if not exists units (
  id uuid primary key,
  discipline_id uuid not null,
  theme text not null,
  context text not null,
  lesson_plan text not null,
  activity text not null,
  created_at timestamp with time zone not null default now(),

  constraint fk_units_discipline
    foreign key (discipline_id)
    references disciplines (id)
    on delete cascade
);

-- ===============================
-- MATERIALS
-- ===============================
create table if not exists materials (
  id uuid primary key,
  unit_id uuid not null,
  title text not null,
  type text not null,
  content text not null,
  created_at timestamp with time zone not null default now(),

  constraint fk_materials_unit
    foreign key (unit_id)
    references units (id)
    on delete cascade,

  constraint chk_material_type
    check (type in ('SLIDES', 'PDF', 'PROVA', 'ATIVIDADE', 'RESUMO'))
);

-- ===============================
-- SYSTEM LOGS
-- ===============================
create table if not exists system_logs (
  id uuid primary key,
  action text not null,
  description text,
  created_at timestamp with time zone not null default now()
);

-- ===============================
-- INDEXES (PERFORMANCE)
-- ===============================
create index if not exists idx_units_discipline_id
  on units (discipline_id);

create index if not exists idx_materials_unit_id
  on materials (unit_id);

create index if not exists idx_logs_created_at
  on system_logs (created_at desc);

-- ===============================
-- ROW LEVEL SECURITY (RLS)
-- ===============================
alter table disciplines enable row level security;
alter table units enable row level security;
alter table materials enable row level security;
alter table system_logs enable row level security;

-- ===============================
-- POLICIES (DEV / MVP)
-- ===============================
create policy "allow all disciplines"
on disciplines
for all
using (true);

create policy "allow all units"
on units
for all
using (true);

create policy "allow all materials"
on materials
for all
using (true);

create policy "allow all system logs"
on system_logs
for all
using (true);
