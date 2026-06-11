"use client";

type Strategy = {
  title: string;
  subject: "SAT" | "ACT" | "Both";
  steps: string[];
  tip: string;
};

const STRATEGIES: Strategy[] = [
  {
    title: "Time Management",
    subject: "Both",
    steps: [
      "Don't spend more than 1–1.5 min per question — mark and move",
      "Answer every question, even if guessing — no penalty for wrong answers",
      "Use the last 2 minutes to fill in any blanks",
      "On Reading: skim the passage first for structure, then answer",
    ],
    tip: "Pace = total time ÷ number of questions. Know your target pace before the test.",
  },
  {
    title: "Guessing Strategy",
    subject: "Both",
    steps: [
      "Never leave a question blank — there's no wrong-answer penalty",
      "Eliminate at least 1 choice before guessing to improve odds",
      "Pick a 'letter of the day' (e.g. C) and use it for all blind guesses",
      "Gut-check: does your answer actually answer what was asked?",
    ],
    tip: "Random guessing gives 25% odds. Eliminating one choice raises it to 33%.",
  },
  {
    title: "Process of Elimination",
    subject: "Both",
    steps: [
      "Cross off answers that are clearly wrong before committing",
      "Watch for extreme language: 'always', 'never', 'only' — usually wrong on Reading",
      "Two choices that contradict each other — one is usually correct",
      "If two choices are close, find the specific word that makes one wrong",
    ],
    tip: "POE works best when you're unsure. Eliminate confidently, guess from what remains.",
  },
  {
    title: "Desmos Calculator Tips",
    subject: "SAT",
    steps: [
      "Graph equations to find intersections — no algebra needed",
      "Use sliders to test values quickly for system of equations",
      "Table of values: plug in the answer choices and check",
      "For quadratics: find zeros, vertex, and direction just by graphing",
      "Regression tool for data questions — fits a line/curve instantly",
    ],
    tip: "If a problem has numbers and you have calculator access — graph it. Don't grind algebra.",
  },
  {
    title: "Reading Passage Approach",
    subject: "Both",
    steps: [
      "Read the blurb/intro first — it sets up the argument",
      "Skim for structure: where does the argument shift? Underline transitions",
      "For evidence questions: go back and read 2-3 lines around the citation",
      "Main idea questions: check first and last paragraph",
      "Never use outside knowledge — answer only with what the passage says",
    ],
    tip: "The answer is always supported by text. If you can't point to where it says it, it's wrong.",
  },
  {
    title: "Science Reasoning",
    subject: "ACT",
    steps: [
      "You don't need to understand the science — just read the data",
      "Graphs: identify axes, units, and trends before reading questions",
      "Conflicting Viewpoints: read each scientist's position separately",
      "For experimental design questions: what's the independent/dependent variable?",
      "Most answers are directly readable from the table or graph",
    ],
    tip: "ACT Science is a reading comprehension test with charts. Treat it that way.",
  },
];

const SUBJECT_COLORS: Record<Strategy["subject"], string> = {
  Both: "text-slate-400 bg-slate-700",
  SAT: "text-cyan-400 bg-cyan-900",
  ACT: "text-amber-400 bg-amber-900",
};

export default function StrategyCards() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Static reference cards — not AI generated. Use these mid-session for strategy coaching.
      </p>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {STRATEGIES.map((s) => (
          <div
            key={s.title}
            className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
          >
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-slate-100 flex-1">{s.title}</h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${SUBJECT_COLORS[s.subject]}`}
              >
                {s.subject}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <ul className="space-y-1.5">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-amber-400 font-mono text-xs mt-0.5 shrink-0 w-3">
                      {i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-cyan-400 italic">{s.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
