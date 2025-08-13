import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

async function getBookingHistory(userid:any) {
    const data = await db.parkings.findMany({
        where:{
            userid:Number(userid)
        },
        include:{
            parkingslot: true  
        },
        orderBy: {
            starttime: 'desc'
        }
    })
    return data

}
export  async function GET(){
    const server = await getServerSession(authOptions)
    const userid  = server?.user?.id
    if (!userid) {
        return new Response('Unauthorized', { status: 401 })
    }

    const history = await getBookingHistory(userid)
    return new Response(JSON.stringify(history), { status: 200 })
}