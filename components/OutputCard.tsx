"use client";

import type { Capability } from "@/types";

type Props = {
  capability: Capability;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

const CAPABILITY_LABELS: Record<Capability, string> = {
  teachingGuide: "Teaching Guide",
  workedExample: "Worked Example",
  practiceSet: "Practice Set",
  miniLesson: "Mini Lesson",
  exitTicket: "Exit Ticket",
  homework: "Homework",
  parentUpdate: "Parent Update",
  progressNote: "Progress Note",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-300">
          <span className="text-slate-500 mt-0.5 shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-300">
          <span className="text-amber-400 font-mono text-xs mt-0.5 shrink-0 w-4">{i + 1}.</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function QuestionBlock({
  q,
  showAnswer,
}: {
  q: { question: string; answer: string; explanation?: string };
  showAnswer: boolean;
}) {
  return (
    <div className="bg-slate-800 rounded p-3 space-y-1">
      <p className="text-sm text-slate-200">{q.question}</p>
      {showAnswer && (
        <>
          <p className="text-sm text-amber-400 font-medium">Answer: {q.answer}</p>
          {q.explanation && (
            <p className="text-xs text-slate-400">{q.explanation}</p>
          )}
        </>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderTeachingGuide(data: Record<string, any>) {
  return (
    <>
      <Section title="Concept Overview">
        <p className="text-sm text-slate-300">{data.concept_overview}</p>
      </Section>
      <Section title="Simple Explanation">
        <p className="text-sm text-slate-300">{data.simple_explanation}</p>
      </Section>
      <Section title="Common Misconceptions">
        <BulletList items={data.common_misconceptions} />
      </Section>
      <Section title="Tutor Talking Points">
        <BulletList items={data.tutor_talking_points} />
      </Section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderWorkedExample(data: Record<string, any>) {
  return (
    <>
      <Section title="Problem">
        <div className="bg-slate-800 rounded p-3">
          <p className="text-sm text-slate-200">{data.problem}</p>
        </div>
      </Section>
      <Section title="Step-by-Step Solution">
        <NumberedList items={data.step_by_step} />
      </Section>
      <Section title="Final Answer">
        <p className="text-sm font-semibold text-amber-400">{data.final_answer}</p>
      </Section>
      <Section title="Tutor Note">
        <p className="text-sm text-cyan-400 italic">{data.tutor_note}</p>
      </Section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPracticeSet(data: Record<string, any>) {
  const tiers = [
    { label: "Easy", key: "easy" },
    { label: "Medium", key: "medium" },
    { label: "Hard", key: "hard" },
  ];
  return (
    <>
      {tiers.map(({ label, key }) => (
        <Section key={key} title={label}>
          <div className="space-y-2">
            {data[key].map((q: { question: string; answer: string; explanation: string }, i: number) => (
              <QuestionBlock key={i} q={q} showAnswer />
            ))}
          </div>
        </Section>
      ))}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderMiniLesson(data: Record<string, any>) {
  return (
    <>
      <Section title="Objective">
        <p className="text-sm text-slate-300">{data.objective}</p>
      </Section>
      <Section title="Opening Hook">
        <p className="text-sm text-slate-300 italic">{data.opening_hook}</p>
      </Section>
      <Section title="Instruction Steps">
        <NumberedList items={data.instruction_steps} />
      </Section>
      <Section title="Check for Understanding">
        <div className="bg-slate-800 rounded p-3">
          <p className="text-sm text-slate-200">{data.check_for_understanding}</p>
        </div>
      </Section>
      <Section title="Closing">
        <p className="text-sm text-slate-300">{data.closing}</p>
      </Section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderExitTicket(data: Record<string, any>) {
  return (
    <Section title="Questions">
      <div className="space-y-2">
        {data.questions.map((q: { question: string; answer: string }, i: number) => (
          <QuestionBlock key={i} q={q} showAnswer />
        ))}
      </div>
    </Section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderHomework(data: Record<string, any>) {
  return (
    <>
      <Section title="Skill Focus">
        <p className="text-sm text-slate-300">{data.skill_focus}</p>
      </Section>
      <Section title="Instructions">
        <p className="text-sm text-slate-300">{data.instructions}</p>
      </Section>
      <Section title="Questions">
        <div className="space-y-2">
          {data.questions.map((q: { question: string; answer: string; explanation: string }, i: number) => (
            <QuestionBlock key={i} q={q} showAnswer />
          ))}
        </div>
      </Section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderParentUpdate(data: Record<string, any>) {
  return (
    <>
      <Section title="Student Strength">
        <p className="text-sm text-slate-300">{data.student_strength}</p>
      </Section>
      <Section title="Main Gap">
        <p className="text-sm text-slate-300">{data.main_gap}</p>
      </Section>
      <Section title="Skills Practiced">
        <BulletList items={data.skills_practiced} />
      </Section>
      <Section title="Homework Assigned">
        <p className="text-sm text-slate-300">{data.homework_assigned}</p>
      </Section>
      <Section title="Encouragement Note">
        <p className="text-sm text-cyan-400 italic">{data.encouragement_note}</p>
      </Section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderProgressNote(data: Record<string, any>) {
  return (
    <>
      <Section title="Session Summary">
        <p className="text-sm text-slate-300">{data.session_summary}</p>
      </Section>
      <Section title="Concepts Covered">
        <BulletList items={data.concepts_covered} />
      </Section>
      <Section title="Student Performance">
        <p className="text-sm text-slate-300">{data.student_performance}</p>
      </Section>
      <Section title="Next Steps">
        <p className="text-sm text-slate-300">{data.next_steps}</p>
      </Section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDERERS: Record<Capability, (data: Record<string, any>) => React.ReactNode> = {
  teachingGuide: renderTeachingGuide,
  workedExample: renderWorkedExample,
  practiceSet: renderPracticeSet,
  miniLesson: renderMiniLesson,
  exitTicket: renderExitTicket,
  homework: renderHomework,
  parentUpdate: renderParentUpdate,
  progressNote: renderProgressNote,
};

export default function OutputCard({ capability, data }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          {CAPABILITY_LABELS[capability]}
        </h2>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Copy JSON
        </button>
      </div>
      <div className="p-4">{RENDERERS[capability](data)}</div>
    </div>
  );
}
