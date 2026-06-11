"use client";

import { useState } from "react";
import type { Subject } from "@/lib/taxonomy";

type Props = {
  subject: Subject;
  loading: boolean;
  onSolve: (problem: string) => void;
};

export default function ProblemInput({ subject, loading, onSolve }: Props) {
  const [problem, setProblem] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (problem.trim() && !loading) onSolve(problem.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (problem.trim() && !loading) onSolve(problem.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Problem
        </span>
        <span className="text-xs text-slate-600 bg-slate-800 border border-slate-700 rounded px-2 py-0.5">
          {subject}
        </span>
      </div>
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Type or paste any problem… e.g. "Solve 3x² − 5x − 2 = 0"`}
        rows={3}
        disabled={loading}
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-edge-navy resize-none disabled:opacity-50"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">⌘ Enter to solve</span>
        <button
          type="submit"
          disabled={!problem.trim() || loading}
          className="px-5 py-2 rounded text-sm font-semibold bg-edge-navy text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Solving…" : "Solve"}
        </button>
      </div>
    </form>
  );
}
