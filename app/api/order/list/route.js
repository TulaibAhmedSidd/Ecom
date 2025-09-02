import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import Address from "@/models/address";
import Order from "@/models/Order";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {

    try {

        await connectDB();

        const { userId } = getAuth(request);

        Address?.length
        Product?.length

        const Orders = await Order.find({userId}).populate('address items.product');

        return NextResponseMethod(true, Orders, 'Orders found')

    } catch (error) {   
        console.log("error ->",error)
        return NextResponseMethod(false, {}, 'error->'+ error)
    }

}