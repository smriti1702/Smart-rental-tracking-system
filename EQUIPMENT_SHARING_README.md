# Equipment Sharing Feature - Airbnb for Construction Equipment

## Overview

The Equipment Sharing feature implements an Airbnb-style sharing system for construction equipment, allowing customers to share underutilized equipment with nearby construction sites. This feature optimizes equipment utilization, reduces costs, and promotes collaboration between construction companies.

## Key Features

### 1. **Smart Distance-Based Matching**
- Uses GPS coordinates to calculate distances between construction sites
- Only shows equipment within configurable distance limits (default: 50km)
- Implements Haversine formula for accurate distance calculations

### 2. **Utilization-Based Sharing**
- Equipment is only shareable when utilization rate is below 50%
- Real-time utilization tracking and monitoring
- Automatic status updates based on usage patterns

### 3. **Flexible Sharing Preferences**
- Configurable maximum sharing distance per site
- Equipment type restrictions
- Auto-approval settings
- Preferred hourly rates

### 4. **Comprehensive Request Management**
- Request submission with validation
- Approval workflow (manual or automatic)
- Cost calculation and tracking
- Sharing history and analytics

## Database Schema

### New Tables

#### 1. **equipment_sharing**
```sql
CREATE TABLE equipment_sharing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  owner_site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  borrower_site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
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
```

#### 2. **equipment_utilization**
```sql
CREATE TABLE equipment_utilization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  hours_used DECIMAL DEFAULT 0,
  hours_available DECIMAL DEFAULT 24,
  utilization_percentage DECIMAL DEFAULT 0,
  is_underutilized BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. **sharing_preferences**
```sql
CREATE TABLE sharing_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  max_sharing_distance_km DECIMAL DEFAULT 50,
  min_utilization_threshold DECIMAL DEFAULT 30,
  preferred_hourly_rate DECIMAL,
  auto_approve_sharing BOOLEAN DEFAULT false,
  equipment_types_shareable TEXT[], -- Array of equipment types
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Modified Tables

#### **sites** (Added coordinates)
```sql
ALTER TABLE sites ADD COLUMN latitude DECIMAL;
ALTER TABLE sites ADD COLUMN longitude DECIMAL;
```

#### **equipment** (Added sharing fields)
```sql
ALTER TABLE equipment ADD COLUMN utilization_rate DECIMAL DEFAULT 0;
ALTER TABLE equipment ADD COLUMN is_shareable BOOLEAN DEFAULT false;
ALTER TABLE equipment ADD COLUMN owner_site_id UUID REFERENCES sites(id);
```

## Database Functions

### 1. **calculate_distance_km**
Calculates distance between two GPS coordinates using Haversine formula.

### 2. **find_nearby_shareable_equipment**
Finds equipment available for sharing within specified distance and criteria.

## API Endpoints

### 1. **GET /api/equipment-sharing/nearby**
Finds nearby shareable equipment.

**Parameters:**
- `lat`: Latitude of requesting site
- `lon`: Longitude of requesting site
- `maxDistance`: Maximum distance in km (default: 50)
- `equipmentType`: Filter by equipment type (optional)

**Response:**
```json
[
  {
    "equipment_id": "EQ002",
    "equipment_type": "Crane",
    "model": "RT540E",
    "manufacturer": "Grove",
    "owner_site_name": "Highway Project",
    "distance_km": 15.2,
    "utilization_rate": 25.0,
    "hourly_rate": 85.00,
    "condition": "good",
    "fuel_level": 90
  }
]
```

### 2. **GET /api/equipment-sharing/history**
Retrieves sharing history for a site.

**Parameters:**
- `siteId`: Site ID to get history for

**Response:**
```json
[
  {
    "id": "uuid",
    "equipment_id": "EQ008",
    "owner_site_name": "Suburban Development",
    "borrower_site_name": "Downtown Construction",
    "sharing_start_date": "2024-08-20T08:00:00Z",
    "sharing_end_date": "2024-08-22T17:00:00Z",
    "hourly_rate": 60.00,
    "total_hours": 18.0,
    "total_cost": 1080.00,
    "status": "active",
    "distance_km": 8.5,
    "sharing_reason": "Emergency foundation work"
  }
]
```

