-- Enhanced Equipment Dataset for Equipment Sharing
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
