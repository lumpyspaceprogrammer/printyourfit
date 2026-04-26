-- Run this in your Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query → paste this → Run

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  clothing_type text,
  status text default 'uploaded',
  original_image_url text,
  refined_image_url text,
  measurements jsonb,
  pattern_data jsonb,
  is_public boolean default false,
  title text,
  description text,
  likes integer default 0
);

-- User subscriptions table
create table if not exists user_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  created_by text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  tier text default 'free',
  patterns_used_today integer default 0,
  total_patterns_created integer default 0,
  last_pattern_date text,
  has_used_free_pattern boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text
);

-- Community table
create table if not exists community (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  project_id uuid references projects(id),
  title text,
  description text,
  image_url text,
  likes integer default 0,
  clothing_type text
);

-- Pattern versions table
create table if not exists pattern_versions (
  id uuid default uuid_generate_v4() primary key,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  project_id uuid references projects(id),
  version_number integer,
  pattern_data jsonb,
  customization_options jsonb,
  label text
);

-- Storage bucket for uploads
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict do nothing;

-- Allow public uploads
create policy if not exists "Allow public uploads"
on storage.objects for insert
with check (bucket_id = 'uploads');

create policy if not exists "Allow public reads"
on storage.objects for select
using (bucket_id = 'uploads');

-- Row level security (optional but recommended)
alter table projects enable row level security;
alter table user_subscriptions enable row level security;

create policy if not exists "Users can manage their own projects"
on projects for all
using (true);

create policy if not exists "Users can manage their own subscriptions"
on user_subscriptions for all
using (true);
