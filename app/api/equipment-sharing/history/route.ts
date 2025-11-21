import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get sharing history where the site is either owner or borrower
    const { data, error } = await supabase
      .from('equipment_sharing')
      .select(`
        id,
        sharing_start_date,
        sharing_end_date,
        hourly_rate,
        total_hours,
        total_cost,
        status,
        distance_km,
        sharing_reason,
        equipment:equipment_id(equipment_id),
        owner_site:owner_site_id(site_id, name),
        borrower_site:borrower_site_id(site_id, name)
      `)
      .or(`owner_site_id.eq.${siteId},borrower_site_id.eq.${siteId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sharing history' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedData = data?.map(record => ({
      id: record.id,
      equipment_id: record.equipment?.equipment_id || '',
      owner_site_name: record.owner_site?.name || '',
      borrower_site_name: record.borrower_site?.name || '',
      sharing_start_date: record.sharing_start_date,
      sharing_end_date: record.sharing_end_date,
      hourly_rate: record.hourly_rate,
      total_hours: record.total_hours,
      total_cost: record.total_cost,
      status: record.status,
      distance_km: record.distance_km,
      sharing_reason: record.sharing_reason
    })) || [];

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
