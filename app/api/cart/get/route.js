import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";


export async function GET(request) {
    try {

        const { userId } = getAuth(request);
        await connectDB();
        const user = await User.findById(userId);

        const { cartItems } =  user;

        return NextResponseMethod(true, cartItems, 'cart data sent')

    } catch (error) {
        return NextResponseMethod(false, {}, 'something went wrong' + error)

    }
}