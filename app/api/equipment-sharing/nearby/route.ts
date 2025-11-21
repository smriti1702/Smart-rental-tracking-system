import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const maxDistance = searchParams.get('maxDistance') || '50';
    const equipmentType = searchParams.get('equipmentType') || '';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Use the database function to find nearby equipment
    const { data, error } = await supabase.rpc('find_nearby_shareable_equipment', {
      site_lat: parseFloat(lat),
      site_lon: parseFloat(lon),
      max_distance_km: parseFloat(maxDistance),
      equipment_type: equipmentType || null
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch nearby equipment' },
        { status: 500 }
      );
    }

    // Get additional equipment details
    const equipmentIds = data?.map(item => item.equipment_id) || [];
    
    if (equipmentIds.length > 0) {
      const { data: equipmentDetails, error: detailsError } = await supabase
        .from('equipment')
        .select('equipment_id, condition, fuel_level')
        .in('equipment_id', equipmentIds);

      if (!detailsError && equipmentDetails) {
        // Merge the data
        const enrichedData = data?.map(item => {
          const details = equipmentDetails.find(d => d.equipment_id === item.equipment_id);
          return {
            ...item,
            condition: details?.condition || 'unknown',
            fuel_level: details?.fuel_level || 0
          };
        });

        return NextResponse.json(enrichedData);
      }
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
