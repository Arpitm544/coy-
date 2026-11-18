import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe, SwipeAction } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action } = body;

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing profileId or action' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'pass') {
      return NextResponse.json(
        { success: false, error: 'Action must be "like" or "pass"' },
        { status: 400 }
      );
    }

    const result = recordSwipe(profileId, action as SwipeAction);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      match: result.match,
      matchedProfile: result.matchedProfile || null,
    });
  } catch (error) {
    console.error('Error in POST /api/swipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record swipe' },
      { status: 500 }
    );
  }
}
