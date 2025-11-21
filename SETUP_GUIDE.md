# Equipment Sharing Feature - Complete Setup Guide

## Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Installation Steps

### 1. Install Dependencies

```bash
npm install lucide-react
```

### 2. Database Setup

Run the database scripts in order:

```bash
# 1. Create tables and functions
psql -h your-supabase-host -U your-username -d your-database -f scripts/001_create_tables.sql

# 2. Seed data
psql -h your-supabase-host -U your-username -d your-database -f scripts/002_seed_data.sql

# 3. Test the setup (optional)
psql -h your-supabase-host -U your-username -d your-database -f scripts/003_test_equipment_sharing.sql
```

### 3. Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Start the Development Server

```bash
npm run dev
```

## Testing the Feature

### 1. Navigate to Equipment Sharing

1. Open your browser and go to `http://localhost:3000`
2. Click on the "Equipment Sharing" tab
3. You should see the three-tab interface: Nearby Equipment, Sharing History, New Request

### 2. Test Nearby Equipment Search

1. Select "Downtown Construction" as your site
2. Set max distance to 50km
3. You should see equipment like:
   - EQ002 (Crane) from Highway Project (25% utilization)
   - EQ006 (Grader) from Port Development (15% utilization)
   - EQ008 (Excavator) from Suburban Development (20% utilization)

### 3. Test Equipment Sharing Request

1. Click "Request Sharing" on any available equipment
2. Fill in the form:
   - Start Date: Tomorrow 8:00 AM
   - End Date: Tomorrow 5:00 PM
   - Hourly Rate: $75
   - Reason: "Test sharing request"
3. Click "Submit Request"
4. Check the "Sharing History" tab to see your request

### 4. Test API Endpoints

You can test the API endpoints directly:

```bash
# Test nearby equipment
curl "http://localhost:3000/api/equipment-sharing/nearby?lat=40.7128&lon=-74.0060&maxDistance=50"

# Test sharing history
curl "http://localhost:3000/api/equipment-sharing/history?siteId=SITE001"

# Test sharing request
curl -X POST "http://localhost:3000/api/equipment-sharing/request" \
  -H "Content-Type: application/json" \
  -d '{
    "equipment_id": "EQ002",
    "borrower_site_id": "SITE001",
    "sharing_start_date": "2024-08-25T08:00:00Z",
    "sharing_end_date": "2024-08-25T17:00:00Z",
    "hourly_rate": 75.00,
    "sharing_reason": "Test request"
  }'
```

## Troubleshooting

### Common Issues

1. **"Module not found: Can't resolve 'lucide-react'"**
   - Solution: Run `npm install lucide-react`

2. **Database connection errors**
   - Check your Supabase credentials in `.env.local`
   - Ensure your Supabase project is active

3. **No equipment showing up**
   - Check if the database scripts ran successfully
   - Verify that equipment has `is_shareable = true` and `utilization_rate < 50`

4. **Distance calculation not working**
   - Ensure sites have valid latitude/longitude coordinates
   - Check that the `calculate_distance_km` function was created

### Database Verification

Run these queries to verify your setup:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('equipment_sharing', 'equipment_utilization', 'sharing_preferences');

-- Check if functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('calculate_distance_km', 'find_nearby_shareable_equipment');

-- Check sample data
SELECT COUNT(*) as total_sites FROM sites WHERE latitude IS NOT NULL;
SELECT COUNT(*) as shareable_equipment FROM equipment WHERE is_shareable = true;
```

## Sample Data Overview

The system comes with:

- **8 Construction Sites** with GPS coordinates
- **10 Equipment Items** with varying utilization rates
- **5 Shareable Equipment** (utilization < 50%)
- **Sharing Preferences** for each site
- **Historical Utilization Data** for the last 30 days
- **Example Sharing Requests** (active, completed, pending)

### Site Locations

1. **Downtown Construction** (40.7128, -74.0060) - NYC
2. **Highway Project** (34.0522, -118.2437) - Los Angeles
3. **Bridge Construction** (41.8781, -87.6298) - Chicago
4. **Mining Operation** (39.7392, -104.9903) - Denver
5. **Port Development** (47.6062, -122.3321) - Seattle
6. **Suburban Development** (40.6782, -73.9442) - Brooklyn
7. **Airport Expansion** (40.6413, -73.7781) - Queens
8. **Shopping Center** (40.7589, -73.9851) - Manhattan

### Shareable Equipment

- **EQ002**: Crane (25% utilization) - Highway Project
- **EQ006**: Grader (15% utilization) - Port Development
- **EQ008**: Excavator (20% utilization) - Suburban Development
- **EQ009**: Crane (30% utilization) - Airport Expansion
- **EQ010**: Bulldozer (10% utilization) - Shopping Center

## Business Rules

1. **Sharing Eligibility**:
   - Equipment must be marked as shareable
   - Utilization rate must be below 50%
   - Equipment status must be "available"
   - Distance must be within site's maximum limit

2. **Distance Limits**:
   - Downtown Construction: 30km
   - Highway Project: 50km
   - Bridge Construction: 40km
   - Mining Operation: 100km
   - Port Development: 60km
   - Suburban Development: 25km
   - Airport Expansion: 35km
   - Shopping Center: 20km

3. **Auto-Approval Settings**:
   - Downtown Construction: Auto-approve enabled
   - Highway Project: Manual approval required
   - Bridge Construction: Auto-approve enabled
   - Mining Operation: Manual approval required
   - Port Development: Auto-approve enabled
   - Suburban Development: Auto-approve enabled
   - Airport Expansion: Manual approval required
   - Shopping Center: Auto-approve enabled

## Next Steps

Once the basic setup is working, you can:

1. **Customize the UI** - Modify the component styling
2. **Add more features** - Implement approval workflows, notifications
3. **Integrate with other systems** - Connect to payment processing, GPS tracking
4. **Scale the data** - Add more sites and equipment
5. **Add analytics** - Implement reporting and insights

## Support

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Check the terminal for build errors
3. Verify database connectivity
4. Ensure all dependencies are installed
5. Check that all SQL scripts ran successfully
