-- Create profiles table if not exists
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Create trigger to automatically create profile on user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to handle profile updates
create or replace function public.handle_user_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set
    full_name = coalesce(new.raw_user_meta_data->>'full_name', old.raw_user_meta_data->>'full_name'),
    avatar_url = coalesce(new.raw_user_meta_data->>'avatar_url', old.raw_user_meta_data->>'avatar_url'),
    updated_at = timezone('utc'::text, now())
  where id = new.id;
  return new;
end;
$$;

-- Create trigger to automatically update profile when user data changes
create or replace trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_user_update();