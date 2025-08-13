import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";  // confirm this import is correct
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json([], { status: 401 });  // Unauthorized or empty array
  }

  const favoriteLots = await db.parkinglot.findMany({
    where: {
      favorites: {
        some: {
          id: Number(userId),
        },
      },
    },
  });   

  return NextResponse.json(favoriteLots);
}
