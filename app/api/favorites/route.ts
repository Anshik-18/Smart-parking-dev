import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'; // your NextAuth config
import { db } from '@/lib/db';
// your Prisma client instance

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lotId } = await request.json();
    if (!lotId) {
      return NextResponse.json({ error: 'lotId is required' }, { status: 400 });
    }

    // Add the parkinglot to user favorites (connect relation)
    await db.user.update({
      where: { id: Number(session.user.id) },
      data: {
        favorites: {
          connect: { id: Number(lotId) },
        },
      },
    });

    // Return updated favorites list
    const updatedUser = await db.user.findUnique({
      where: { id: Number(session.user.id) },
      include: { favorites: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
      favorites: updatedUser?.favorites ?? [],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add to favorites' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lotId } = await request.json();
    if (!lotId) {
      return NextResponse.json({ error: 'lotId is required' }, { status: 400 });
    }

    // Remove the parkinglot from user favorites (disconnect relation)
    await db.user.update({
      where: { id: Number(session.user.id) },
      data: {
        favorites: {
          disconnect: { id: Number(lotId) },
        },
      },
    });

    // Return updated favorites list
    const updatedUser = await db.user.findUnique({
      where: { id: Number(session.user.id) },
      include: { favorites: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
      favorites: updatedUser?.favorites ?? [],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to remove from favorites' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userWithFavorites = await db.user.findUnique({
      where: { id: Number(session.user.id) },
      include: { favorites: true },
    });

    return NextResponse.json({
      favorites: userWithFavorites?.favorites ?? [],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 });
  }
}
