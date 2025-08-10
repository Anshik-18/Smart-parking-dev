// src/app/api/auth/guest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path to your auth config

export async function POST(request: NextRequest) {
  try {
    const { userId, merchantId } = await request.json();
    
    // Create a mock session for guest user
    const guestSession = {
      user: {
        id: userId,
        email: 'guest@example.com',
        merchantId: merchantId,
        userType: 'guest'
      }
    };
    
    // You might want to store this in a database or session store
    // For now, we'll return success and let the frontend handle it
    
    return NextResponse.json({ success: true, session: guestSession });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create guest session' },
      { status: 500 }
    );
  }
}