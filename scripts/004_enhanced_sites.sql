-- Enhanced Sites Dataset for Equipment Sharing
-- All sites are strategically placed to be within sharing distance of each other

INSERT INTO public.sites (site_id, name, location, type, status, created_at, updated_at, latitude, longitude) VALUES
-- NYC Metro Area (Manhattan, Brooklyn, Queens, Bronx) - All within 50km of each other
('SITE001', 'Downtown Manhattan Construction', 'Financial District, Manhattan', 'Commercial', 'active', NOW(), NOW(), 40.7128, -74.0060),
('SITE002', 'Brooklyn Bridge Project', 'DUMBO, Brooklyn', 'Infrastructure', 'active', NOW(), NOW(), 40.7023, -73.9871),
('SITE003', 'Queens Airport Expansion', 'JFK Airport, Queens', 'Infrastructure', 'active', NOW(), NOW(), 40.6413, -73.7781),
('SITE004', 'Bronx Housing Development', 'South Bronx', 'Residential', 'active', NOW(), NOW(), 40.8448, -73.8648),
('SITE005', 'Manhattan West Project', 'Hudson Yards, Manhattan', 'Commercial', 'active', NOW(), NOW(), 40.7589, -74.0060),
('SITE006', 'Brooklyn Navy Yard', 'Navy Yard, Brooklyn', 'Industrial', 'active', NOW(), NOW(), 40.7023, -73.9701),
('SITE007', 'Queens Shopping Center', 'Flushing, Queens', 'Commercial', 'active', NOW(), NOW(), 40.7589, -73.8300),
('SITE008', 'Bronx River Project', 'Bronx River, Bronx', 'Environmental', 'active', NOW(), NOW(), 40.8448, -73.8648),

-- Los Angeles Metro Area - All within 50km of each other
('SITE009', 'Downtown LA Tower', 'Downtown Los Angeles', 'Commercial', 'active', NOW(), NOW(), 34.0522, -118.2437),
('SITE010', 'Venice Beach Development', 'Venice Beach, LA', 'Residential', 'active', NOW(), NOW(), 33.9850, -118.4695),
('SITE011', 'Hollywood Studio Project', 'Hollywood, LA', 'Entertainment', 'active', NOW(), NOW(), 34.0928, -118.3287),
('SITE012', 'Santa Monica Pier', 'Santa Monica', 'Infrastructure', 'active', NOW(), NOW(), 34.0195, -118.4912),

-- Chicago Metro Area - All within 50km of each other
('SITE013', 'Loop Office Complex', 'Chicago Loop', 'Commercial', 'active', NOW(), NOW(), 41.8781, -87.6298),
('SITE014', 'O''Hare Airport Expansion', 'O''Hare Airport', 'Infrastructure', 'active', NOW(), NOW(), 41.9786, -87.9048),
('SITE015', 'Navy Pier Renovation', 'Navy Pier, Chicago', 'Entertainment', 'active', NOW(), NOW(), 41.8919, -87.6028),
('SITE016', 'Wrigley Field Area', 'Wrigleyville, Chicago', 'Commercial', 'active', NOW(), NOW(), 41.9484, -87.6553),

-- Seattle Metro Area - All within 50km of each other
('SITE017', 'Seattle Downtown', 'Downtown Seattle', 'Commercial', 'active', NOW(), NOW(), 47.6062, -122.3321),
('SITE018', 'Bellevue Tech Campus', 'Bellevue, WA', 'Commercial', 'active', NOW(), NOW(), 47.6101, -122.2015),
('SITE019', 'Tacoma Port Project', 'Tacoma Port', 'Infrastructure', 'active', NOW(), NOW(), 47.2529, -122.4443),
('SITE020', 'Redmond Microsoft Campus', 'Redmond, WA', 'Commercial', 'active', NOW(), NOW(), 47.6769, -122.2060)

ON CONFLICT (site_id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();
