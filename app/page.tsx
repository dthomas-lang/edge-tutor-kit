"use client";

import { useState } from "react";
import Link from "next/link";
import SkillSearch from "@/components/SkillSearch";
import SessionTools from "@/components/SessionTools";
import SessionOptions, { type SessionOptionValues } from "@/components/SessionOptions";
import OutputCard from "@/components/OutputCard";
import KSGCard from "@/components/KSGCard";
import ProblemInput from "@/components/ProblemInput";
import LoadingState from "@/components/LoadingState";
import StrategyCards from "@/components/StrategyCards";
import DesmosEmbed from "@/components/DesmosEmbed";
import GeoGebraEmbed from "@/components/GeoGebraEmbed";
import VideoSearch from "@/components/VideoSearch";
import { ALL_SUBJECTS, type Subject, type Skill } from "@/lib/taxonomy";
import type { Capability, KSGOutput } from "@/types";

type GenerateOutput = {
  kind: "generate";
  capability: Capability;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
} | null;

type SolveOutput = {
  kind: "solve";
  problem: string;
  subject: string;
  wolframVerified: boolean;
  ksg: KSGOutput;
} | null;

type MainTab = "output" | "visual" | "video" | "strategy";

const TAB_LABELS: Record<MainTab, string> = {
  output: "Output",
  visual: "Visual",
  video: "Video",
  strategy: "Strategy Cards",
};

function visualToolFor(subject: Subject): "desmos" | "geogebra" | "none" {
  if (subject === "Geometry") return "geogebra";
  if (subject === "ELA") return "none";
  return "desmos";
}

const DEFAULT_OPTIONS: SessionOptionValues = {
  duration: 15,
  difficulty: "medium",
  studentName: "",
  studentEmail: "",
  studentNotes: "",
  homeworkAssigned: "",
};

