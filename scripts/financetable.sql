-- Create finance_entries table
CREATE TABLE IF NOT EXISTS finance_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT,
    amount_received DECIMAL(10,2) DEFAULT 0,
    doctors_cut DECIMAL(10,2) DEFAULT 0,
    bioline_cut DECIMAL(10,2) DEFAULT 0,
    net_revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster date range queries
CREATE INDEX IF NOT EXISTS idx_finance_entries_date ON finance_entries(date);

-- Create trigger to automatically update net_revenue
CREATE OR REPLACE FUNCTION calculate_net_revenue()
RETURNS TRIGGER AS $$
BEGIN
    NEW.net_revenue = NEW.amount_received - NEW.doctors_cut - NEW.bioline_cut;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_net_revenue
    BEFORE INSERT OR UPDATE ON finance_entries
    FOR EACH ROW
    EXECUTE FUNCTION calculate_net_revenue();
