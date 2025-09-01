import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

// Configure cloudinary 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY
});

export async function POST(request) {

    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponseMethod(false, {}, 'You are not seller')
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const price = formData.get("price");
        const offerPrice = formData.get("offerPrice");

        const files = formData.getAll('images')

        if (!files || files?.length == 0) {
            return NextResponseMethod(false, {}, 'No files provided')
        }

        const result = await Promise.all(
            files?.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((res, rej) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (err, res) => {
                            if (err) {
                                rej(err)
                            } else {
                                res(res)
                            }
                        }
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = result?.map(res => res.secure_url);

        await connectDB();

        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),
            offerPrice: Number(offerPriceNumber),
            image,
            date: Date.now()
        })

        NextResponseMethod(true, newProduct, 'Upload succesfully')

    } catch (error) {
        console.log("err", error)
        return NextResponseMethod(false, {}, 'Something is wrong ->' + error)
    }
}