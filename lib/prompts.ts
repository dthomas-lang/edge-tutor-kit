import type { Skill, Subject } from "./taxonomy";
import type { Capability } from "./schemas";

type Options = {
  duration?: number;
  difficulty?: string;
  studentStrength?: string;
  studentName?: string;
  homeworkAssigned?: string;
};

function skillContext(skill: Skill, subject: string): string {
  return `Skill: ${skill.name}
Domain: ${skill.domain}
Test: ${subject}
Difficulty level: ${skill.difficulty}
Calculator allowed: ${skill.calculatorAllowed ? "Yes" : "No"}`;
}

export function buildPrompt(
  capability: Capability,
  skill: Skill,
  subject: string,
  options: Options = {}
): string {
  const ctx = skillContext(skill, subject);

  switch (capability) {
    case "teachingGuide":
      return `You are an expert ${subject} tutor. Generate a concise teaching guide for the following skill.

${ctx}

Provide:
- A clear concept overview (2-3 sentences)
- A simple explanation a student can immediately grasp
- 3-4 common misconceptions students have about this skill
- 4-5 tutor talking points — key things to emphasize during instruction

Be direct and practical. Tutors use this mid-session under time pressure.`;

    case "workedExample":
      return `You are an expert ${subject} tutor. Generate one worked example problem for the following skill.

${ctx}
${options.difficulty ? `Difficulty: ${options.difficulty}` : ""}

Provide:
- A realistic ${subject}-style problem
- Clear step-by-step solution (each step as a separate string)
- The final answer
- A brief tutor note highlighting the key insight or common trap

Write steps as if speaking to a student: clear, numbered, showing work.`;

    case "practiceSet":
      return `You are an expert ${subject} tutor. Generate a practice set for the following skill.

${ctx}

Generate 2 easy, 3 medium, and 2 hard practice problems. Each problem needs:
- A question (realistic ${subject} format)
- The correct answer
- A brief explanation of how to solve it

Scale difficulty appropriately. Hard problems should reflect actual ${subject} challenge level.`;

    case "miniLesson":
      return `You are an expert ${subject} tutor. Design a focused mini-lesson for the following skill.

${ctx}
${options.duration ? `Target duration: ${options.duration} minutes` : "Target duration: 15 minutes"}

Provide:
- A clear learning objective
- An opening hook to engage the student (a surprising fact, common test trap, or real-world connection)
- 4-5 step-by-step instruction steps
- A check-for-understanding question or activity
- A closing statement that reinforces the key takeaway

Keep it tight and tutor-led. This is for one-on-one sessions.`;

    case "exitTicket":
      return `You are an expert ${subject} tutor. Create a 3-question exit ticket for the following skill.

${ctx}

Each question should:
- Be brief and quick to answer (under 2 minutes total)
- Test whether the student grasped the key concept
- Have a clear, unambiguous answer

Use realistic ${subject} question formats. Vary the question types if possible.`;

    case "homework":
      return `You are an expert ${subject} tutor. Create a 5-question homework assignment for the following skill.

${ctx}
${options.studentStrength ? `Student note: ${options.studentStrength}` : ""}

Provide:
- The skill focus (1 sentence)
- Clear instructions for the student
- 5 practice problems with answers and explanations

Problems should progress in difficulty. Format questions so a student can work independently.`;

    case "parentUpdate":
      return `You are an expert ${subject} tutor writing a brief parent update after a tutoring session.

${ctx}
${options.studentName ? `Student: ${options.studentName}` : ""}
${options.studentStrength ? `Session notes: ${options.studentStrength}` : ""}
${options.homeworkAssigned ? `Homework assigned: ${options.homeworkAssigned}` : ""}

Write a professional, warm parent update that includes:
- What the student did well (strength)
- The main skill gap being worked on
- Skills practiced this session
- What homework was assigned
- An encouraging closing note

Keep it concise — 3-4 sentences per field. Professional enough to send directly.`;

    case "progressNote":
      return `You are an expert ${subject} tutor writing an internal session progress note.

${ctx}
${options.studentName ? `Student: ${options.studentName}` : ""}
${options.studentStrength ? `Session notes: ${options.studentStrength}` : ""}

Write a clear internal progress note with:
- A session summary (what was covered and how it went)
- Specific concepts covered (list)
- Student performance assessment (honest, specific)
- Next steps for the next session

Be direct and clinical — this is for tutor reference, not for parents or students.`;
  }
}

export function buildKSGPrompt(
  problem: string,
  subject: Subject,
  wolframContext?: string
): string {
  const isELA = subject === "ELA";

  const wolframSection = wolframContext
    ? `\nWolfram Alpha has already verified this problem. Use the following as your authoritative source for the answer and steps — do not contradict it:\n\n<wolfram_result>\n${wolframContext}\n</wolfram_result>\n`
    : "";

  if (isELA) {
    return `You are an expert ELA tutor using the KSG pedagogical framework. A student has the following question or problem:

<problem>
${problem}
</problem>

Generate a complete KSG explanation with three sections:

KNOW — List the prerequisite skills or knowledge the student needs, define key vocabulary terms, and identify common errors to watch out for.

SHOW — Identify the problem type, then walk through the solution step by step. For each step: state what you're doing, show the work, and explain why this step is necessary.

GROW — Summarize the single most important takeaway, list 2-3 connections to related skills, and suggest a harder follow-up challenge.

Be specific and pedagogically precise. Write as if speaking directly to the student.`;
  }

  return `You are an expert ${subject} tutor using the KSG pedagogical framework. A student has the following problem:

<problem>
${problem}
</problem>
${wolframSection}
Generate a complete KSG explanation with three sections:

KNOW — List the prerequisite skills or knowledge the student needs (e.g., "knows how to combine like terms"), define key vocabulary terms with clear definitions, and identify one specific thing students frequently get wrong on this type of problem.

SHOW — Identify the problem type, then walk through the solution step by step. For each step: state what you're doing (brief action label), show the actual mathematical work, and explain why this step is necessary. The final_answer must match the Wolfram-verified result exactly if one was provided.

GROW — Summarize the single most important conceptual takeaway, list 2-3 connections to related topics the student will encounter, and write one harder follow-up problem as a challenge.

Be precise. Every step in SHOW must be mathematically correct and completeable by a student.`;
}
