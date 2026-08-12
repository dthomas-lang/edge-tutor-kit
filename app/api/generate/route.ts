import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getSkillById, makeCustomSkill, ALL_SUBJECTS, type Subject } from "@/lib/taxonomy";
import {
  CAPABILITY_SCHEMAS,
  WorkedExampleSchema,
  PracticeSetSchema,
  type Capability,
} from "@/lib/schemas";
import { buildPrompt } from "@/lib/prompts";
import { verifyProblemsWithWolfram } from "@/lib/wolfram";

const CAPABILITIES = Object.keys(CAPABILITY_SCHEMAS) as Capability[];

// Worked Example and Practice Set have Claude both invent AND solve the
// problem(s) in one pass, with nothing checking its work — unlike the
// tutor-entered Solve flow, which verifies against Wolfram before Claude
// ever writes an answer. Since these outputs can end up in a student's
// packet or homework, run a second pass here: independently solve each
// generated problem with Wolfram, then have Claude correct anything that
// doesn't match. Best-effort — ELA content and unparseable word problems
// are simply left unverified rather than failing the request.

async function verifyWorkedExample(
  draft: {
    problem: string;
    step_by_step: string[];
    final_answer: string;
    tutor_note: string;
    wolfram_query: string;
  },
  subj: Subject
) {
  if (subj === "ELA") return { data: draft, wolframVerified: false };

  const [check] = await verifyProblemsWithWolfram([draft.wolfram_query]);
  if (!check.wolframAnswer) return { data: draft, wolframVerified: false };

  const prompt = `You are proofreading a worked math example before it is given to a student. Wolfram Alpha independently solved this problem's core calculation ("${check.problem}") and returned this as the authoritative result:

<wolfram_result>
${check.wolframAnswer}
</wolfram_result>

Here is the draft worked example:
<draft>
${JSON.stringify(draft)}
</draft>

If the draft's final_answer already matches the Wolfram result, return the draft completely unchanged. If it does not match, correct final_answer and step_by_step so the solution is accurate and consistent with the Wolfram result. Do not change the problem statement or the tutor_note's style. Keep wolfram_query as-is.`;

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: WorkedExampleSchema,
      prompt,
    });
    return { data: object, wolframVerified: true };
  } catch {
    return { data: draft, wolframVerified: false };
  }
}

type PracticeQuestion = {
  question: string;
  answer: string;
  explanation: string;
  wolfram_query: string;
};
async function verifyPracticeSet(
  draft: { easy: PracticeQuestion[]; medium: PracticeQuestion[]; hard: PracticeQuestion[] },
  subj: Subject
) {
  if (subj === "ELA") return { data: draft, wolframVerified: false };

  const allQuestions = [...draft.easy, ...draft.medium, ...draft.hard].map((q) => q.wolfram_query);
  if (allQuestions.length === 0) return { data: draft, wolframVerified: false };

  const checks = await verifyProblemsWithWolfram(allQuestions);
  const verifiedCount = checks.filter((c) => c.wolframAnswer).length;
  if (verifiedCount === 0) return { data: draft, wolframVerified: false };

  const prompt = `You are proofreading a set of practice math problems before they are given to a student. Wolfram Alpha independently solved each problem's core calculation below (entries marked "not verifiable" could not be checked — leave those problems unchanged):

<wolfram_results>
${checks.map((c) => `Calculation: ${c.problem}\nWolfram answer: ${c.wolframAnswer ?? "(not verifiable)"}`).join("\n\n")}
</wolfram_results>

Here is the draft practice set:
<draft>
${JSON.stringify(draft)}
</draft>

For each problem, if the draft's "answer" already matches its Wolfram result, keep that problem completely unchanged. If it does not match, correct only that problem's "answer" and "explanation". Do not change any question text or wolfram_query, and do not add, remove, or reorder problems — return the complete set in the same easy/medium/hard structure.`;

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: PracticeSetSchema,
      prompt,
    });
    return { data: object, wolframVerified: verifiedCount === allQuestions.length };
  } catch {
    return { data: draft, wolframVerified: false };
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { capability, skillId, skillName, subject, options = {} } = body as {
    capability: unknown;
    skillId: unknown;
    skillName: unknown;
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

  const subj = subject as Subject;

  // Skills not in the taxonomy (a tutor's free-text "custom topic" search)
  // arrive with a "custom-" id and no catalog entry — rebuild the same
  // ad-hoc skill server-side from its name rather than rejecting it.
  const skill =
    getSkillById(skillId) ??
    (skillId.startsWith("custom-") && typeof skillName === "string" && skillName.trim()
      ? makeCustomSkill(skillName, subj)
      : undefined);
  if (!skill) {
    return NextResponse.json(
      { error: `Unknown skillId: ${skillId}` },
      { status: 404 }
    );
  }

  const cap = capability as Capability;
  const schema = CAPABILITY_SCHEMAS[cap];
  const prompt = buildPrompt(cap, skill, subj, options as Parameters<typeof buildPrompt>[3]);

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema,
      prompt,
    });

    if (cap === "workedExample") {
      const { data, wolframVerified } = await verifyWorkedExample(
        object as Parameters<typeof verifyWorkedExample>[0],
        subj
      );
      return NextResponse.json({ capability: cap, skillId, subject, data, wolframVerified });
    }

    if (cap === "practiceSet") {
      const { data, wolframVerified } = await verifyPracticeSet(
        object as Parameters<typeof verifyPracticeSet>[0],
        subj
      );
      return NextResponse.json({ capability: cap, skillId, subject, data, wolframVerified });
    }

    return NextResponse.json({ capability: cap, skillId, subject, data: object, wolframVerified: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
