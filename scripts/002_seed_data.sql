-- Insert sample sites with coordinates
INSERT INTO public.sites (site_id, name, location, address, contact_person, contact_phone, contact_email, latitude, longitude) VALUES
('SITE001', 'Downtown Construction', 'New York, NY', '123 Main St, New York, NY 10001', 'John Smith', '555-0101', 'john@downtown.com', 40.7128, -74.0060),
('SITE002', 'Highway Project', 'Los Angeles, CA', '456 Highway Blvd, Los Angeles, CA 90001', 'Sarah Johnson', '555-0102', 'sarah@highway.com', 34.0522, -118.2437),
('SITE003', 'Bridge Construction', 'Chicago, IL', '789 Bridge Ave, Chicago, IL 60601', 'Mike Wilson', '555-0103', 'mike@bridge.com', 41.8781, -87.6298),
('SITE004', 'Mining Operation', 'Denver, CO', '321 Mine Rd, Denver, CO 80201', 'Lisa Brown', '555-0104', 'lisa@mining.com', 39.7392, -104.9903),
('SITE005', 'Port Development', 'Seattle, WA', '654 Port St, Seattle, WA 98101', 'David Lee', '555-0105', 'david@port.com', 47.6062, -122.3321),
('SITE006', 'Suburban Development', 'Brooklyn, NY', '987 Suburban Ave, Brooklyn, NY 11201', 'Emma Davis', '555-0106', 'emma@suburban.com', 40.6782, -73.9442),
('SITE007', 'Airport Expansion', 'Queens, NY', '456 Airport Blvd, Queens, NY 11430', 'Tom Wilson', '555-0107', 'tom@airport.com', 40.6413, -73.7781),
('SITE008', 'Shopping Center', 'Manhattan, NY', '789 Mall St, Manhattan, NY 10002', 'Anna Garcia', '555-0108', 'anna@mall.com', 40.7589, -73.9851);

-- Insert sample operators
INSERT INTO public.operators (operator_id, name, email, phone, license_number, license_expiry, certification_level) VALUES
('OP001', 'Robert Garcia', 'robert@email.com', '555-1001', 'CDL123456', '2025-12-31', 'Advanced'),
('OP002', 'Maria Rodriguez', 'maria@email.com', '555-1002', 'CDL234567', '2025-11-30', 'Intermediate'),
('OP003', 'James Anderson', 'james@email.com', '555-1003', 'CDL345678', '2026-01-15', 'Advanced'),
('OP004', 'Jennifer Taylor', 'jennifer@email.com', '555-1004', 'CDL456789', '2025-10-20', 'Basic'),
('OP005', 'Michael Brown', 'michael@email.com', '555-1005', 'CDL567890', '2026-03-10', 'Expert');