export default function TutorDashboard() {
  const [subject, setSubject] = useState<Subject>("Algebra 1");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [options, setOptions] = useState<SessionOptionValues>(DEFAULT_OPTIONS);

  const [generateOutput, setGenerateOutput] = useState<GenerateOutput>(null);
  const [solveOutput, setSolveOutput] = useState<SolveOutput>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string } | null>(null);
  const [builtPacket, setBuiltPacket] = useState<{ base64: string; filename: string } | null>(null);
  const [packetSent, setPacketSent] = useState(false);

  const [solveLoading, setSolveLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [packetLoading, setPacketLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>("output");
  const [visualFullscreen, setVisualFullscreen] = useState(false);
  
  function buildVideoQuery(): string {
    if (solveOutput) {
      return `${solveOutput.ksg.show.problem_type} ${solveOutput.subject} tutorial`;
    }
    if (selectedSkill) {
      return `${selectedSkill.name} ${subject} tutorial`;
    }
    return "";
  }

  function handleSubjectChange(s: Subject) {
    setSubject(s);
    setSelectedSkill(null);
    setGenerateOutput(null);
    setSolveOutput(null);
    setSelectedVideo(null);
    setError(null);
  }

  async function handleSolve(problem: string) {
    setSolveLoading(true);
    setError(null);
    setGenerateOutput(null);
    setSolveOutput(null);
    setSelectedVideo(null);
    setBuiltPacket(null);
    setPacketSent(false);
    setActiveTab("output");

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, subject }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong");
        return;
      }

      setSolveOutput({
        kind: "solve",
        problem: json.problem,
        subject: json.subject,
        wolframVerified: json.wolframVerified,
        ksg: json.ksg,
      });
    } catch {
      setError("Network error — check your connection");
    } finally {
      setSolveLoading(false);
    }
  }

  async function handleGenerate(capability: Capability) {
    if (!selectedSkill) return;
    setGenerateLoading(true);
    setError(null);
    setSolveOutput(null);
    setGenerateOutput(null);
    setActiveTab("output");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability,
          skillId: selectedSkill.id,
          subject,
          options: {
            duration: options.duration,
            difficulty: options.difficulty,
            studentName: options.studentName || undefined,
            studentStrength: options.studentNotes || undefined,
            homeworkAssigned: options.homeworkAssigned || undefined,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong");
        return;
      }

      setGenerateOutput({ kind: "generate", capability: json.capability, data: json.data });
    } catch {
      setError("Network error — check your connection");
    } finally {
      setGenerateLoading(false);
    }
  }

  async function handleBuildPacket() {
    if (!solveOutput) return;
    setPacketLoading(true);
    setBuiltPacket(null);
    setPacketSent(false);
    try {
      const res = await fetch("/api/packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: options.studentName,
          subject,
          problem: solveOutput.problem,
          ksg: solveOutput.ksg,
          wolframVerified: solveOutput.wolframVerified,
          selectedVideo,
          skillName: selectedSkill?.name,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Failed to build packet");
        return;
      }
      const blob = await res.blob();

      // Store base64 so "Send to Student" can post the same PDF
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          resolve(dataUrl.split(",")[1]);
        };
        reader.readAsDataURL(blob);
      });
      const name = (options.studentName || "Student").replace(/\s+/g, "-");
      const filename = `session-packet-${name}.pdf`;
      setBuiltPacket({ base64, filename });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Network error — could not build packet");
    } finally {
      setPacketLoading(false);
    }
  }

  async function handleSendPacket() {
    if (!solveOutput || !builtPacket) return;
    setSendLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/send-packet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_base64: builtPacket.base64,
          pdf_filename: builtPacket.filename,
          studentName: options.studentName || "Student",
          studentEmail: options.studentEmail,
          subject,
          problem: solveOutput.problem,
          problemType: solveOutput.ksg.show.problem_type,
          skillName: selectedSkill?.name,
          wolframVerified: solveOutput.wolframVerified,
          videoTitle: selectedVideo?.title,
          videoUrl: selectedVideo
            ? `https://www.youtube.com/watch?v=${selectedVideo.videoId}`
            : undefined,
          sessionNotes: options.studentNotes || undefined,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to send packet");
        return;
      }
      setPacketSent(true);
    } catch {
      setError("Network error — could not send packet");
    } finally {
      setSendLoading(false);
    }
  }

  const isLoading = solveLoading || generateLoading;
  const hasOutput = solveOutput !== null || generateOutput !== null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <img
          src="https://myedgecenter.com/wp-content/uploads/EDGE_Logo.png"
          alt="The Center at the EDGE"
          className="h-9 w-auto object-contain"
        />
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Tutor View</span>
          <Link
            href="/student"
            target="_blank"
            className="text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded px-3 py-1.5 transition-colors"
          >
            Student View →
          </Link>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left panel — subject + skill search */}
        <aside className="w-64 shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Subject
            </p>
            <div className="flex flex-col gap-0.5">
              {ALL_SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubjectChange(s)}
                  className={`text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                    subject === s
                      ? "bg-edge-navy text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Skill
              </p>
              <SkillSearch
                onSelect={setSelectedSkill}
                selected={selectedSkill}
                selectedSubject={subject}
              />
            </div>

            {selectedSkill && (
              <div className="bg-slate-800 rounded p-3 border border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Active skill</p>
                <p className="text-sm font-semibold text-white">{selectedSkill.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {subject} · {selectedSkill.difficulty}
                </p>
                {selectedSkill.calculatorAllowed && (
                  <span className="mt-2 inline-block text-xs bg-slate-700 text-cyan-400 rounded px-2 py-0.5">
                    Calculator OK
                  </span>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Center panel — generate tools + session options */}
        <aside className="w-56 shrink-0 border-r border-slate-800 p-4 overflow-y-auto flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Generate
            </p>
            <SessionTools
              skill={selectedSkill}
              subject={subject}
              onGenerate={handleGenerate}
              loading={generateLoading}
            />
          </div>
          <SessionOptions values={options} onChange={setOptions} />
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Problem input — always visible above tabs */}
          <div className="px-6 pt-4 pb-3 border-b border-slate-800 shrink-0">
            <ProblemInput
              subject={subject}
              loading={solveLoading}
              onSolve={handleSolve}
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 shrink-0">
  <div className="flex gap-0">
    {(["output", "visual", "video", "strategy"] as const).map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
          activeTab === tab
            ? "border-edge-navy text-white"
            : "border-transparent text-slate-500 hover:text-slate-300"
        }`}
      >
        {TAB_LABELS[tab]}
      </button>
    ))}
  </div>
  {activeTab === "visual" && (
    <button
      onClick={() => setVisualFullscreen(!visualFullscreen)}
      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded px-2 py-1 border border-slate-700"
    >
      {visualFullscreen ? "Exit Fullscreen ✕" : "Expand ⤢"}
    </button>
  )}
