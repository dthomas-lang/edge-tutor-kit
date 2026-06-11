import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { SessionPacket } from "@/lib/packet";
import { PacketPracticeSchema, KSGSchema } from "@/lib/schemas";
import type { Subject } from "@/lib/taxonomy";

type RequestBody = {
  studentName?: string;
  subject: Subject;
  problem: string;
  ksg: unknown;
  wolframVerified: boolean;
  selectedVideo: { videoId: string; title: string } | null;
  skillName?: string;
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { studentName, subject, problem, ksg: rawKsg, wolframVerified, selectedVideo, skillName } = body;

  // Validate KSG shape
  const ksgParsed = KSGSchema.safeParse(rawKsg);
  if (!ksgParsed.success) {
    return NextResponse.json({ error: "Invalid KSG data" }, { status: 400 });
  }
  const ksg = ksgParsed.data;

  // Generate 3 practice problems via Claude
  const practicePrompt = `You are an expert ${subject} tutor. Generate exactly 3 practice problems that reinforce this skill.

Context:
- Subject: ${subject}
- Problem type: ${ksg.show.problem_type}
- Reference problem: ${problem}
- Key concept: ${ksg.grow.key_takeaway}

Requirements:
- Problems should vary in difficulty: one easy, one medium, one harder
- Each must be solvable and appropriate for K-12 students
- Provide the complete answer and a one-sentence explanation for each
- Problems must be different from the reference problem`;

  const { object: practice } = await generateObject({
    model: anthropic("claude-haiku-4-5-20251001"),
    schema: PacketPracticeSchema,
    prompt: practicePrompt,
  });

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const element = createElement(SessionPacket, {
    studentName: studentName || "Student",
    subject,
    problem,
    ksg,
    wolframVerified,
    practice,
    selectedVideo: selectedVideo ?? null,
    skillName,
    date,
  });

  const buffer = await renderToBuffer(element);

  const safeName = (studentName || "Student").replace(/[^a-z0-9]/gi, "-");
  const safeDate = date.replace(/[^a-z0-9]/gi, "-");

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="session-packet-${safeName}-${safeDate}.pdf"`,
      "Content-Length": buffer.byteLength.toString(),
    },
  });
}
