"use client";

export type SessionOptionValues = {
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  studentName: string;
  studentEmail: string;
  studentNotes: string;
  homeworkAssigned: string;
};

type Props = {
  values: SessionOptionValues;
  onChange: (values: SessionOptionValues) => void;
};

export default function SessionOptions({ values, onChange }: Props) {
  function set<K extends keyof SessionOptionValues>(key: K, value: SessionOptionValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Session Options
      </p>

      {/* Duration */}
      <div>
        <label className="text-xs text-slate-400 block mb-1">Duration (min)</label>
        <div className="flex gap-1">
          {[10, 15, 20, 30].map((d) => (
            <button
              key={d}
              onClick={() => set("duration", d)}
              className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                values.duration === d
                  ? "bg-amber-400 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="text-xs text-slate-400 block mb-1">Difficulty</label>
        <div className="flex gap-1">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => set("difficulty", d)}
              className={`flex-1 py-1 rounded text-xs font-medium capitalize transition-colors ${
                values.difficulty === d
                  ? "bg-amber-400 text-slate-900"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Student name */}
      <div>
        <label className="text-xs text-slate-400 block mb-1">Student Name</label>
        <input
          type="text"
          value={values.studentName}
          onChange={(e) => set("studentName", e.target.value)}
          placeholder="Optional"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Student email */}
      <div>
        <label className="text-xs text-slate-400 block mb-1">Student Email</label>
        <input
          type="email"
          value={values.studentEmail}
          onChange={(e) => set("studentEmail", e.target.value)}
          placeholder="For sending packet"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Student notes */}
      <div>
        <label className="text-xs text-slate-400 block mb-1">Session Notes</label>
        <textarea
          value={values.studentNotes}
          onChange={(e) => set("studentNotes", e.target.value)}
          placeholder="Strengths, gaps, what was covered..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none"
        />
      </div>

      {/* Homework assigned — used by Parent Update */}
      <div>
        <label className="text-xs text-slate-400 block mb-1">Homework Assigned</label>
        <input
          type="text"
          value={values.homeworkAssigned}
          onChange={(e) => set("homeworkAssigned", e.target.value)}
          placeholder="For Parent Update"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
        />
      </div>
    </div>
  );
}
