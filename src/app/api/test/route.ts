import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";

export async function GET() {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    await connectDB();
    return NextResponse.json({ message: "DB Connected Successfully" });
}