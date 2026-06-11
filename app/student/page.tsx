import DesmosEmbed from "@/components/DesmosEmbed";

export default function StudentView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://myedgecenter.com/wp-content/uploads/EDGE_Logo.png"
            alt="The Center at the EDGE"
            className="h-8 w-auto object-contain"
          />
          <div className="h-5 w-px bg-slate-700" />
          <span className="text-sm font-medium text-slate-400">Student Session</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-edge-green bg-green-950 border border-green-800 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-edge-green animate-pulse" />
          Live
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* Today's Topic */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-edge-navy px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Today&apos;s Topic</h2>
          </div>
          <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-slate-500 text-sm">Waiting for your tutor to start the session…</p>
          </div>
        </section>

        {/* KSG Explanation */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-edge-navy px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Know · Show · Grow</h2>
            <span className="text-xs text-blue-200 bg-blue-900/40 border border-blue-800 rounded px-2 py-0.5">
              Tutor will reveal
            </span>
          </div>
          <div className="divide-y divide-slate-800">
            {(["Know", "Show", "Grow"] as const).map((section) => (
              <div key={section} className="px-4 py-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {section}
                </p>
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-2 animate-none opacity-40" />
                <div className="h-4 bg-slate-800 rounded w-1/2 opacity-40" />
              </div>
            ))}
          </div>
        </section>

        {/* Worked Steps */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-edge-navy px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Step-by-Step Solution</h2>
            <span className="text-xs text-blue-200 bg-blue-900/40 border border-blue-800 rounded px-2 py-0.5">
              Tutor will reveal
            </span>
          </div>
          <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-slate-500 text-sm">Steps appear here when your tutor reveals them.</p>
          </div>
        </section>

        {/* Visual */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-edge-navy px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Interactive Visual</h2>
            <span className="text-xs text-blue-200 opacity-70">View only · tutor controls subject</span>
          </div>
          <div className="h-96">
            <DesmosEmbed readOnly />
          </div>
        </section>

        {/* Video */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-edge-navy px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Recommended Video</h2>
          </div>
          <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-slate-500 text-sm">Video resource selected by your tutor will appear here.</p>
          </div>
        </section>

        {/* Practice Problems */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-edge-navy px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Practice Problems</h2>
          </div>
          <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-slate-500 text-sm">Practice problems will appear here when generated.</p>
          </div>
        </section>

        {/* Session Packet Status */}
        <section className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-300">Session Packet</p>
            <p className="text-xs text-slate-500 mt-0.5">PDF will be sent to your profile when the session ends.</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
            Not sent yet
          </span>
        </section>

      </div>
    </div>
  );
}
