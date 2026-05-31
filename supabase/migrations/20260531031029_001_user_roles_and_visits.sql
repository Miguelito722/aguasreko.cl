/*
  # User Roles and Visits System

  1. Purpose
    - Create a role-based access control system
    - Allow 3 specific users to access the visits (visitas) section
    - Track user visits and access logs

  2. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `region` (text)
      - `role` (text, default 'user')
      - `is_verified` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `visits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `visit_date` (date)
      - `visit_time` (time)
      - `status` (text, default 'scheduled')
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `access_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `action` (text)
      - `resource` (text)
      - `ip_address` (text)
      - `created_at` (timestamptz)

  3. Security (RLS)
    - Enable RLS on all tables
    - user_profiles: users can read/update own profile, admins can read all
    - visits: only admin/manager roles can access
    - access_logs: only admins can access

  4. Important Notes
    - Three specific users will have role 'admin' or 'manager' to access visits
    - Regular users have role 'user'
    - Email verification will be handled through is_verified field
    - Role hierarchy: admin > manager > user
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  address text,
  city text,
  region text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  visit_time time NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  resource text NOT NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can insert own profile on signup"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for visits (only admin/manager can access)
CREATE POLICY "Admins and managers can manage visits"
  ON visits FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'manager')
    )
  );

-- Create policies for access_logs (only admins can access)
CREATE POLICY "Only admins can access logs"
  ON access_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, phone, address, city, region, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'region', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_visits_updated_at ON visits;
CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);