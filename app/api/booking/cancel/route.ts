import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req:Request){
    const session = await getServerSession(authOptions)
    const userid = session?.user?.id
    if(!userid){
        return new Response('Unauthorized', { status: 401 })
    }
    const { bookingId } = await req.json()
    try{
        const response = await db.parkings.update({
           select:{
                id:true,
                status:true,
              },
              where:{
                id:bookingId,
                userid:Number(userid)
           },
           data:{
               status: 'Cancelled'
           }
        })
        if(response.status ==="Cancelled"){
            return new Response(JSON.stringify({ message: 'Booking cancelled successfully' }), { status: 200 })
        }
        else{
            return new Response('Booking not found', { status: 404 })
        }
    }
    catch(error){
        return new Response('Error', { status: 500 })
    }
}