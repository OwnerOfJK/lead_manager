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
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}