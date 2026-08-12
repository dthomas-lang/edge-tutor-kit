"use client";

import type { Subject } from "@/lib/taxonomy";

type Strategy = {
  title: string;
  subject: Subject | "All";
  steps: string[];
  tip: string;
};

const STRATEGIES: Strategy[] = [
  // ── All subjects — general session/test-taking technique ─────────────────
  {
    title: "Time Management",
    subject: "All",
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
    subject: "All",
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
    subject: "All",
    steps: [
      "Cross off answers that are clearly wrong before committing",
      "Watch for extreme language: 'always', 'never', 'only' — usually wrong on Reading",
      "Two choices that contradict each other — one is usually correct",
      "If two choices are close, find the specific word that makes one wrong",
    ],
    tip: "POE works best when you're unsure. Eliminate confidently, guess from what remains.",
  },

  // ── Algebra 1 ──────────────────────────────────────────────────────────────
  {
    title: "Solving Multi-Step Equations",
    subject: "Algebra 1",
    steps: [
      "Simplify each side first — combine like terms, distribute",
      "Undo addition/subtraction before multiplication/division",
      "Track the sign every time you move a term across the equals sign",
      "Verify by substituting your answer back into the original equation",
    ],
    tip: "A wrong sign on step 1 wrecks every step after it. Slow down there specifically.",
  },
  {
    title: "Reading Word Problems",
    subject: "Algebra 1",
    steps: [
      "Define your variable in words before writing any equation",
      "Underline the question — what value are you actually being asked for?",
      "Translate keywords: 'total' = add, 'difference' = subtract, 'times' = multiply",
      "Sanity-check the final answer against the real-world context (units, sign, size)",
    ],
    tip: "If the answer is a negative number of people or a fractional number of cars, something's wrong upstream.",
  },

  // ── Algebra 2 ──────────────────────────────────────────────────────────────
  {
    title: "Choosing a Solving Method",
    subject: "Algebra 2",
    steps: [
      "Factorable with integer roots? Factor — it's fastest",
      "Not factorable, or unsure? Use the quadratic formula — it always works",
      "Need vertex form or a proof of no real roots? Complete the square",
      "For higher-degree polynomials: try the rational root theorem before grinding",
    ],
    tip: "Students default to the quadratic formula even when factoring would take 10 seconds. Ask 'does this factor?' first.",
  },
  {
    title: "Working with Functions",
    subject: "Algebra 2",
    steps: [
      "Evaluate f(a) by substituting before simplifying the general expression",
      "Watch domain restrictions — denominators can't be zero, radicands can't be negative",
      "For inverse functions, swap x and y first, then solve for y",
      "Stuck on a hard function question? Graph it (mentally or on Desmos) to check",
    ],
    tip: "When symbolic work stalls, a quick graph often reveals the answer or the mistake immediately.",
  },

  // ── Geometry ─────────────────────────────────────────────────────────────
  {
    title: "Reading and Marking Diagrams",
    subject: "Geometry",
    steps: [
      "Mark every given piece of info directly on the figure (tick marks, angle arcs)",
      "Look for hidden congruent or similar triangles sharing a side or angle",
      "Redraw the figure larger if it's cramped or if you need to add auxiliary lines",
      "Label unknowns with variables before setting up any equation",
    ],
    tip: "Most 'I don't know where to start' moments resolve once the diagram is fully marked up.",
  },
  {
    title: "Writing Proofs",
    subject: "Geometry",
    steps: [
      "State the goal (what you're proving) before writing any statement",
      "Work backward from the conclusion to see what it depends on",
      "Every statement needs a reason — a definition, postulate, or theorem, not 'it looks like it'",
      "Given info and CPCTC-style conclusions are always fair game to state directly",
    ],
    tip: "If a proof stalls, ask: 'what would I need to know to reach the next line?' — then go prove that.",
  },

  // ── Precalculus ──────────────────────────────────────────────────────────
  {
    title: "Unit Circle Fluency",
    subject: "Precalculus",
    steps: [
      "Memorize the key angles (30°, 45°, 60°) and their sine/cosine values first",
      "Use reference angles to get any other angle from the ones you know",
      "Sketch the reference triangle rather than pure memorization when unsure",
      "Know the sign of each function in each quadrant (ASTC) cold",
    ],
    tip: "Fast unit-circle recall is the single biggest speed unlock for the rest of trig and calculus.",
  },
  {
    title: "Function Transformations",
    subject: "Precalculus",
    steps: [
      "Identify the parent function first (linear, quadratic, trig, exponential, etc.)",
      "Apply transformations inside the parentheses (horizontal) before outside (vertical)",
      "Horizontal shifts and stretches behave opposite to what the sign suggests",
      "Verify by tracking one known point through each transformation step",
    ],
    tip: "f(x - 3) shifts RIGHT, not left. Students flip this constantly — check with a test point.",
  },

  // ── Calculus ─────────────────────────────────────────────────────────────
  {
    title: "Choosing a Differentiation Rule",
    subject: "Calculus",
    steps: [
      "Identify the outer structure first: is it a product, quotient, or composition?",
      "Composition (a function inside a function) → chain rule, work outside-in",
      "Product of two functions → product rule; don't just multiply the derivatives",
      "Write out each piece (f, g, f', g') explicitly before combining — don't rush",
    ],
    tip: "Most differentiation errors come from misreading the structure, not from the rules themselves.",
  },
  {
    title: "Setting Up Word Problems (Related Rates / Optimization)",
    subject: "Calculus",
    steps: [
      "Draw a diagram and label every quantity, including which ones change over time",
      "Write the equation relating the variables before differentiating anything",
      "For related rates: differentiate with respect to time, then substitute known values",
      "For optimization: express the target as a single-variable function before taking f'",
    ],
    tip: "Substituting known values before differentiating is the most common related-rates mistake — differentiate first, always.",
  },

  // ── ELA ──────────────────────────────────────────────────────────────────
  {
    title: "Reading Passage Approach",
    subject: "ELA",
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
    title: "Essay Structure Under Time Pressure",
    subject: "ELA",
    steps: [
      "Write the thesis first — one sentence stating your specific claim",
      "Each topic sentence should echo a word or idea from the thesis",
      "Use one piece of concrete evidence per paragraph, then explain how it proves the point",
      "Save the last 2 minutes to proofread, not to keep writing",
    ],
    tip: "A clear, specific thesis in sentence one does more for the score than three extra body paragraphs.",
  },

  // ── SAT/ACT Math ─────────────────────────────────────────────────────────
  {
    title: "Desmos Calculator Tips",
    subject: "SAT/ACT Math",
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
    title: "Backsolving from Answer Choices",
    subject: "SAT/ACT Math",
    steps: [
      "When the algebra looks messy, plug in the answer choices instead",
      "Start with choice B or C (usually a middle value) to narrow direction fast",
      "Too big? Try a smaller choice. Too small? Try a larger one — no need to test all four",
      "Works especially well on 'solve for x' and word-problem questions",
    ],
    tip: "Backsolving trades algebra time for arithmetic time — often faster and less error-prone under pressure.",
  },
  {
    title: "Science Reasoning (ACT)",
    subject: "SAT/ACT Math",
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
  All: "text-slate-400 bg-slate-700",
  "Algebra 1": "text-cyan-400 bg-cyan-900",
  "Algebra 2": "text-cyan-400 bg-cyan-900",
  Geometry: "text-cyan-400 bg-cyan-900",
  Precalculus: "text-cyan-400 bg-cyan-900",
  Calculus: "text-cyan-400 bg-cyan-900",
  "SAT/ACT Math": "text-amber-400 bg-amber-900",
  ELA: "text-violet-400 bg-violet-900",
};

type Props = {
  subject: Subject;
};

export default function StrategyCards({ subject }: Props) {
  const visible = STRATEGIES.filter((s) => s.subject === "All" || s.subject === subject);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Static reference cards for {subject} — not AI generated. Use these mid-session for strategy coaching.
      </p>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {visible.map((s) => (
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
