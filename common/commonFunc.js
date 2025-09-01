import { NextResponse } from "next/server";

export const NextResponseMethod = (bool = false, body = {}, message = '') => NextResponse.json({ success: bool, body, message: message })