### 3. **POST /api/equipment-sharing/request**
Creates a new sharing request.

**Request Body:**
```json
{
  "equipment_id": "EQ002",
  "borrower_site_id": "SITE001",
  "sharing_start_date": "2024-08-25T08:00:00Z",
  "sharing_end_date": "2024-08-27T17:00:00Z",
  "hourly_rate": 75.00,
  "sharing_reason": "Bridge construction project"
}
```

**Response:**
```json
{
  "success": true,
  "sharing_id": "uuid",
  "status": "pending",
  "message": "Sharing request submitted for approval"
}
```

## Frontend Components

### EquipmentSharing Component
Located at `components/equipment-sharing.tsx`

**Features:**
- Three-tab interface: Nearby Equipment, Sharing History, New Request
- Real-time filtering by distance and equipment type
- Interactive equipment cards with sharing details
- Request form with validation
- Status tracking and history display

## Usage Instructions

### 1. **Setting Up Equipment for Sharing**
1. Mark equipment as shareable in the database
2. Set utilization rate below 50%
3. Configure sharing preferences for the site

### 2. **Finding Nearby Equipment**
1. Navigate to "Equipment Sharing" tab
2. Select your site location
3. Set maximum distance preference
4. Filter by equipment type if needed
5. Browse available equipment

### 3. **Requesting Equipment**
1. Click "Request Sharing" on desired equipment
2. Fill in sharing details (dates, rate, reason)
3. Submit request
4. Wait for approval (automatic or manual)

### 4. **Managing Sharing Preferences**
- Set maximum sharing distance
- Configure auto-approval settings
- Specify shareable equipment types
- Set preferred hourly rates

## Business Rules

### 1. **Sharing Eligibility**
- Equipment must be marked as shareable
- Utilization rate must be below 50%
- Equipment status must be "available"
- Distance must be within site's maximum limit

### 2. **Distance Calculation**
- Uses Haversine formula for accurate GPS distance
- Configurable per site (default: 50km)
- Real-time calculation during request validation

### 3. **Cost Calculation**
- Hourly rate × total hours = total cost
- Automatic calculation based on start/end dates
- Tracking of actual vs. planned costs

### 4. **Status Management**
- **pending**: Awaiting owner approval
- **active**: Sharing in progress
- **completed**: Sharing finished
- **cancelled**: Request cancelled

## Sample Data

The system includes sample data with:
- 8 construction sites with GPS coordinates
- 10 pieces of equipment with varying utilization rates
- 5 shareable equipment items
- Sample sharing preferences for each site
- Historical utilization data
- Example sharing requests

## Benefits

### For Equipment Owners
- Generate additional revenue from underutilized equipment
- Optimize equipment utilization rates
- Build relationships with nearby construction companies
- Reduce idle time costs

### For Equipment Borrowers
- Access equipment without long-term commitments
- Reduce capital expenditure
- Faster project completion
- Cost-effective equipment access

### For the Industry
- Improved resource utilization
- Reduced environmental impact
- Enhanced collaboration
- Cost optimization across projects

## Future Enhancements

1. **Real-time GPS Tracking**: Live equipment location updates
2. **Insurance Integration**: Automatic insurance coverage for shared equipment
3. **Payment Processing**: Integrated payment system for sharing fees
4. **Rating System**: User reviews and ratings for equipment and sites
5. **Predictive Analytics**: AI-powered utilization forecasting
6. **Mobile App**: Native mobile application for on-site access

## Technical Notes

- Built with Next.js 14 and TypeScript
- Uses Supabase for database and real-time features
- Implements responsive design with Tailwind CSS
- Follows RESTful API design principles
- Includes comprehensive error handling and validation
