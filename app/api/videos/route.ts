import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    try {
        const videos  = await prisma.video.findMany({
            orderBy:{createdAt:"desc"}
        })

        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({error:"Erro Fetching Videos"} , {status:500})
    }finally{
        // this we should we use when we initiate the client from Prisma Client
        await prisma.$disconnect()
    }
}

