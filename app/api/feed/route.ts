import { NextResponse } from 'next/server';
import { getFeedProfiles } from '@/lib/db';

export async function GET() {
  try {
    const profiles = getFeedProfiles();
    return NextResponse.json({
      success: true,
      profiles,
      totalRemaining: profiles.length,
    });
  } catch (error) {
    console.error('Error in GET /api/feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
