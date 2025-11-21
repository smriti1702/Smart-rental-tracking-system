-- Create equipment table
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  year INTEGER,
  status TEXT NOT NULL DEFAULT 'available',
  location TEXT,
  engine_hours DECIMAL DEFAULT 0,
  fuel_level DECIMAL DEFAULT 100,
  last_maintenance_date DATE,
  next_maintenance_due DATE,
  purchase_date DATE,
  purchase_price DECIMAL,
  current_value DECIMAL,
  condition TEXT DEFAULT 'good',
  utilization_rate DECIMAL DEFAULT 0,
  is_shareable BOOLEAN DEFAULT false,
  owner_site_id UUID REFERENCES public.sites(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sites table
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create operators table
CREATE TABLE IF NOT EXISTS public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  certification_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  operator_id UUID REFERENCES public.operators(id) ON DELETE SET NULL,
  check_out_date TIMESTAMP WITH TIME ZONE NOT NULL,
  planned_return_date TIMESTAMP WITH TIME ZONE,
  actual_return_date TIMESTAMP WITH TIME ZONE,
  check_out_engine_hours DECIMAL,
  check_in_engine_hours DECIMAL,
  check_out_fuel_level DECIMAL,
  check_in_fuel_level DECIMAL,
  rental_rate DECIMAL,
  total_cost DECIMAL,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  maintenance_date DATE NOT NULL,
  maintenance_type TEXT NOT NULL,
  description TEXT,
  cost DECIMAL,
  performed_by TEXT,
  next_maintenance_due DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create equipment sharing table for Airbnb-style sharing
CREATE TABLE IF NOT EXISTS public.equipment_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  owner_site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  borrower_site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  sharing_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sharing_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  hourly_rate DECIMAL NOT NULL,
  total_hours DECIMAL DEFAULT 0,
  total_cost DECIMAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, completed, cancelled
  distance_km DECIMAL,
  sharing_reason TEXT,
  equipment_condition_before TEXT,
  equipment_condition_after TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create equipment utilization tracking table
CREATE TABLE IF NOT EXISTS public.equipment_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  hours_used DECIMAL DEFAULT 0,
  hours_available DECIMAL DEFAULT 24,
  utilization_percentage DECIMAL DEFAULT 0,
  is_underutilized BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sharing preferences table
CREATE TABLE IF NOT EXISTS public.sharing_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  max_sharing_distance_km DECIMAL DEFAULT 50,
  min_utilization_threshold DECIMAL DEFAULT 30,
  preferred_hourly_rate DECIMAL,
  auto_approve_sharing BOOLEAN DEFAULT false,
  equipment_types_shareable TEXT[], -- Array of equipment types that can be shared
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_utilization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sharing_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo system)
-- In production, you would want more restrictive policies based on user roles

CREATE POLICY "Allow public read access on equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Allow public insert on equipment" ON public.equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on equipment" ON public.equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on equipment" ON public.equipment FOR DELETE USING (true);

CREATE POLICY "Allow public read access on sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sites" ON public.sites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sites" ON public.sites FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on sites" ON public.sites FOR DELETE USING (true);

CREATE POLICY "Allow public read access on operators" ON public.operators FOR SELECT USING (true);
CREATE POLICY "Allow public insert on operators" ON public.operators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on operators" ON public.operators FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on operators" ON public.operators FOR DELETE USING (true);

CREATE POLICY "Allow public read access on rentals" ON public.rentals FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rentals" ON public.rentals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rentals" ON public.rentals FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on rentals" ON public.rentals FOR DELETE USING (true);

CREATE POLICY "Allow public read access on maintenance_records" ON public.maintenance_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on maintenance_records" ON public.maintenance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on maintenance_records" ON public.maintenance_records FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on maintenance_records" ON public.maintenance_records FOR DELETE USING (true);

CREATE POLICY "Allow public read access on alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on alerts" ON public.alerts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on alerts" ON public.alerts FOR DELETE USING (true);

CREATE POLICY "Allow public read access on equipment_sharing" ON public.equipment_sharing FOR SELECT USING (true);
CREATE POLICY "Allow public insert on equipment_sharing" ON public.equipment_sharing FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on equipment_sharing" ON public.equipment_sharing FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on equipment_sharing" ON public.equipment_sharing FOR DELETE USING (true);

CREATE POLICY "Allow public read access on equipment_utilization" ON public.equipment_utilization FOR SELECT USING (true);
CREATE POLICY "Allow public insert on equipment_utilization" ON public.equipment_utilization FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on equipment_utilization" ON public.equipment_utilization FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on equipment_utilization" ON public.equipment_utilization FOR DELETE USING (true);

CREATE POLICY "Allow public read access on sharing_preferences" ON public.sharing_preferences FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sharing_preferences" ON public.sharing_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on sharing_preferences" ON public.sharing_preferences FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on sharing_preferences" ON public.sharing_preferences FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_equipment_status ON public.equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON public.equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_shareable ON public.equipment(is_shareable);
CREATE INDEX IF NOT EXISTS idx_equipment_utilization_rate ON public.equipment(utilization_rate);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_equipment_id ON public.rentals(equipment_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);
CREATE INDEX IF NOT EXISTS idx_sites_coordinates ON public.sites(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_equipment_sharing_status ON public.equipment_sharing(status);
CREATE INDEX IF NOT EXISTS idx_equipment_sharing_distance ON public.equipment_sharing(distance_km);
CREATE INDEX IF NOT EXISTS idx_equipment_utilization_date ON public.equipment_utilization(date);
CREATE INDEX IF NOT EXISTS idx_equipment_utilization_underutilized ON public.equipment_utilization(is_underutilized);

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to find nearby equipment for sharing
CREATE OR REPLACE FUNCTION find_nearby_shareable_equipment(
  site_lat DECIMAL,
  site_lon DECIMAL,
  max_distance_km DECIMAL DEFAULT 50,
  equipment_type TEXT DEFAULT NULL
) RETURNS TABLE (
  equipment_id TEXT,
  equipment_type TEXT,
  model TEXT,
  manufacturer TEXT,
  owner_site_name TEXT,
  distance_km DECIMAL,
  utilization_rate DECIMAL,
  hourly_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.equipment_id,
    e.type,
    e.model,
    e.manufacturer,
    s.name as owner_site_name,
    calculate_distance_km(site_lat, site_lon, s.latitude, s.longitude) as distance_km,
    e.utilization_rate,
    sp.preferred_hourly_rate
  FROM public.equipment e
  JOIN public.sites s ON e.owner_site_id = s.id
  LEFT JOIN public.sharing_preferences sp ON s.id = sp.site_id
  WHERE e.is_shareable = true
    AND e.status = 'available'
    AND e.utilization_rate < 50
    AND calculate_distance_km(site_lat, site_lon, s.latitude, s.longitude) <= max_distance_km
    AND (equipment_type IS NULL OR e.type = equipment_type)
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;
