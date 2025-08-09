import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    const session = await getServerSession(authOptions)
    const merchant = session?.user?.merchantId;
    console.log("Merchant info",merchant)

    if(!merchant){
        return NextResponse.json({status:false, message:"Merchant is not logged in "})
    }

    const{name,price,adress,longitude,latitude,totalslots}=  await req.json()
    const parkingslot = await db.parkinglot.create({
        data:{
            Name:name,
            merchantid:     Number(merchant),
            totalslots:     Number(totalslots),
            longitude:      longitude,
            latitude:       latitude,
            price:          String  (price),
            Adress:         adress,
            vacantslots:    Number(totalslots)
        }
    })

    return NextResponse.json({status:true,parkingslot,message:"Created parking lot succesfully"})

}