-- Insert sample equipment with sharing information
INSERT INTO public.equipment (equipment_id, type, model, manufacturer, year, status, location, engine_hours, fuel_level, last_maintenance_date, next_maintenance_due, purchase_date, purchase_price, current_value, condition, utilization_rate, is_shareable, owner_site_id) VALUES
('EQ001', 'Excavator', '320D', 'Caterpillar', 2022, 'rented', 'Downtown Construction', 1250.5, 75, '2024-07-15', '2024-10-15', '2022-01-15', 250000, 200000, 'excellent', 85.5, true, (SELECT id FROM public.sites WHERE site_id = 'SITE001')),
('EQ002', 'Crane', 'RT540E', 'Grove', 2021, 'available', 'Warehouse A', 890.0, 90, '2024-08-01', '2024-11-01', '2021-03-20', 180000, 150000, 'good', 25.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE002')),
('EQ003', 'Bulldozer', 'D6T', 'Caterpillar', 2023, 'rented', 'Highway Project', 567.25, 60, '2024-07-20', '2024-10-20', '2023-02-10', 320000, 280000, 'excellent', 92.0, false, (SELECT id FROM public.sites WHERE site_id = 'SITE002')),
('EQ004', 'Excavator', '336F', 'Caterpillar', 2020, 'maintenance', 'Service Center', 2100.75, 45, '2024-08-10', '2024-09-10', '2020-05-15', 280000, 200000, 'fair', 0.0, false, (SELECT id FROM public.sites WHERE site_id = 'SITE003')),
('EQ005', 'Bulldozer', 'D8T', 'Caterpillar', 2022, 'rented', 'Mining Operation', 1800.0, 80, '2024-07-25', '2024-10-25', '2022-06-01', 450000, 380000, 'good', 78.5, true, (SELECT id FROM public.sites WHERE site_id = 'SITE004')),
('EQ006', 'Grader', '140M', 'Caterpillar', 2021, 'available', 'Warehouse B', 1200.5, 85, '2024-08-05', '2024-11-05', '2021-04-10', 200000, 160000, 'good', 15.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE005')),
('EQ007', 'Loader', '950M', 'Caterpillar', 2023, 'rented', 'Bridge Construction', 450.25, 70, '2024-08-15', '2024-11-15', '2023-01-20', 150000, 135000, 'excellent', 88.0, false, (SELECT id FROM public.sites WHERE site_id = 'SITE003')),
('EQ008', 'Excavator', '330D', 'Caterpillar', 2021, 'available', 'Suburban Development', 980.0, 95, '2024-07-30', '2024-10-30', '2021-08-15', 220000, 180000, 'good', 20.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE006')),
('EQ009', 'Crane', 'RT550E', 'Grove', 2022, 'available', 'Airport Expansion', 750.5, 88, '2024-08-12', '2024-11-12', '2022-03-10', 190000, 160000, 'good', 30.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE007')),
('EQ010', 'Bulldozer', 'D7T', 'Caterpillar', 2020, 'available', 'Shopping Center', 1500.0, 70, '2024-07-25', '2024-10-25', '2020-11-20', 280000, 220000, 'good', 10.0, true, (SELECT id FROM public.sites WHERE site_id = 'SITE008'));

-- Insert sample rentals
INSERT INTO public.rentals (equipment_id, site_id, operator_id, check_out_date, planned_return_date, check_out_engine_hours, check_out_fuel_level, rental_rate, status, notes) VALUES
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), (SELECT id FROM public.operators WHERE operator_id = 'OP001'), '2024-08-01 08:00:00', '2024-09-01 17:00:00', 1200.0, 100, 500.00, 'active', 'Foundation work project'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ003'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), (SELECT id FROM public.operators WHERE operator_id = 'OP002'), '2024-08-05 09:00:00', '2024-09-15 17:00:00', 550.0, 95, 750.00, 'active', 'Road construction'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ005'), (SELECT id FROM public.sites WHERE site_id = 'SITE004'), (SELECT id FROM public.operators WHERE operator_id = 'OP003'), '2024-07-20 07:00:00', '2024-08-30 18:00:00', 1750.0, 100, 900.00, 'active', 'Mining excavation'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ007'), (SELECT id FROM public.sites WHERE site_id = 'SITE003'), (SELECT id FROM public.operators WHERE operator_id = 'OP004'), '2024-08-10 08:30:00', '2024-09-10 17:00:00', 420.0, 90, 400.00, 'active', 'Material handling');

-- Insert sample maintenance records
INSERT INTO public.maintenance_records (equipment_id, maintenance_date, maintenance_type, description, cost, performed_by, next_maintenance_due) VALUES
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), '2024-07-15', 'Preventive', 'Oil change, filter replacement, hydraulic system check', 850.00, 'Service Team A', '2024-10-15'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), '2024-08-01', 'Preventive', 'Engine tune-up, brake inspection', 1200.00, 'Service Team B', '2024-11-01'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ004'), '2024-08-10', 'Repair', 'Hydraulic pump replacement', 3500.00, 'Service Team A', '2024-09-10'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ006'), '2024-08-05', 'Preventive', 'Transmission service, cooling system check', 950.00, 'Service Team C', '2024-11-05');

-- Insert sample alerts
INSERT INTO public.alerts (equipment_id, alert_type, severity, title, description, status) VALUES
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), 'overdue', 'high', 'Equipment Overdue', 'EQ001 was due back 2 days ago from Downtown Construction site', 'active'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ004'), 'maintenance', 'critical', 'Maintenance Required', 'EQ004 requires immediate hydraulic system repair', 'active'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ003'), 'fuel', 'medium', 'Low Fuel Level', 'EQ003 fuel level is below 65% threshold', 'active'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ005'), 'idle', 'low', 'Extended Idle Time', 'EQ005 has been idle for 4+ hours at mining site', 'active'),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ007'), 'anomaly', 'medium', 'Usage Anomaly', 'EQ007 showing unusual engine hour patterns', 'active');

