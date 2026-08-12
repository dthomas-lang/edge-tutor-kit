import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { SessionPacket } from "@/lib/packet";
import { PacketPracticeSchema, KSGSchema, type PacketPracticeOutput } from "@/lib/schemas";
import type { Subject } from "@/lib/taxonomy";
import { verifyProblemsWithWolfram } from "@/lib/wolfram";

// The 3 practice problems are Claude-invented and Claude-solved with nothing
// checking the work — but this is the literal PDF that goes home with a
// student, so independently solve each with Wolfram and have Claude correct
// anything that doesn't match before it's placed in the document.
async function verifyPacketPractice(
  draft: PacketPracticeOutput,
  subject: Subject
): Promise<PacketPracticeOutput> {
  if (subject === "ELA") return draft;

  const checks = await verifyProblemsWithWolfram(draft.problems.map((p) => p.wolfram_query));
  const verifiedCount = checks.filter((c) => c.wolframAnswer).length;
  if (verifiedCount === 0) return draft;

  const prompt = `You are proofreading practice problems before they are printed in a student's take-home packet. Wolfram Alpha independently solved each problem's core calculation below (entries marked "not verifiable" could not be checked — leave those problems unchanged):

<wolfram_results>
${checks.map((c) => `Calculation: ${c.problem}\nWolfram answer: ${c.wolframAnswer ?? "(not verifiable)"}`).join("\n\n")}
</wolfram_results>

Here is the draft problem set:
<draft>
${JSON.stringify(draft)}
</draft>

For each problem, if the draft's "answer" already matches its Wolfram result, keep that problem completely unchanged. If it does not match, correct only that problem's "answer" and "explanation". Do not change any question text or wolfram_query, and do not add, remove, or reorder problems — return exactly 3 problems in the same order.`;

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: PacketPracticeSchema,
      prompt,
    });
    return object;
  } catch {
    return draft;
  }
}

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
- Problems must be different from the reference problem
- For wolfram_query: distill each problem down to its bare calculation — the equation to solve or expression to evaluate — with none of the word-problem framing, context, or units. Plain text only, no LaTeX. This field is used only for automated answer-checking and is never shown to a student.`;

  try {
    const { object: draftPractice } = await generateObject({
      model: anthropic("claude-haiku-4-5-20251001"),
      schema: PacketPracticeSchema,
      prompt: practicePrompt,
    });

    const practice = await verifyPacketPractice(draftPractice, subject);

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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to build session packet";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
