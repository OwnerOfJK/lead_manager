import fs from "fs";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

async function getTranscription(callId: string): Promise<string> {
    if (typeof globalThis.File === "undefined") {
        const { File } = await import("node:buffer");
        // @ts-expect-error: globalThis is not typed in Node.js
        globalThis.File = File;
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const buffer = fs.readFileSync("./src/app/files/testcall.m4a");
    const file = new globalThis.File([buffer], "testcall.m4a", { type: "audio/m4a" });

    const transcription = await openai.audio.transcriptions.create({
        file,
        model: "gpt-4o-transcribe",
    });
    return transcription.text;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("GET /api/call called");
  const { callId } = await req.json();

  if (!callId) {
    return NextResponse.json({ error: "Invalid Path" }, { status: 400 });
  }
  try {
    const transcription = await getTranscription(callId);
    return NextResponse.json(transcription);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to transcribe" }, { status: 500 });
  }
}

