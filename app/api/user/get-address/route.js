import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {

    try {

        const { userId } = getAuth(request);
        await connectDB();

        const address = await Address.find({ userId });

        return NextResponseMethod(true, address, 'Address found success')

    } catch (error) {
        console.log("err", error)
        return NextResponseMethod(false, {}, 'Address not success->' + error)

    }
}