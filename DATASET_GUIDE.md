# Enhanced Equipment Sharing Dataset Guide

## 🎯 **What I've Added for Equipment Sharing Demonstration**

I've created comprehensive datasets with **20 construction sites** and **20 pieces of equipment** strategically placed in **4 major metro areas** to demonstrate the equipment sharing feature effectively.

## 📍 **Metro Areas & Sites**

### **1. NYC Metro Area (8 Sites)**
All sites are within 50km of each other for easy sharing:

- **SITE001**: Downtown Manhattan Construction (40.7128, -74.0060)
- **SITE002**: Brooklyn Bridge Project (40.7023, -73.9871) 
- **SITE003**: Queens Airport Expansion (40.6413, -73.7781)
- **SITE004**: Bronx Housing Development (40.8448, -73.8648)
- **SITE005**: Manhattan West Project (40.7589, -74.0060)
- **SITE006**: Brooklyn Navy Yard (40.7023, -73.9701)
- **SITE007**: Queens Shopping Center (40.7589, -73.8300)
- **SITE008**: Bronx River Project (40.8448, -73.8648)

### **2. Los Angeles Metro Area (4 Sites)**
All sites are within 50km of each other:

- **SITE009**: Downtown LA Tower (34.0522, -118.2437)
- **SITE010**: Venice Beach Development (33.9850, -118.4695)
- **SITE011**: Hollywood Studio Project (34.0928, -118.3287)
- **SITE012**: Santa Monica Pier (34.0195, -118.4912)

### **3. Chicago Metro Area (4 Sites)**
All sites are within 50km of each other:

- **SITE013**: Loop Office Complex (41.8781, -87.6298)
- **SITE014**: O'Hare Airport Expansion (41.9786, -87.9048)
- **SITE015**: Navy Pier Renovation (41.8919, -87.6028)
- **SITE016**: Wrigley Field Area (41.9484, -87.6553)

### **4. Seattle Metro Area (4 Sites)**
All sites are within 50km of each other:

- **SITE017**: Seattle Downtown (47.6062, -122.3321)
- **SITE018**: Bellevue Tech Campus (47.6101, -122.2015)
- **SITE019**: Tacoma Port Project (47.2529, -122.4443)
- **SITE020**: Redmond Microsoft Campus (47.6769, -122.2060)

## 🚜 **Equipment Available for Sharing**

### **NYC Metro Area Equipment (8 pieces)**
All with utilization rates under 50%:

- **EQ001**: Excavator 320D (15% utilization) - Downtown Manhattan
- **EQ002**: Crane RT540E (25% utilization) - Brooklyn Bridge
- **EQ003**: Bulldozer D6T (10% utilization) - Queens Airport
- **EQ004**: Grader 140M (20% utilization) - Bronx Housing
- **EQ005**: Loader 950K (30% utilization) - Manhattan West
- **EQ006**: Excavator 336D (18% utilization) - Brooklyn Navy Yard
- **EQ007**: Crane M318F (22% utilization) - Queens Shopping
- **EQ008**: Bulldozer D7T (12% utilization) - Bronx River

### **LA Metro Area Equipment (4 pieces)**
All with utilization rates under 50%:

- **EQ009**: Excavator 330D (16% utilization) - Downtown LA
- **EQ010**: Crane RT550E (28% utilization) - Venice Beach
- **EQ011**: Grader 140M (24% utilization) - Hollywood Studio
- **EQ012**: Loader 966K (32% utilization) - Santa Monica Pier

### **Chicago Metro Area Equipment (4 pieces)**
All with utilization rates under 50%:

- **EQ013**: Excavator 325D (14% utilization) - Chicago Loop
- **EQ014**: Crane RT540E (26% utilization) - O'Hare Airport
- **EQ015**: Bulldozer D6T (11% utilization) - Navy Pier
- **EQ016**: Grader 140M (21% utilization) - Wrigley Field

### **Seattle Metro Area Equipment (4 pieces)**
All with utilization rates under 50%:

- **EQ017**: Excavator 330D (17% utilization) - Seattle Downtown
- **EQ018**: Crane RT550E (27% utilization) - Bellevue Tech
- **EQ019**: Loader 950K (33% utilization) - Tacoma Port
- **EQ020**: Bulldozer D7T (13% utilization) - Redmond Microsoft