</div>

  <div
  className={
    activeTab === "visual"
      ? visualFullscreen
        ? "fixed inset-0 z-50 bg-slate-950 p-3"
        : "flex-1 p-3 relative"
      : "hidden"
  }
>


  {visualToolFor(subject) === "desmos" && <DesmosEmbed />}
  {visualToolFor(subject) === "geogebra" && <GeoGebraEmbed />}
  {visualToolFor(subject) === "none" && (
    <div className="flex items-center justify-center h-full text-slate-500">
      <p className="text-sm">No visual tool for ELA sessions.</p>
    </div>
  )}
</div>

          {/* Video panel — always mounted so selected video survives tab switches */}
          <div className={activeTab === "video" ? "flex-1 overflow-y-auto p-6" : "hidden"}>
            <VideoSearch
              defaultQuery={buildVideoQuery()}
              onSelect={(videoId, title) => setSelectedVideo({ videoId, title })}
            />
          </div>

          {/* Output + Strategy content */}
          <div className={activeTab !== "visual" && activeTab !== "video" ? "flex-1 overflow-y-auto p-6" : "hidden"}>
            {activeTab === "strategy" && <StrategyCards />}

            {activeTab === "output" && (
              <>
                {isLoading && (
                  <div className="flex items-center justify-center h-48">
                    <LoadingState
                      label={
                        solveLoading
                          ? "Solving with Wolfram + Claude…"
                          : `Generating ${selectedSkill?.name ?? ""} resource…`
                      }
                    />
                  </div>
                )}

                {error && !isLoading && (
                  <div className="bg-red-950 border border-red-800 rounded p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {solveOutput && !isLoading && (
                  <>
                    <KSGCard
                      problem={solveOutput.problem}
                      subject={solveOutput.subject}
                      ksg={solveOutput.ksg}
                      wolframVerified={solveOutput.wolframVerified}
                    />
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleBuildPacket}
                        disabled={packetLoading || sendLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-edge-green text-white text-sm font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {packetLoading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Building Packet…
                          </>
                        ) : (
                          builtPacket ? "Rebuild Packet" : "Build Session Packet"
                        )}
                      </button>

                      {builtPacket && !packetSent && (
                        <button
                          onClick={handleSendPacket}
                          disabled={sendLoading || !options.studentEmail}
                          title={!options.studentEmail ? "Add a student email in Session Options" : undefined}
                          className="flex items-center gap-2 px-4 py-2.5 bg-edge-navy text-white text-sm font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                          {sendLoading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending…
                            </>
                          ) : (
                            "Send to Student →"
                          )}
                        </button>
                      )}

                      {packetSent && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-edge-green bg-green-950 border border-green-800 rounded-full px-3 py-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-edge-green" />
                          Sent to {options.studentName || "student"}
                        </span>
                      )}

                      {!options.studentName && !builtPacket && (
                        <p className="text-xs text-slate-500">
                          Add a student name in Session Options to personalize the PDF.
                        </p>
                      )}
                    </div>
                  </>
                )}

                {generateOutput && !isLoading && (
                  <OutputCard
                    capability={generateOutput.capability}
                    data={generateOutput.data}
                  />
                )}

                {!hasOutput && !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-slate-600">
                    <p className="text-4xl select-none">⌗</p>
                    <p className="text-sm">
                      Type a problem above to solve it, or pick a skill and generate a resource
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
