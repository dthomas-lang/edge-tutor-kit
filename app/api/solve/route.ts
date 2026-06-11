import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { KSGSchema } from "@/lib/schemas";
import { buildKSGPrompt } from "@/lib/prompts";
import { ALL_SUBJECTS, type Subject } from "@/lib/taxonomy";

async function callWolfram(problem: string): Promise<string | null> {
  const appId = process.env.WOLFRAM_APP_ID;
  if (!appId) return null;

  try {
    const url = `https://www.wolframalpha.com/api/v1/llm-api?input=${encodeURIComponent(problem)}&appid=${appId}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { problem, subject } = body as { problem: unknown; subject: unknown };

  if (!problem || typeof problem !== "string" || problem.trim().length === 0) {
    return NextResponse.json({ error: "problem is required" }, { status: 400 });
  }

  if (!subject || !ALL_SUBJECTS.includes(subject as Subject)) {
    return NextResponse.json(
      { error: `subject must be one of: ${ALL_SUBJECTS.join(", ")}` },
      { status: 400 }
    );
  }

  const subj = subject as Subject;
  const isELA = subj === "ELA";

  // Wolfram call — skipped for ELA, best-effort for math subjects
  const wolframContext = isELA ? null : await callWolfram(problem.trim());

  const prompt = buildKSGPrompt(problem.trim(), subj, wolframContext ?? undefined);

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: KSGSchema,
      prompt,
    });

    return NextResponse.json({
      subject: subj,
      problem: problem.trim(),
      wolframVerified: wolframContext !== null,
      ksg: object,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
