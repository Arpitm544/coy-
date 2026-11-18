import { NextResponse } from 'next/server';
import { resetDb } from '@/lib/db';

export async function POST() {
  try {
    resetDb();
    return NextResponse.json({
      success: true,
      message: 'Database reset to initial state successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/reset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
