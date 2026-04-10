import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Submission from "../../../models/Submission";

export async function GET() {
    try {
        await connectDB();
        const submissions = await Submission.find().sort({ createdAt: -1 });
        return NextResponse.json(submissions);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch submissions", details: error.message },
            { status: 500 }
        );
    }
}