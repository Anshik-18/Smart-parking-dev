


import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ParkingLot {
  id: number;
  name: string;
  Adress: string;
  price: number;
  vacantslots: number;
  latitude: number;
  longitude: number;
}

export async function GET(req: NextRequest) {
  console.log("Received request for nearby parking"); 
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const rawResults = await db.$queryRaw<ParkingLot[]>`
      SELECT * FROM parkinglot
      WHERE earth_box(ll_to_earth(${lat}, ${lng}), ${30000}) 
        @> ll_to_earth(parkinglot.latitude, parkinglot.longitude)
    `;


    if (rawResults.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    console.log("Raw parking results:", rawResults); 

    const origin = `${lat},${lng}`;
    const destinations = rawResults
      .map((lot) => `${lot.latitude},${lot.longitude}`)
      .join("|");

    const distanceRes = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const distanceData = await distanceRes.json();
    console.log("Distance Matrix Response:", distanceData);

    if (
      !distanceData.rows ||
      !distanceData.rows[0] ||
      !distanceData.rows[0].elements
    ) {
      console.error("Unexpected distance matrix response:", distanceData);
      return NextResponse.json(
        rawResults.map((lot) => ({
          ...lot,
          lat: lot.latitude,
          lng: lot.longitude,
          distance: "N/A",
          duration: "N/A",
        })),
        { status: 200 }
      );
    }

    const enrichedResults = rawResults.map((lot: ParkingLot, index) => ({
      ...lot,
      lat: lot.latitude,
      lng: lot.longitude,
      distance: distanceData.rows[0].elements[index]?.distance?.text || "N/A",
      duration: distanceData.rows[0].elements[index]?.duration?.text || "N/A",
    }));

    return NextResponse.json(enrichedResults);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