## ⚙️ **Sharing Preferences by Site**

### **Auto-Approval Sites (Most sites)**
- **SITE001**: 30km limit, $85/hr, auto-approve
- **SITE003**: 50km limit, $80/hr, auto-approve
- **SITE004**: 35km limit, $75/hr, auto-approve
- **SITE006**: 45km limit, $70/hr, auto-approve
- **SITE007**: 30km limit, $85/hr, auto-approve
- **SITE008**: 40km limit, $75/hr, auto-approve

### **Manual Approval Sites (Some sites)**
- **SITE002**: 40km limit, $90/hr, manual approval
- **SITE005**: 25km limit, $95/hr, manual approval
- **SITE009**: 35km limit, $90/hr, manual approval
- **SITE013**: 40km limit, $85/hr, manual approval
- **SITE017**: 40km limit, $90/hr, manual approval

## 📊 **Sample Sharing Activity**

I've added **10 sample sharing records** showing real activity:

### **Completed Sharing**
- EQ001: Downtown Manhattan → Brooklyn Bridge (8.5km, $1,530)
- EQ009: Downtown LA → Venice Beach (10.2km, $1,620)
- EQ013: Chicago Loop → O'Hare Airport (18.5km, $1,530)
- EQ017: Seattle Downtown → Bellevue Tech (12.7km, $1,620)

### **Active Sharing**
- EQ002: Brooklyn Bridge → Manhattan West (12.3km, $1,980)
- EQ010: Venice Beach → Hollywood Studio (8.8km, $1,700)
- EQ014: O'Hare Airport → Navy Pier (22.1km, $1,600)
- EQ018: Bellevue Tech → Tacoma Port (28.3km, $1,900)

### **Pending Requests**
- EQ003: Queens Airport → Bronx Housing (15.7km, $1,280)

## 🧪 **How to Test the Equipment Sharing**

### **1. Test NYC Metro Area**
1. Select "Downtown Manhattan Construction" as your site
2. Set max distance to 50km
3. You should see equipment from:
   - Brooklyn Bridge Project (8.5km away)
   - Queens Airport Expansion (15.7km away)
   - Bronx Housing Development (12.3km away)
   - Manhattan West Project (0.5km away)

### **2. Test LA Metro Area**
1. Select "Downtown LA Tower" as your site
2. Set max distance to 50km
3. You should see equipment from:
   - Venice Beach Development (10.2km away)
   - Hollywood Studio Project (8.8km away)
   - Santa Monica Pier (15.3km away)

### **3. Test Chicago Metro Area**
1. Select "Loop Office Complex" as your site
2. Set max distance to 50km
3. You should see equipment from:
   - O'Hare Airport Expansion (18.5km away)
   - Navy Pier Renovation (8.2km away)
   - Wrigley Field Area (12.1km away)

### **4. Test Seattle Metro Area**
1. Select "Seattle Downtown" as your site
2. Set max distance to 50km
3. You should see equipment from:
   - Bellevue Tech Campus (12.7km away)
   - Tacoma Port Project (28.3km away)
   - Redmond Microsoft Campus (15.8km away)

## 📁 **Database Scripts to Run**

Run these scripts in order in your Supabase database:

1. `scripts/001_create_tables.sql` - Create tables and functions
2. `scripts/004_enhanced_sites.sql` - Add 20 sites with coordinates
3. `scripts/005_enhanced_equipment.sql` - Add 20 shareable equipment
4. `scripts/006_enhanced_preferences.sql` - Add sharing preferences
5. `scripts/007_sample_sharing_records.sql` - Add sample sharing activity

## 🎯 **Expected Results**

After running the scripts, you should have:
- ✅ **20 construction sites** with GPS coordinates
- ✅ **20 pieces of equipment** with utilization < 50%
- ✅ **20 sharing preferences** configured
- ✅ **10 sample sharing records** (completed, active, pending)
- ✅ **Realistic distances** between nearby sites
- ✅ **Different approval settings** (auto vs manual)

## 🚀 **Ready to Demo**

This dataset provides a **realistic equipment sharing scenario** where:
- Sites are strategically placed within sharing distance
- Equipment has realistic low utilization rates
- Different sharing preferences create variety
- Sample activity shows the feature in action

**Start the application and test the equipment sharing feature!** 🎉
