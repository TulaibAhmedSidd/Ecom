import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
// import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {

        const { userId } = await getAuth(request); 
        console.log("userId from Auth xx",userId)
        await connectDB();
        console.log("userId from Auth xx",userId)

        const user = await User.findById(userId);
        if (!user) {
            // return NextResponse.json({ success: false, message: 'user not found' })
            return NextResponseMethod(false, {}, 'user not found')
        }
        // return NextResponse.json({ success: true, user })
        return NextResponseMethod(true, user, 'user found')

    } catch (error) {
        console.log("err",error)
        // return NextResponse.json({ success: false, message: 'user not found ->'+error })
        return NextResponseMethod(false, {}, 'user not found')

    }
}