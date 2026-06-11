"use client";

import type { KSGOutput } from "@/lib/schemas";

type Props = {
  problem: string;
  subject: string;
  ksg: KSGOutput;
  wolframVerified: boolean;
};

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div className={`px-4 py-2.5 flex items-center gap-3 ${color}`}>
      <span className="text-xs font-bold uppercase tracking-widest text-white opacity-70">
        {label}
      </span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-300">
          <span className="text-slate-600 shrink-0 mt-0.5">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function KSGCard({ problem, subject, ksg, wolframVerified }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      {/* Card header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">{subject}</p>
          <p className="text-sm font-semibold text-slate-100 leading-snug">{problem}</p>
        </div>
        {wolframVerified && (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-edge-green bg-green-950 border border-green-800 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-edge-green" />
            Wolfram Verified
          </span>
        )}
      </div>

      {/* KNOW */}
      <SectionHeader label="Know" color="bg-edge-navy" />
      <div className="px-4 py-4 border-b border-slate-800">
        <Row label="Prerequisites">
          <BulletList items={ksg.know.prerequisites} />
        </Row>
        <Row label="Key Vocabulary">
          <div className="space-y-2">
            {ksg.know.key_vocabulary.map((v, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-semibold text-white shrink-0">{v.term}:</span>
                <span className="text-slate-300">{v.definition}</span>
              </div>
            ))}
          </div>
        </Row>
        <Row label="Watch Out For">
          <p className="text-sm text-amber-300 bg-amber-950/40 border border-amber-900/50 rounded px-3 py-2">
            {ksg.know.watch_out_for}
          </p>
        </Row>
      </div>

      {/* SHOW */}
      <SectionHeader label="Show" color="bg-edge-navy" />
      <div className="px-4 py-4 border-b border-slate-800">
        <Row label="Problem Type">
          <p className="text-sm text-slate-300">{ksg.show.problem_type}</p>
        </Row>
        <Row label="Steps">
          <div className="flex flex-col gap-4">
            {ksg.show.steps.map((s, i) => (
              <div key={i} className="border border-slate-700 rounded overflow-hidden">
                <div className="bg-slate-800 px-3 py-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-edge-navy bg-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{s.step}</span>
                </div>
                <div className="px-3 py-2 flex flex-col gap-2">
                  <p className="text-sm font-mono text-cyan-300 whitespace-pre-line">{s.work}</p>
                  <p className="text-xs text-slate-400 italic">{s.why}</p>
                </div>
              </div>
            ))}
          </div>
        </Row>
        <div className="mt-3 bg-edge-navy/20 border border-edge-navy/40 rounded px-4 py-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Final Answer
          </p>
          <p className="text-base font-bold text-white">{ksg.show.final_answer}</p>
        </div>
      </div>

      {/* GROW */}
      <SectionHeader label="Grow" color="bg-edge-green" />
      <div className="px-4 py-4">
        <Row label="Key Takeaway">
          <p className="text-sm text-slate-300">{ksg.grow.key_takeaway}</p>
        </Row>
        <Row label="Connections">
          <BulletList items={ksg.grow.connections} />
        </Row>
        <Row label="Next Challenge">
          <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2.5">
            <p className="text-sm text-slate-200">{ksg.grow.next_challenge}</p>
          </div>
        </Row>
      </div>
    </div>
  );
}
