import { NextResponse } from "next/server";
import { features, openaiModel } from "@/lib/config";
import { buildContext, mockChatAnswer } from "@/lib/ai";

export const runtime = "nodejs";

const SYSTEM = `You are MarginMind's AI Profit Agent, an expert e-commerce financial analyst for cross-border sellers.
Answer using ONLY the business context provided. Be concise and decisive.
Use short markdown bullet points, bold key SKUs and dollar figures, and always end with a clear recommended action.
Never invent numbers that contradict the context.`;

export async function POST(req: Request) {
  let question = "";
  try {
    const body = await req.json();
    question = (body?.question ?? "").toString().slice(0, 1000);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!question.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  if (features.openai) {
    try {
      const OpenAI = (await import("openai")).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await client.chat.completions.create({
        model: openaiModel,
        temperature: 0.4,
        max_tokens: 600,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "system", content: `Business context:\n${buildContext()}` },
          { role: "user", content: question },
        ],
      });
      const answer = completion.choices[0]?.message?.content?.trim();
      if (answer) return NextResponse.json({ answer, source: "openai" });
    } catch (err) {
      // Fall through to the deterministic mock so the agent never breaks.
      console.error("OpenAI error, using fallback:", err);
    }
  }

  return NextResponse.json({ answer: mockChatAnswer(question), source: "mock" });
}
