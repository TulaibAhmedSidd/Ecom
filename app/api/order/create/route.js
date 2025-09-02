import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request) {

    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items?.length == 0) {
            return NextResponseMethod(false, {}, 'Invalid Data')
        }
        //calculate amount using items

        const amount = await items?.reduce(async (acc, item) => {
            const product = await Product.findById(item?.product);
            return acc + product?.offerPrice * item?.quantity
        }, 0)

        await inngest.send({
            name:'order/created',
            data:{
                userId,
                address,
                items,
                amount: amount * Math.floor(amount * 0.02),
                date: Date.now()
            }
        })

        // clearing user cart data
        
        const user = await User.findById(userId);

        user.cartItem = {};
        await user?.save()

        return NextResponseMethod(true, {}, 'order placed succesfully')

    } catch (error) {
        console.log("err", error)
        return NextResponseMethod(false, {}, 'Something is wrong ->' + error)
    }
}