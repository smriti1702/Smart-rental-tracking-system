-- Enhanced Sharing Preferences Dataset
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
