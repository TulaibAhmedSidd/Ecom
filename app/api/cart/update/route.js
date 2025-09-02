import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";


export async function POST(request) {
    try {

        await connectDB();

        const { userId } = getAuth(request);
        const { cartData } = await request.json();

        const user = await User.findById(userId);
        user.cartItems = cartData;

        user.save() 

        return NextResponseMethod(true, user.cartItems, 'cart updated')

    } catch (error) {
        return NextResponseMethod(false, {}, 'something went wrong' + error)

    }
}