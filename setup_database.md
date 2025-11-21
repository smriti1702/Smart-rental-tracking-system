# Database Setup Guide

## 🚨 **IMPORTANT: Run Database Scripts First**

The application is currently showing errors because the database tables and functions haven't been created yet. Follow these steps to set up the database:

## 📋 **Step-by-Step Database Setup**

### **1. Run the Database Scripts in Order**

Go to your Supabase dashboard and run these SQL scripts in the **SQL Editor** in this exact order:

#### **Step 1: Create Tables and Functions**
```sql
-- Copy and paste the entire content of scripts/001_create_tables.sql
```

#### **Step 2: Add Enhanced Sites**
```sql
-- Copy and paste the entire content of scripts/004_enhanced_sites.sql
```

#### **Step 3: Add Enhanced Equipment**
```sql
-- Copy and paste the entire content of scripts/005_enhanced_equipment.sql
```

#### **Step 4: Add Sharing Preferences**
```sql
-- Copy and paste the entire content of scripts/006_enhanced_preferences.sql
```

#### **Step 5: Add Sample Sharing Records**
```sql
-- Copy and paste the entire content of scripts/007_sample_sharing_records.sql
```

## 🔍 **Verify Setup**

After running all scripts, you should see:
- ✅ **20 construction sites** with GPS coordinates
- ✅ **20 pieces of equipment** with utilization < 50%
- ✅ **20 sharing preferences** configured
- ✅ **10 sample sharing records** (completed, active, pending)

## 🧪 **Test the Application**

Once the database is set up:

1. **Refresh your browser** at `http://localhost:3000`
2. **Click "Equipment Sharing" tab**
3. **Select a site** (e.g., "Downtown Manhattan Construction")
4. **Set max distance** to 50km
5. **You should see nearby equipment** available for sharing

## 🎯 **Expected Results**

After setup, you should see:
- **NYC Metro Area**: Equipment from Brooklyn Bridge, Queens Airport, etc.
- **LA Metro Area**: Equipment from Venice Beach, Hollywood Studio, etc.
- **Chicago Metro Area**: Equipment from O'Hare Airport, Navy Pier, etc.
- **Seattle Metro Area**: Equipment from Bellevue Tech, Tacoma Port, etc.

## 🚀 **Ready to Demo**

Once the database is properly set up, the equipment sharing feature will work perfectly with:
- ✅ Realistic nearby locations
- ✅ Underutilized equipment
- ✅ Distance calculations
- ✅ Sharing preferences
- ✅ Sample activity data

**Run the database scripts first, then test the application!** 🎉
