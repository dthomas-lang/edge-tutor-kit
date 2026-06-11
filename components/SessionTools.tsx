"use client";

import type { Capability } from "@/types";
import type { Skill, Subject } from "@/lib/taxonomy";

type Props = {
  skill: Skill | null;
  subject: Subject;
  onGenerate: (capability: Capability, options?: Record<string, unknown>) => void;
  loading: boolean;
};

type ToolButton = {
  capability: Capability;
  label: string;
  description: string;
};

const TOOLS: ToolButton[] = [
  { capability: "teachingGuide", label: "Teaching Guide", description: "Concept overview + talking points" },
  { capability: "workedExample", label: "Worked Example", description: "Step-by-step problem walkthrough" },
  { capability: "practiceSet", label: "Practice Set", description: "Easy / Medium / Hard problems" },
  { capability: "miniLesson", label: "Mini Lesson", description: "15-min structured lesson plan" },
  { capability: "exitTicket", label: "Exit Ticket", description: "3-question comprehension check" },
  { capability: "homework", label: "Homework", description: "5-question take-home assignment" },
  { capability: "parentUpdate", label: "Parent Update", description: "Professional session summary" },
  { capability: "progressNote", label: "Progress Note", description: "Internal tutor session notes" },
];

export default function SessionTools({ skill, subject, onGenerate, loading }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {TOOLS.map(({ capability, label, description }) => (
        <button
          key={capability}
          disabled={!skill || loading}
          onClick={() => onGenerate(capability)}
          className="text-left px-4 py-3 rounded bg-slate-800 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <div className="text-sm font-medium text-slate-100 group-hover:text-amber-400 transition-colors">
            {label}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        </button>
      ))}
      {!skill && (
        <p className="text-xs text-slate-500 text-center mt-1 px-2">
          Select a skill to enable tools
        </p>
      )}
    </div>
  );
}
