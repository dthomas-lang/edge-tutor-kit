import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getSkillById, ALL_SUBJECTS } from "@/lib/taxonomy";
import { CAPABILITY_SCHEMAS, type Capability } from "@/lib/schemas";
import { buildPrompt } from "@/lib/prompts";

const CAPABILITIES = Object.keys(CAPABILITY_SCHEMAS) as Capability[];

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { capability, skillId, subject, options = {} } = body as {
    capability: unknown;
    skillId: unknown;
    subject: unknown;
    options: Record<string, unknown>;
  };

  if (!capability || !CAPABILITIES.includes(capability as Capability)) {
    return NextResponse.json(
      { error: `Invalid capability. Must be one of: ${CAPABILITIES.join(", ")}` },
      { status: 400 }
    );
  }

  if (!skillId || typeof skillId !== "string") {
    return NextResponse.json({ error: "skillId is required" }, { status: 400 });
  }

  if (!subject || !ALL_SUBJECTS.includes(subject as (typeof ALL_SUBJECTS)[number])) {
    return NextResponse.json(
      { error: `subject must be one of: ${ALL_SUBJECTS.join(", ")}` },
      { status: 400 }
    );
  }

  const skill = getSkillById(skillId);
  if (!skill) {
    return NextResponse.json(
      { error: `Unknown skillId: ${skillId}` },
      { status: 404 }
    );
  }

  const cap = capability as Capability;
  const schema = CAPABILITY_SCHEMAS[cap];
  const prompt = buildPrompt(cap, skill, subject as "SAT" | "ACT", options as Parameters<typeof buildPrompt>[3]);

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema,
      prompt,
    });

    return NextResponse.json({ capability: cap, skillId, subject, data: object });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
