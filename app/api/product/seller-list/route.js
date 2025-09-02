import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {

    try {
        const { userId } = await getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponseMethod(false, {}, 'Not authorized')
        }
        await connectDB();
        const products = await Product.find({});
        return NextResponseMethod(true, products, 'products found')

    } catch (error) {   
        console.log("error ->",error)
        return NextResponseMethod(false, {}, 'error->'+ error)
    }

}