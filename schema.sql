-- =========================================================================
-- AutoMarket Database Schema for Supabase
-- =========================================================================

-- 1. Create cars table
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  brand text not null,
  model text not null,
  year int not null,
  price numeric not null,
  mileage int not null,
  transmission text not null, -- 'Автомат', 'Механика', 'Робот', 'Вариатор'
  fuel_type text not null,   -- 'Бензин', 'Дизель', 'Гибрид', 'Электро', 'ГАЗ'
  body_type text,            -- 'Седан', 'Внедорожник', 'Хэтчбек', 'Универсал', 'Купе'
  engine_capacity numeric,   -- 2.0, 1.6 etc.
  engine_power int,          -- 150 (л.с.)
  drive_type text,           -- 'Передний', 'Задний', 'Полный'
  color text,                -- 'Черный', 'Белый', etc.
  city text not null,
  description text,
  phone text not null,
  telegram text,
  whatsapp text,
  images text[] default '{}'::text[],
  status text default 'active' -- 'active', 'sold', 'hidden'
);

-- 2. Create indexes for high-performance filtering and sorting
create index if not exists cars_brand_idx on public.cars (brand);
create index if not exists cars_price_idx on public.cars (price);
create index if not exists cars_year_idx on public.cars (year);
create index if not exists cars_created_at_idx on public.cars (created_at desc);
create index if not exists cars_user_id_idx on public.cars (user_id);

-- 3. Enable Row Level Security (RLS)
alter table public.cars enable row level security;

-- 4. RLS Policies for cars table
-- Anyone can view active cars
create policy "Anyone can view cars"
  on public.cars for select
  using (true);

-- Authenticated users can insert their own cars
create policy "Users can insert their own cars"
  on public.cars for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own cars
create policy "Users can update their own cars"
  on public.cars for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own cars
create policy "Users can delete their own cars"
  on public.cars for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================================================================
-- 5. Supabase Storage Setup for Car Photos
-- =========================================================================

-- Insert bucket for car images (if not exists)
insert into storage.buckets (id, name, public)
values ('car-images', 'car-images', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies
-- Public read access to car images
create policy "Public Access to Car Images"
  on storage.objects for select
  using (bucket_id = 'car-images');

-- Authenticated users can upload car images
create policy "Authenticated Users can upload car images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'car-images');

-- Authenticated users can delete car images
create policy "Authenticated Users can delete car images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'car-images');

-- =========================================================================
-- 6. Demo / Seed Data (Optional - requires a valid user_id from auth.users)
-- =========================================================================
/*
To insert seed data, replace 'YOUR_USER_UUID_HERE' with an actual user id from auth.users:
insert into public.cars (user_id, brand, model, year, price, mileage, transmission, fuel_type, body_type, engine_capacity, engine_power, drive_type, color, city, description, phone, telegram, whatsapp, images)
values 
('YOUR_USER_UUID_HERE', 'Toyota', 'Camry', 2021, 2450000, 45000, 'Автомат', 'Бензин', 'Седан', 2.5, 181, 'Передний', 'Черный', 'Москва', 'Отличное состояние, один владелец, своевременное обслуживание у официального дилера.', '+7 (999) 123-45-67', '@camry_seller', '+79991234567', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80']),
('YOUR_USER_UUID_HERE', 'BMW', 'X5', 2020, 5200000, 68000, 'Автомат', 'Дизель', 'Внедорожник', 3.0, 249, 'Полный', 'Белый', 'Санкт-Петербург', 'Максимальная комплектация M Sport. Панорамная крыша, проекция, кожаный салон.', '+7 (998) 765-43-21', '@bmw_owner', '+79987654321', ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80']);
*/