-- Insert sharing preferences for each site
INSERT INTO public.sharing_preferences (site_id, max_sharing_distance_km, min_utilization_threshold, preferred_hourly_rate, auto_approve_sharing, equipment_types_shareable) VALUES
((SELECT id FROM public.sites WHERE site_id = 'SITE001'), 30.0, 25.0, 75.00, true, ARRAY['Excavator', 'Crane', 'Loader']),
((SELECT id FROM public.sites WHERE site_id = 'SITE002'), 50.0, 30.0, 85.00, false, ARRAY['Crane', 'Bulldozer']),
((SELECT id FROM public.sites WHERE site_id = 'SITE003'), 40.0, 20.0, 65.00, true, ARRAY['Excavator', 'Loader']),
((SELECT id FROM public.sites WHERE site_id = 'SITE004'), 100.0, 35.0, 95.00, false, ARRAY['Bulldozer', 'Excavator']),
((SELECT id FROM public.sites WHERE site_id = 'SITE005'), 60.0, 25.0, 70.00, true, ARRAY['Grader', 'Excavator']),
((SELECT id FROM public.sites WHERE site_id = 'SITE006'), 25.0, 20.0, 60.00, true, ARRAY['Excavator', 'Crane']),
((SELECT id FROM public.sites WHERE site_id = 'SITE007'), 35.0, 30.0, 80.00, false, ARRAY['Crane', 'Loader']),
((SELECT id FROM public.sites WHERE site_id = 'SITE008'), 20.0, 15.0, 55.00, true, ARRAY['Bulldozer', 'Grader']);

-- Insert equipment utilization data for the last 30 days
INSERT INTO public.equipment_utilization (equipment_id, site_id, date, hours_used, hours_available, utilization_percentage, is_underutilized) VALUES
-- EQ001 - High utilization (not shareable)
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), '2024-08-15', 20.5, 24, 85.4, false),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), '2024-08-16', 19.0, 24, 79.2, false),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ001'), (SELECT id FROM public.sites WHERE site_id = 'SITE001'), '2024-08-17', 21.0, 24, 87.5, false),

-- EQ002 - Low utilization (shareable)
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), '2024-08-15', 6.0, 24, 25.0, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), '2024-08-16', 5.5, 24, 22.9, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), (SELECT id FROM public.sites WHERE site_id = 'SITE002'), '2024-08-17', 7.0, 24, 29.2, true),

-- EQ006 - Very low utilization (shareable)
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ006'), (SELECT id FROM public.sites WHERE site_id = 'SITE005'), '2024-08-15', 3.5, 24, 14.6, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ006'), (SELECT id FROM public.sites WHERE site_id = 'SITE005'), '2024-08-16', 4.0, 24, 16.7, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ006'), (SELECT id FROM public.sites WHERE site_id = 'SITE005'), '2024-08-17', 3.0, 24, 12.5, true),

-- EQ008 - Low utilization (shareable)
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ008'), (SELECT id FROM public.sites WHERE site_id = 'SITE006'), '2024-08-15', 5.0, 24, 20.8, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ008'), (SELECT id FROM public.sites WHERE site_id = 'SITE006'), '2024-08-16', 4.5, 24, 18.8, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ008'), (SELECT id FROM public.sites WHERE site_id = 'SITE006'), '2024-08-17', 6.0, 24, 25.0, true),

-- EQ009 - Medium utilization (shareable)
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE007'), '2024-08-15', 8.0, 24, 33.3, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE007'), '2024-08-16', 7.5, 24, 31.3, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ009'), (SELECT id FROM public.sites WHERE site_id = 'SITE007'), '2024-08-17', 9.0, 24, 37.5, true),

-- EQ010 - Very low utilization (shareable)
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE008'), '2024-08-15', 2.5, 24, 10.4, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE008'), '2024-08-16', 3.0, 24, 12.5, true),
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ010'), (SELECT id FROM public.sites WHERE site_id = 'SITE008'), '2024-08-17', 2.0, 24, 8.3, true);

-- Insert sample equipment sharing records
INSERT INTO public.equipment_sharing (equipment_id, owner_site_id, borrower_site_id, sharing_start_date, sharing_end_date, hourly_rate, total_hours, total_cost, status, distance_km, sharing_reason) VALUES
-- Active sharing between nearby sites
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ008'), 
 (SELECT id FROM public.sites WHERE site_id = 'SITE006'), 
 (SELECT id FROM public.sites WHERE site_id = 'SITE001'), 
 '2024-08-20 08:00:00', '2024-08-22 17:00:00', 60.00, 18.0, 1080.00, 'active', 8.5, 'Emergency foundation work'),
 
-- Completed sharing
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ002'), 
 (SELECT id FROM public.sites WHERE site_id = 'SITE002'), 
 (SELECT id FROM public.sites WHERE site_id = 'SITE007'), 
 '2024-08-10 09:00:00', '2024-08-12 17:00:00', 85.00, 16.0, 1360.00, 'completed', 15.2, 'Crane needed for airport project'),
 
-- Pending sharing request
((SELECT id FROM public.equipment WHERE equipment_id = 'EQ006'), 
 (SELECT id FROM public.sites WHERE site_id = 'SITE005'), 
 (SELECT id FROM public.sites WHERE site_id = 'SITE008'), 
 '2024-08-25 07:00:00', '2024-08-27 18:00:00', 70.00, 0, 0, 'pending', 12.8, 'Grading work for shopping center expansion');