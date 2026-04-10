import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Submission from "../../../models/Submission";
import { openai } from "../../../lib/openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        await connectDB();

        const prompt = `
You are a business strategist.

Generate a structured onboarding brief in valid JSON only.

Client Details:
Name: ${body.name}
Business Type: ${body.businessType}
Goals: ${body.goals}
Budget: ${body.budget}
Location: ${body.location}

Return ONLY this JSON object:
{
  "business_summary": "string",
  "goals": ["string"],
  "recommended_strategy": ["string"],
  "budget_insight": "string",
  "next_steps": ["string"]
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful business assistant. Return raw valid JSON only. Do not use markdown fences.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
        });

        const raw = completion.choices[0]?.message?.content ?? "";
        console.log("RAW AI RESPONSE:", raw);

        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        const submission = await Submission.create({
            ...body,
            aiBrief: parsed,
        });

        return NextResponse.json(submission, { status: 201 });
    } catch (error: any) {
        console.error("INTAKE API ERROR:", error);

        return NextResponse.json(
            {
                error: "Something went wrong",
                details: error?.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}