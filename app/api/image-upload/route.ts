import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest , NextResponse } from 'next/server';



interface CloudinaryUploadResult{
    public_id: string;
    [key:string]:any
}


export  async function POST(request:NextRequest) {
    const {userId} = auth()
    if(!userId){
        return NextResponse.json({error:"Unauthorized"} , {status:401})
    }

    try {
        const formData = await request.formData() 
        const file = formData.get('file') as File | null

        if(!file){
            return NextResponse.json({error:"No file provided"}, {status:400})
        }

        const bytes  = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result  = await new Promise<CloudinaryUploadResult>((resolve , reject)=>{
            const uploadStream  = cloudinary.uploader.upload_stream({folder:"image-uploads"},(error , result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result as CloudinaryUploadResult)
                }
            })

            uploadStream.end(buffer)
        })

        return NextResponse.json({publicId:result.public_id } , {status:201})


    } catch (error) {
        console.log("Image Upload Failed ");
        return NextResponse.json({error:"upload Image Failed"} , {status:500})
        
    }
}




