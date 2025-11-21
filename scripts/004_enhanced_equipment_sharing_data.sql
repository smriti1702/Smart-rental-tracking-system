-- Enhanced Equipment Sharing Dataset
-- This script adds comprehensive data for equipment sharing demonstration

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM equipment_sharing;
-- DELETE FROM equipment_utilization;
-- DELETE FROM sharing_preferences;
-- DELETE FROM equipment WHERE is_shareable = true;
-- DELETE FROM sites WHERE site_id LIKE 'SITE%';

-- 1. ENHANCED SITES WITH REALISTIC NEARBY LOCATIONS
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

-- 2. ENHANCED EQUIPMENT WITH REALISTIC UTILIZATION RATES
-- Equipment with low utilization rates (under 50%) that can be shared

INSERT INTO public.equipment (equipment_id, type, model, manufacturer, year, status, location, engine_hours, fuel_level, rental_start_date, rental_end_date, purchase_date, purchase_price, current_value, condition, utilization_rate, is_shareable, owner_site_id) VALUES
-- NYC Metro Area Equipment (Low utilization - available for sharing)
('EQ001', 'Excavator', '320D', 'Caterpillar', 2021, 'available', 'Downtown Manhattan', 1200.0, 85, '2024-07-20', '2024-10-20', '2021-03-15', 350000, 320000, 'excellent', 15.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE001')),
('EQ002', 'Crane', 'RT540E', 'Grove', 2020, 'available', 'Brooklyn Bridge', 1800.0, 90, '2024-07-25', '2024-10-25', '2020-08-10', 280000, 250000, 'good', 25.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE002')),
('EQ003', 'Bulldozer', 'D6T', 'Caterpillar', 2022, 'available', 'Queens Airport', 800.0, 75, '2024-07-22', '2024-10-22', '2022-01-20', 420000, 400000, 'excellent', 10.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE003')),
('EQ004', 'Grader', '140M', 'Caterpillar', 2021, 'available', 'Bronx Housing', 1500.0, 80, '2024-07-18', '2024-10-18', '2021-06-05', 180000, 160000, 'good', 20.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE004')),
('EQ005', 'Loader', '950K', 'Caterpillar', 2020, 'available', 'Manhattan West', 2000.0, 70, '2024-07-15', '2024-10-15', '2020-11-12', 220000, 190000, 'good', 30.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE005')),
('EQ006', 'Excavator', '336D', 'Caterpillar', 2021, 'available', 'Brooklyn Navy Yard', 1100.0, 85, '2024-07-28', '2024-10-28', '2021-04-08', 380000, 350000, 'excellent', 18.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE006')),
('EQ007', 'Crane', 'M318F', 'Liebherr', 2020, 'available', 'Queens Shopping', 1600.0, 75, '2024-07-30', '2024-10-30', '2020-09-25', 320000, 290000, 'good', 22.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE007')),
('EQ008', 'Bulldozer', 'D7T', 'Caterpillar', 2022, 'available', 'Bronx River', 900.0, 90, '2024-07-25', '2024-10-25', '2022-02-14', 450000, 430000, 'excellent', 12.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE008')),

-- LA Metro Area Equipment (Low utilization - available for sharing)
('EQ009', 'Excavator', '330D', 'Caterpillar', 2021, 'available', 'Downtown LA', 1300.0, 80, '2024-07-20', '2024-10-20', '2021-05-10', 360000, 330000, 'excellent', 16.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE009')),
('EQ010', 'Crane', 'RT550E', 'Grove', 2020, 'available', 'Venice Beach', 1700.0, 85, '2024-07-22', '2024-10-22', '2020-07-18', 290000, 260000, 'good', 28.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE010')),
('EQ011', 'Grader', '140M', 'Caterpillar', 2021, 'available', 'Hollywood Studio', 1400.0, 75, '2024-07-25', '2024-10-25', '2021-08-22', 185000, 165000, 'good', 24.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE011')),
('EQ012', 'Loader', '966K', 'Caterpillar', 2020, 'available', 'Santa Monica Pier', 1900.0, 70, '2024-07-28', '2024-10-28', '2020-12-03', 240000, 210000, 'good', 32.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE012')),

-- Chicago Metro Area Equipment (Low utilization - available for sharing)
('EQ013', 'Excavator', '325D', 'Caterpillar', 2021, 'available', 'Chicago Loop', 1250.0, 85, '2024-07-18', '2024-10-18', '2021-02-28', 340000, 310000, 'excellent', 14.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE013')),
('EQ014', 'Crane', 'RT540E', 'Grove', 2020, 'available', 'O''Hare Airport', 1750.0, 90, '2024-07-20', '2024-10-20', '2020-10-15', 285000, 255000, 'good', 26.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE014')),
('EQ015', 'Bulldozer', 'D6T', 'Caterpillar', 2022, 'available', 'Navy Pier', 850.0, 80, '2024-07-22', '2024-10-22', '2022-03-08', 410000, 390000, 'excellent', 11.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE015')),
('EQ016', 'Grader', '140M', 'Caterpillar', 2021, 'available', 'Wrigley Field', 1550.0, 75, '2024-07-25', '2024-10-25', '2021-07-12', 182000, 162000, 'good', 21.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE016')),

-- Seattle Metro Area Equipment (Low utilization - available for sharing)
('EQ017', 'Excavator', '330D', 'Caterpillar', 2021, 'available', 'Seattle Downtown', 1350.0, 85, '2024-07-20', '2024-10-20', '2021-04-20', 355000, 325000, 'excellent', 17.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE017')),
('EQ018', 'Crane', 'RT550E', 'Grove', 2020, 'available', 'Bellevue Tech', 1650.0, 80, '2024-07-22', '2024-10-22', '2020-08-30', 295000, 265000, 'good', 27.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE018')),
('EQ019', 'Loader', '950K', 'Caterpillar', 2020, 'available', 'Tacoma Port', 1950.0, 70, '2024-07-25', '2024-10-25', '2020-11-20', 225000, 195000, 'good', 33.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE019')),
('EQ020', 'Bulldozer', 'D7T', 'Caterpillar', 2022, 'available', 'Redmond Microsoft', 950.0, 90, '2024-07-28', '2024-10-28', '2022-01-15', 440000, 420000, 'excellent', 13.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE020'))

ON CONFLICT (equipment_id) DO UPDATE SET
  type = EXCLUDED.type,
  model = EXCLUDED.model,
  manufacturer = EXCLUDED.manufacturer,
  year = EXCLUDED.year,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  engine_hours = EXCLUDED.engine_hours,
  fuel_level = EXCLUDED.fuel_level,
  utilization_rate = EXCLUDED.utilization_rate,
  is_shareable = EXCLUDED.is_shareable,
  owner_site_id = EXCLUDED.owner_site_id,
  updated_at = NOW();

-- 3. ENHANCED SHARING PREFERENCES FOR EACH SITE
-- Different preferences for different types of sites

INSERT INTO public.sharing_preferences (site_id, max_sharing_distance_km, min_utilization_threshold, preferred_hourly_rate, auto_approve_sharing, equipment_types_shareable, created_at, updated_at) VALUES
-- NYC Metro Area Preferences
((SELECT id FROM public.sites WHERE site_id = 'SITE001'), 30, 25, 85.00, true, ARRAY['Excavator', 'Crane', 'Loader'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE002'), 40, 30, 90.00, false, ARRAY['Crane', 'Excavator'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE003'), 50, 20, 80.00, true, ARRAY['Bulldozer', 'Grader', 'Excavator'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE004'), 35, 25, 75.00, true, ARRAY['Grader', 'Bulldozer', 'Loader'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE005'), 25, 30, 95.00, false, ARRAY['Crane', 'Excavator'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE006'), 45, 20, 70.00, true, ARRAY['Excavator', 'Crane', 'Bulldozer'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE007'), 30, 25, 85.00, true, ARRAY['Crane', 'Loader'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE008'), 40, 20, 75.00, true, ARRAY['Bulldozer', 'Grader'], NOW(), NOW()),

-- LA Metro Area Preferences
((SELECT id FROM public.sites WHERE site_id = 'SITE009'), 35, 25, 90.00, false, ARRAY['Excavator', 'Crane'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE010'), 40, 30, 85.00, true, ARRAY['Crane', 'Excavator'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE011'), 30, 25, 80.00, true, ARRAY['Grader', 'Loader'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE012'), 45, 20, 75.00, true, ARRAY['Loader', 'Grader'], NOW(), NOW()),

-- Chicago Metro Area Preferences
((SELECT id FROM public.sites WHERE site_id = 'SITE013'), 40, 25, 85.00, false, ARRAY['Excavator', 'Crane'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE014'), 50, 20, 80.00, true, ARRAY['Crane', 'Bulldozer'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE015'), 35, 30, 90.00, true, ARRAY['Bulldozer', 'Excavator'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE016'), 30, 25, 85.00, true, ARRAY['Grader', 'Loader'], NOW(), NOW()),

-- Seattle Metro Area Preferences
((SELECT id FROM public.sites WHERE site_id = 'SITE017'), 40, 25, 90.00, false, ARRAY['Excavator', 'Crane'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE018'), 35, 30, 95.00, true, ARRAY['Crane', 'Excavator'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE019'), 45, 20, 75.00, true, ARRAY['Loader', 'Bulldozer'], NOW(), NOW()),
((SELECT id FROM public.sites WHERE site_id = 'SITE020'), 30, 25, 85.00, true, ARRAY['Bulldozer', 'Grader'], NOW(), NOW())

ON CONFLICT (site_id) DO UPDATE SET
  max_sharing_distance_km = EXCLUDED.max_sharing_distance_km,
  min_utilization_threshold = EXCLUDED.min_utilization_threshold,
  preferred_hourly_rate = EXCLUDED.preferred_hourly_rate,
  auto_approve_sharing = EXCLUDED.auto_approve_sharing,
  equipment_types_shareable = EXCLUDED.equipment_types_shareable,
  updated_at = NOW();

-- 4. ENHANCED EQUIPMENT UTILIZATION DATA (Last 30 days)
-- Shows realistic utilization patterns

INSERT INTO public.equipment_utilization (equipment_id, site_id, date, hours_used, hours_available, utilization_percentage, is_underutilized, created_at) VALUES
-- NYC Metro Area - Recent utilization data
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), CURRENT_DATE - INTERVAL '1 day', 2.5, 24, 10.4, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), CURRENT_DATE - INTERVAL '2 days', 3.0, 24, 12.5, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), CURRENT_DATE - INTERVAL '3 days', 2.0, 24, 8.3, true, NOW()),

((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), CURRENT_DATE - INTERVAL '1 day', 4.0, 24, 16.7, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), CURRENT_DATE - INTERVAL '2 days', 5.5, 24, 22.9, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), CURRENT_DATE - INTERVAL '3 days', 3.5, 24, 14.6, true, NOW()),

((SELECT id FROM public.equipment WHERE equipment_id = 'EQ003'), (SELECT id FROM public.sites WHERE site_id = 'SITE003'), CURRENT_DATE - INTERVAL '1 day', 1.5, 24, 6.3, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ003'), (SELECT id FROM public.sites WHERE site_id = 'SITE003'), CURRENT_DATE - INTERVAL '2 days', 2.0, 24, 8.3, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ003'), (SELECT id FROM public.sites WHERE site_id = 'SITE003'), CURRENT_DATE - INTERVAL '3 days', 1.0, 24, 4.2, true, NOW()),

-- LA Metro Area - Recent utilization data
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE009'), CURRENT_DATE - INTERVAL '1 day', 3.0, 24, 12.5, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE009'), CURRENT_DATE - INTERVAL '2 days', 2.5, 24, 10.4, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE009'), CURRENT_DATE - INTERVAL '3 days', 3.5, 24, 14.6, true, NOW()),

((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE010'), CURRENT_DATE - INTERVAL '1 day', 5.0, 24, 20.8, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE010'), CURRENT_DATE - INTERVAL '2 days', 4.5, 24, 18.8, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE010'), CURRENT_DATE - INTERVAL '3 days', 6.0, 24, 25.0, true, NOW()),

-- Chicago Metro Area - Recent utilization data
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ013'), (SELECT id FROM public.sites WHERE site_id = 'SITE013'), CURRENT_DATE - INTERVAL '1 day', 2.0, 24, 8.3, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ013'), (SELECT id FROM public.sites WHERE site_id = 'SITE013'), CURRENT_DATE - INTERVAL '2 days', 2.5, 24, 10.4, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ013'), (SELECT id FROM public.sites WHERE site_id = 'SITE013'), CURRENT_DATE - INTERVAL '3 days', 1.5, 24, 6.3, true, NOW()),

-- Seattle Metro Area - Recent utilization data
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ017'), (SELECT id FROM public.sites WHERE site_id = 'SITE017'), CURRENT_DATE - INTERVAL '1 day', 3.5, 24, 14.6, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ017'), (SELECT id FROM public.sites WHERE site_id = 'SITE017'), CURRENT_DATE - INTERVAL '2 days', 2.0, 24, 8.3, true, NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ017'), (SELECT id FROM public.sites WHERE site_id = 'SITE017'), CURRENT_DATE - INTERVAL '3 days', 3.0, 24, 12.5, true, NOW())

ON CONFLICT DO NOTHING;

-- 5. SAMPLE SHARING RECORDS (Active and Completed)
-- Shows real sharing activity between nearby sites

INSERT INTO public.equipment_sharing (equipment_id, owner_site_id, borrower_site_id, sharing_start_date, sharing_end_date, hourly_rate, total_hours, total_cost, status, distance_km, sharing_reason, equipment_condition_before, equipment_condition_after, created_at, updated_at) VALUES
-- NYC Metro Area Sharing Examples
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), '2024-08-20 08:00:00', '2024-08-22 17:00:00', 85.00, 18.0, 1530.00, 'completed', 8.5, 'Emergency foundation work at Brooklyn Bridge project', 'excellent', 'excellent', NOW(), NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), (SELECT id FROM public.sites WHERE site_id = 'SITE005'), '2024-08-25 07:00:00', '2024-08-27 18:00:00', 90.00, 22.0, 1980.00, 'active', 12.3, 'Steel beam installation at Manhattan West', 'good', 'good', NOW(), NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ003'), (SELECT id FROM public.sites WHERE site_id = 'SITE003'), (SELECT id FROM public.sites WHERE site_id = 'SITE004'), '2024-08-28 08:00:00', '2024-08-30 17:00:00', 80.00, 16.0, 1280.00, 'pending', 15.7, 'Site preparation for housing development', 'excellent', NULL, NOW(), NOW()),

-- LA Metro Area Sharing Examples
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE009'), (SELECT id FROM public.sites WHERE site_id = 'SITE010'), '2024-08-18 08:00:00', '2024-08-20 17:00:00', 90.00, 18.0, 1620.00, 'completed', 10.2, 'Beachfront development excavation', 'excellent', 'excellent', NOW(), NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE010'), (SELECT id FROM public.sites WHERE site_id = 'SITE011'), '2024-08-22 07:00:00', '2024-08-24 18:00:00', 85.00, 20.0, 1700.00, 'active', 8.8, 'Studio set construction', 'good', 'good', NOW(), NOW()),

-- Chicago Metro Area Sharing Examples
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ013'), (SELECT id FROM public.sites WHERE site_id = 'SITE013'), (SELECT id FROM public.sites WHERE site_id = 'SITE014'), '2024-08-19 08:00:00', '2024-08-21 17:00:00', 85.00, 18.0, 1530.00, 'completed', 18.5, 'Airport runway maintenance', 'excellent', 'excellent', NOW(), NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ014'), (SELECT id FROM public.sites WHERE site_id = 'SITE014'), (SELECT id FROM public.sites WHERE site_id = 'SITE015'), '2024-08-26 07:00:00', '2024-08-28 18:00:00', 80.00, 20.0, 1600.00, 'active', 22.1, 'Pier renovation work', 'good', 'good', NOW(), NOW()),

-- Seattle Metro Area Sharing Examples
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ017'), (SELECT id FROM public.sites WHERE site_id = 'SITE017'), (SELECT id FROM public.sites WHERE site_id = 'SITE018'), '2024-08-21 08:00:00', '2024-08-23 17:00:00', 90.00, 18.0, 1620.00, 'completed', 12.7, 'Tech campus foundation work', 'excellent', 'excellent', NOW(), NOW()),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ018'), (SELECT id FROM public.sites WHERE site_id = 'SITE018'), (SELECT id FROM public.sites WHERE site_id = 'SITE019'), '2024-08-24 07:00:00', '2024-08-26 18:00:00', 95.00, 20.0, 1900.00, 'active', 28.3, 'Port expansion project', 'good', 'good', NOW(), NOW())

ON CONFLICT DO NOTHING;

-- 6. VERIFICATION QUERIES
-- Run these to verify the data was inserted correctly

-- Check total sites with coordinates
SELECT 'Total Sites with Coordinates' as metric, COUNT(*) as count FROM public.sites WHERE latitude IS NOT NULL AND longitude IS NOT NULL
UNION ALL
-- Check shareable equipment
SELECT 'Shareable Equipment' as metric, COUNT(*) as count FROM public.equipment WHERE is_shareable = true
UNION ALL
-- Check sharing preferences
SELECT 'Sites with Sharing Preferences' as metric, COUNT(*) as count FROM public.sharing_preferences
UNION ALL
-- Check utilization data
SELECT 'Equipment Utilization Records' as metric, COUNT(*) as count FROM public.equipment_utilization
UNION ALL
-- Check sharing records
SELECT 'Equipment Sharing Records' as metric, COUNT(*) as count FROM public.equipment_sharing;

-- Show sample nearby equipment for Downtown Manhattan (SITE001)
SELECT 
  'Sample Nearby Equipment for Downtown Manhattan:' as info,
  e.equipment_id,
  e.type,
  e.model,
  s.name as owner_site,
  e.utilization_rate,
  e.is_shareable,
  calculate_distance_km(40.7128, -74.0060, s.latitude, s.longitude) as distance_km
FROM public.equipment e
JOIN public.sites s ON e.owner_site_id = s.id
WHERE e.is_shareable = true 
  AND e.utilization_rate < 50
  AND calculate_distance_km(40.7128, -74.0060, s.latitude, s.longitude) <= 50
ORDER BY distance_km;
