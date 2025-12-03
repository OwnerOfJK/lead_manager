import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { observeOpenAI } from "@langfuse/openai";
 

//Here we would practically use the Hubspot API to get the call recording
async function getTranscription(callId: string): Promise<string> {
  // Add globalThis.File for Node environments
  if (typeof globalThis.File === "undefined") {
    const { File } = await import("node:buffer");
    // @ts-expect-error: global This is not typed in Node.js
    globalThis.File = File;
  }

  const openai = observeOpenAI(new OpenAI());
  //const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Use fetch instead of fs.readFileSync
  const res = await fetch("https://lead-manager-woad.vercel.app/testcall.m4a");
  if (!res.ok) throw new Error("Failed to download audio file");

  const arrayBuffer = await res.arrayBuffer();
  const file = new globalThis.File([arrayBuffer], "testcall.m4a", { type: "audio/m4a" });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return transcription.text;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log("POST /api/call called");
  const { callId } = await req.json();

  if (!callId) {
    return NextResponse.json({ error: "Invalid Call ID" }, { status: 400 });
  }
  try {
    const transcription = await getTranscription(callId);
    return NextResponse.json(transcription);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to transcribe" }, { status: 500 });
  }
}

