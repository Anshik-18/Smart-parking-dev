import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

function formatTotalTime(ms: number) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
export async function POST(req:Request){
    const session = await getServerSession(authOptions)
    const userid = session?.user?.id
    if(!userid){
        return new Response('Unauthorized', { status: 401 })
    }
    const { bookingId } = await req.json()
        const parking = await db.parkings.findUnique({
        where: {
            id: bookingId,
            userid: Number(userid),
        },
        select: {
            starttime: true,
        },
        });

        if (!parking) {
        return new Response('Booking not found', { status: 404 });
        }
    try{
        const totalTimeMs = new Date().getTime() - new Date(parking.starttime).getTime();
        const totalTimeStr = formatTotalTime(totalTimeMs);

        const response = await db.parkings.update({
           select:{
                id:true,
                status:true,
                parkingslot:true
              },
              where:{
                id:bookingId,
                userid:Number(userid)
           },
           data:{
               endtime: new Date(),
               status: "Completed",
               totaltime: totalTimeStr
           }
        })
        const parkinglotid = response.parkingslot.id;
                let bool = true;
                if(!response.parkingslot.isempty){
        
                }
                const updateparkinglot = await db.parkinglot.update({
                    where:{
                        id:parkinglotid
                    },
                    data:{
                          vacantslots:{
                        increment:1
                    },
                    occupiedslots:{
                        decrement:1
                    },
                    isempty:{
                        set:true
                    }
                    
                    }
                })
        if(response.status ==="Completed"){
            return new Response(JSON.stringify({ message: 'Booking checked out successfully' }), { status: 200 })
        }
        else{
            return new Response('Booking not found', { status: 404 })
        }
    }
    catch(error){
        return new Response('Error', { status: 500 })
    }
}