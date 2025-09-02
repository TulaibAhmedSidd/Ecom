import { NextResponseMethod } from "@/common/commonFunc";
import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {

    try {

        const { userId } = getAuth(request);
        const { address } = await request.json();
        console.log("req request",request)
        console.log("req address",address)
        await connectDB();

        const newAddress = await Address.create({ ...address, userId });

        return NextResponseMethod(true, newAddress, 'Address added success')

    } catch (error) {
        console.log("err", error)
        return NextResponseMethod(false, {}, 'Address  not success' + error)

    }
}