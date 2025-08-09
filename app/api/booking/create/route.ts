import {db} from "@/lib/db";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";


export async function POST(req:Request){
    console.log("Hi reached here")
    const{parking_lot_id,carnumber} = await req.json();
    console.log("parkingslot",parking_lot_id)
    const session  = await getServerSession(authOptions)
    const userid = session?.user?.id
    console.log("userid",userid)

    const parking_slot = await db.parkinglot.findFirst({
        where:{
            id:Number(parking_lot_id)
        }
    })
    if(!parking_slot){
        return NextResponse.json({success:false, message:"Can not find the parking lot"})
    }

    if ( parking_slot.vacantslots <= 0 && parking_slot.isempty){
        await db.parkinglot.update({
            where:{
                id:Number(parking_lot_id)
            },
            data:{
                isempty:{
                    set:false
                }
            }
        })
        return NextResponse.json({success:false, message:"The parking lot is already FUll"})

    }


    // if (!parking_slot?.isempty || parking_slot.vacantslots <= 0) {
    //     return NextResponse.json({ success: false, message: "The parking lot is already full" });
    // }


    
    const booking = await db.parkings.create({
        data:{
            userid:             Number(userid),
            parkingslotid:      Number(parking_lot_id),
            status:             "Pre_booked",
            carnumber:          carnumber
        }
    })
 
    let bool = true
    if(parking_slot.vacantslots==1){
        
         bool = false
    }
    const parking = await db.parkinglot.update({
        where:{
            id:Number(parking_lot_id)
        },
        data:{
            vacantslots:{
                decrement:1
            },
            occupiedslots:{
                increment:1
            },
            isempty:{
                set:bool
            }
            
        }
    })
    return NextResponse.json({success:true, booking})

}