import { NextRequest, NextResponse } from "next/server";
import {db} from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("hi")
  const id = params.id;
  console.log(id)

  const lot = await db.parkinglot.findUnique({
    where: { 
      id:Number(id)
     },
  });

  if (!lot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(lot);
}
