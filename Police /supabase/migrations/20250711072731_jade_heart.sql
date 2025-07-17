/*
  # Police Dashboard Database Schema

  1. New Tables
    - `officers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `badge_number` (text, unique)
      - `rank` (text)
      - `department` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vehicles`
      - `id` (uuid, primary key)
      - `plate_number` (text, unique)
      - `vin` (text, unique)
      - `make` (text)
      - `model` (text)
      - `year` (integer)
      - `color` (text)
      - `owner_name` (text)
      - `owner_address` (text)
      - `registration_status` (text)
      - `registration_expiry` (date)
      - `insurance_status` (text)
      - `insurance_expiry` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `violations`
      - `id` (uuid, primary key)
      - `plate_number` (text)
      - `vehicle_id` (uuid, foreign key)
      - `officer_id` (uuid, foreign key)
      - `violation_type` (text)
      - `violation_details` (text)
      - `location` (text)
      - `status` (text)
      - `evidence_urls` (text[])
      - `fine_amount` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `scans`
      - `id` (uuid, primary key)
      - `officer_id` (uuid, foreign key)
      - `plate_number` (text)
      - `scan_type` (text)
      - `scan_result` (jsonb)
      - `location` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated officers to access their own data
    - Add policies for officers to read vehicle and violation data
*/

-- Create officers table
CREATE TABLE IF NOT EXISTS officers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  badge_number text UNIQUE NOT NULL,
  rank text DEFAULT 'Officer',
  department text DEFAULT 'Police Department',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text UNIQUE NOT NULL,
  vin text UNIQUE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text DEFAULT 'Unknown',
  owner_name text NOT NULL,
  owner_address text,
  registration_status text DEFAULT 'Active',
  registration_expiry date,
  insurance_status text DEFAULT 'Valid',
  insurance_expiry date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create violations table
CREATE TABLE IF NOT EXISTS violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  officer_id uuid REFERENCES officers(id),
  violation_type text NOT NULL,
  violation_details text,
  location text,
  status text DEFAULT 'Pending',
  evidence_urls text[] DEFAULT '{}',
  fine_amount decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id uuid REFERENCES officers(id),
  plate_number text NOT NULL,
  scan_type text DEFAULT 'Manual',
  scan_result jsonb DEFAULT '{}',
  location text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Create policies for officers table
CREATE POLICY "Officers can read own data"
  ON officers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Officers can update own data"
  ON officers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for vehicles table
CREATE POLICY "Officers can read all vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers can insert vehicles"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Officers can update vehicles"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for violations table
CREATE POLICY "Officers can read all violations"
  ON violations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Officers can insert violations"
  ON violations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Officers can update violations"
  ON violations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for scans table
CREATE POLICY "Officers can read own scans"
  ON scans
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = officer_id::text);

CREATE POLICY "Officers can insert own scans"
  ON scans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = officer_id::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_plate_number ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_violations_plate_number ON violations(plate_number);
CREATE INDEX IF NOT EXISTS idx_violations_officer_id ON violations(officer_id);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations(status);
CREATE INDEX IF NOT EXISTS idx_scans_officer_id ON scans(officer_id);
CREATE INDEX IF NOT EXISTS idx_scans_plate_number ON scans(plate_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_violations_updated_at BEFORE UPDATE ON violations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();