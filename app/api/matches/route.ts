import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/db';

export async function GET() {
  try {
    const matches = getMatches();
    return NextResponse.json({
      success: true,
      matches,
      count: matches.length,
    });
  } catch (error) {
    console.error('Error in GET /api/matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
