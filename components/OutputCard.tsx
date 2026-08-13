"use client";

import { CAPABILITY_LABELS, type Capability } from "@/types";
import MathText from "@/components/MathText";

type Props = {
  capability: Capability;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  wolframVerified?: boolean;
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
          <MathText text={item} />
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
          <MathText text={item} />
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
      <p className="text-sm text-slate-200"><MathText text={q.question} /></p>
      {showAnswer && (
        <>
          <p className="text-sm text-amber-400 font-medium">
            Answer: <MathText text={q.answer} />
          </p>
          {q.explanation && (
            <p className="text-xs text-slate-400"><MathText text={q.explanation} /></p>
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
        <p className="text-sm text-slate-300"><MathText text={data.concept_overview} /></p>
      </Section>
      <Section title="Simple Explanation">
        <p className="text-sm text-slate-300"><MathText text={data.simple_explanation} /></p>
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
          <p className="text-sm text-slate-200"><MathText text={data.problem} /></p>
        </div>
      </Section>
      <Section title="Step-by-Step Solution">
        <NumberedList items={data.step_by_step} />
      </Section>
      <Section title="Final Answer">
        <p className="text-sm font-semibold text-amber-400"><MathText text={data.final_answer} /></p>
      </Section>
      <Section title="Tutor Note">
        <p className="text-sm text-cyan-400 italic"><MathText text={data.tutor_note} /></p>
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
        <p className="text-sm text-slate-300"><MathText text={data.objective} /></p>
      </Section>
      <Section title="Opening Hook">
        <p className="text-sm text-slate-300 italic"><MathText text={data.opening_hook} /></p>
      </Section>
      <Section title="Instruction Steps">
        <NumberedList items={data.instruction_steps} />
      </Section>
      <Section title="Check for Understanding">
        <div className="bg-slate-800 rounded p-3">
          <p className="text-sm text-slate-200"><MathText text={data.check_for_understanding} /></p>
        </div>
      </Section>
      <Section title="Closing">
        <p className="text-sm text-slate-300"><MathText text={data.closing} /></p>
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
        <p className="text-sm text-slate-300"><MathText text={data.skill_focus} /></p>
      </Section>
      <Section title="Instructions">
        <p className="text-sm text-slate-300"><MathText text={data.instructions} /></p>
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

export default function OutputCard({ capability, data, wolframVerified }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            {CAPABILITY_LABELS[capability]}
          </h2>
          {wolframVerified && (
            <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-edge-green bg-green-950 border border-green-800 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-edge-green" />
              Wolfram Verified
            </span>
          )}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors shrink-0"
        >
          Copy JSON
        </button>
      </div>
      <div className="p-4">{RENDERERS[capability](data)}</div>
    </div>
  );
}
