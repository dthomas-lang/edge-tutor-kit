"use client";

import { useState, useMemo } from "react";
import { SKILLS, type Skill, type Subject } from "@/lib/taxonomy";

type Props = {
  onSelect: (skill: Skill) => void;
  selected: Skill | null;
  selectedSubject: Subject;
};

export default function SkillSearch({ onSelect, selected, selectedSubject }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return SKILLS.filter((s) => {
      const matchesSubject = s.subject.includes(selectedSubject);
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q));
      return matchesSubject && matchesQuery;
    });
  }, [query, selectedSubject]);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Search skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-edge-navy"
      />
      <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto">
        {filtered.map((skill) => (
          <button
            key={skill.id}
            onClick={() => onSelect(skill)}
            className={`text-left px-3 py-2 rounded text-sm transition-colors ${
              selected?.id === skill.id
                ? "bg-edge-navy text-white font-medium"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="block">{skill.name}</span>
            <span
              className={`text-xs ${
                selected?.id === skill.id ? "text-blue-200" : "text-slate-500"
              }`}
            >
              {skill.difficulty}
              {skill.calculatorAllowed && " · calc OK"}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 text-sm px-3 py-2">No skills match.</p>
        )}
      </div>
    </div>
  );
}
