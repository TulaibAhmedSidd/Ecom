import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function GET(request) {

    try {
        await connectDB();

        const products = await Product.find({});
        return NextResponseMethod(true, products, 'products found')

    } catch (error) {   
        console.log("error ->",error)
        return NextResponseMethod(false, {}, 'error->'+ error)
    }

}