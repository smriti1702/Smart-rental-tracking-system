-- Sample Equipment Sharing Records
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
