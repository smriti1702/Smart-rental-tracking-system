import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      equipment_id,
      borrower_site_id,
      sharing_start_date,
      sharing_end_date,
      hourly_rate,
      sharing_reason
    } = body;

    // Validate required fields
    if (!equipment_id || !borrower_site_id || !sharing_start_date || !sharing_end_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get equipment details and owner site
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select(`
        id,
        equipment_id,
        is_shareable,
        utilization_rate,
        status,
        owner_site_id,
        owner_site:owner_site_id(id, site_id, name, latitude, longitude)
      `)
      .eq('equipment_id', equipment_id)
      .single();

    if (equipmentError || !equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Validate equipment is shareable
    if (!equipment.is_shareable) {
      return NextResponse.json(
        { error: 'Equipment is not available for sharing' },
        { status: 400 }
      );
    }

    // Validate equipment status
    if (equipment.status !== 'available') {
      return NextResponse.json(
        { error: 'Equipment is not currently available' },
        { status: 400 }
      );
    }

    // Validate utilization rate
    if (equipment.utilization_rate >= 50) {
      return NextResponse.json(
        { error: 'Equipment utilization is too high for sharing' },
        { status: 400 }
      );
    }

    // Get borrower site details
    const { data: borrowerSite, error: borrowerError } = await supabase
      .from('sites')
      .select('id, site_id, name, latitude, longitude')
      .eq('site_id', borrower_site_id)
      .single();

    if (borrowerError || !borrowerSite) {
      return NextResponse.json(
        { error: 'Borrower site not found' },
        { status: 404 }
      );
    }

    // Calculate distance between sites
    const distance = calculateDistance(
      equipment.owner_site.latitude,
      equipment.owner_site.longitude,
      borrowerSite.latitude,
      borrowerSite.longitude
    );

    // Get sharing preferences for owner site
    const { data: preferences, error: preferencesError } = await supabase
      .from('sharing_preferences')
      .select('max_sharing_distance_km, auto_approve_sharing')
      .eq('site_id', equipment.owner_site_id)
      .single();

    // Check distance limit
    const maxDistance = preferences?.max_sharing_distance_km || 50;
    if (distance > maxDistance) {
      return NextResponse.json(
        { error: `Distance (${distance.toFixed(1)}km) exceeds maximum allowed distance (${maxDistance}km)` },
        { status: 400 }
      );
    }

    // Calculate total hours and cost
    const startDate = new Date(sharing_start_date);
    const endDate = new Date(sharing_end_date);
    const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const totalCost = totalHours * hourly_rate;

    // Determine status based on auto-approve setting
    const status = preferences?.auto_approve_sharing ? 'active' : 'pending';

    // Create sharing record
    const { data: sharingRecord, error: sharingError } = await supabase
      .from('equipment_sharing')
      .insert({
        equipment_id: equipment.id,
        owner_site_id: equipment.owner_site_id,
        borrower_site_id: borrowerSite.id,
        sharing_start_date: sharing_start_date,
        sharing_end_date: sharing_end_date,
        hourly_rate: hourly_rate,
        total_hours: totalHours,
        total_cost: totalCost,
        status: status,
        distance_km: distance,
        sharing_reason: sharing_reason
      })
      .select()
      .single();

    if (sharingError) {
      console.error('Sharing creation error:', sharingError);
      return NextResponse.json(
        { error: 'Failed to create sharing request' },
        { status: 500 }
      );
    }

    // If auto-approved, update equipment status
    if (status === 'active') {
      await supabase
        .from('equipment')
        .update({ status: 'shared' })
        .eq('id', equipment.id);
    }

    return NextResponse.json({
      success: true,
      sharing_id: sharingRecord.id,
      status: status,
      message: status === 'active' ? 'Sharing request approved automatically' : 'Sharing request submitted for approval'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
