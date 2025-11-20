import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { context, message } = await req.json();

  const prompt = [
    `Name: ${context.hubspotProfile?.firstname} ${context.hubspotProfile?.lastname}`,
    `Email: ${context.hubspotProfile?.email}`,
    `Phone: ${context.hubspotProfile?.phone ?? 'N/A'}`,
    `Status: ${context.hubspotProfile?.lead_status ?? 'N/A'}`,
    `LinkedIn URL: ${context.hubspotProfile?.linkedin_url ?? 'N/A'}`,
    context.linkedinProfile ? `LinkedIn Headline: ${context.linkedinProfile.headline}` : '',
    context.linkedinProfile ? `Location: ${context.linkedinProfile.location}` : '',
    context.transcription ? `Call Transcript: ${context.transcription}` : '',
  ].filter(Boolean).join('\n');

  const chatMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: 'You are a sales manager at a company called factorial. Factorial is an all-in-one business management \
       software that tracks time and attendance, develops talent, controls finance, and streamlines payroll. \
       A single platform that lets you focus on your people, not paperwork. Use the context to answer questions and keep your response concise and brief.' },
    { role: 'user', content: prompt },
    { role: 'user', content: message },
  ];

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      stream: true,
    });

    // Create a ReadableStream to forward OpenAI chunks to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}