/*
  # Create finance entries table

  1. New Tables
    - `finance_entries`
      - `id` (uuid, primary key)
      - `date` (date, not null)
      - `description` (text, nullable)
      - `amount_received` (decimal, default 0)
      - `doctors_cut` (decimal, default 0)
      - `bioline_cut` (decimal, default 0)
      - `net_revenue` (decimal, calculated automatically)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `finance_entries` table
    - Add policies for authenticated users to manage their data

  3. Features
    - Auto-calculate net revenue using triggers
    - Index for faster date range queries
*/

-- Create finance_entries table
CREATE TABLE IF NOT EXISTS finance_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    description text,
    amount_received decimal(10,2) DEFAULT 0,
    doctors_cut decimal(10,2) DEFAULT 0,
    bioline_cut decimal(10,2) DEFAULT 0,
    net_revenue decimal(10,2) DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE finance_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all finance entries"
  ON finance_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert finance entries"
  ON finance_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update finance entries"
  ON finance_entries
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete finance entries"
  ON finance_entries
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster date range queries
CREATE INDEX IF NOT EXISTS idx_finance_entries_date ON finance_entries(date);

-- Create trigger to automatically update net_revenue
CREATE OR REPLACE FUNCTION calculate_net_revenue()
RETURNS TRIGGER AS $$
BEGIN
    NEW.net_revenue = NEW.amount_received - NEW.doctors_cut - NEW.bioline_cut;
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_net_revenue
    BEFORE INSERT OR UPDATE ON finance_entries
    FOR EACH ROW
    EXECUTE FUNCTION calculate_net_revenue();