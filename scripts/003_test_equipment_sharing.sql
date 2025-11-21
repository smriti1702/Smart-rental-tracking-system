-- Test script for equipment sharing functionality
-- This script tests the database functions and data

-- Test 1: Check if sites have coordinates
SELECT site_id, name, latitude, longitude 
FROM public.sites 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Test 2: Check shareable equipment
SELECT 
  e.equipment_id,
  e.type,
  e.utilization_rate,
  e.is_shareable,
  e.status,
  s.name as owner_site_name
FROM public.equipment e
JOIN public.sites s ON e.owner_site_id = s.id
WHERE e.is_shareable = true;

-- Test 3: Test distance calculation function
SELECT 
  calculate_distance_km(40.7128, -74.0060, 40.6782, -73.9442) as distance_nyc_brooklyn;

-- Test 4: Test finding nearby equipment function
SELECT * FROM find_nearby_shareable_equipment(
  40.7128, -- NYC latitude
  -74.0060, -- NYC longitude
  50, -- max distance 50km
  NULL -- all equipment types
);

-- Test 5: Check sharing preferences
SELECT 
  sp.max_sharing_distance_km,
  sp.auto_approve_sharing,
  sp.equipment_types_shareable,
  s.name as site_name
FROM public.sharing_preferences sp
JOIN public.sites s ON sp.site_id = s.id;

-- Test 6: Check equipment utilization data
SELECT 
  eu.equipment_id,
  eu.date,
  eu.hours_used,
  eu.utilization_percentage,
  eu.is_underutilized
FROM public.equipment_utilization eu
ORDER BY eu.date DESC
LIMIT 10;

-- Test 7: Check existing sharing records
SELECT 
  es.id,
  e.equipment_id,
  owner.name as owner_site,
  borrower.name as borrower_site,
  es.status,
  es.distance_km,
  es.total_cost
FROM public.equipment_sharing es
JOIN public.equipment e ON es.equipment_id = e.id
JOIN public.sites owner ON es.owner_site_id = owner.id
JOIN public.sites borrower ON es.borrower_site_id = borrower.id;
