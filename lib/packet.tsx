import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { KSGOutput, PacketPracticeOutput } from "./schemas";
import { CAPABILITY_LABELS, type Capability } from "@/types";

// The PDF is built with the base Helvetica font, which only supports plain
// ASCII/WinAnsi text — it cannot render KaTeX/LaTeX markup or arbitrary
// Unicode glyphs (checkmarks, em dashes, etc). Generated content is written
// with LaTeX math for on-screen KaTeX rendering, so it must be de-LaTeX-ified
// and stripped of unsupported characters before it goes into a <Text> node,
// otherwise it renders as literal backslash syntax or garbled/overlapping text.
function clean(input: string): string {
  let s = input;

  s = s.replace(/\\(?:text|mathrm|mathbf)\{([^{}]*)\}/g, "$1");
  for (let i = 0; i < 2; i++) {
    s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)");
  }
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, "sqrt($1)");
  s = s.replace(/\\sqrt/g, "sqrt");
  s = s.replace(/\\left|\\right/g, "");

  const symbolMap: [RegExp, string][] = [
    [/\\quad/g, "  "],
    [/\\,/g, " "],
    [/\\cdot/g, "*"],
    [/\\times/g, "x"],
    [/\\div/g, "/"],
    [/\\pm/g, "+/-"],
    [/\\mp/g, "-/+"],
    [/\\neq/g, "!="],
    [/\\leq/g, "<="],
    [/\\geq/g, ">="],
    [/\\approx/g, "~="],
    [/\\infty/g, "infinity"],
    [/\\pi/g, "pi"],
    [/\\theta/g, "theta"],
    [/\\degree/g, " deg"],
    [/\\Rightarrow/g, "=>"],
    [/\\rightarrow/g, "->"],
  ];
  for (const [re, rep] of symbolMap) s = s.replace(re, rep);

  s = s.replace(/\^\{([^{}]*)\}/g, "^$1");
  s = s.replace(/_\{([^{}]*)\}/g, "_$1");

  // any remaining backslash-commands and stray braces/backslashes/dollar signs
  s = s.replace(/\\[a-zA-Z]+/g, "");
  s = s.replace(/[{}\\]/g, "");
  s = s.replace(/\$\$?/g, "");

  // common Unicode punctuation -> ASCII-safe equivalents
  s = s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .replace(/÷/g, "/")
    .replace(/±/g, "+/-")
    .replace(/✓/g, "OK")
    .replace(/≠/g, "!=")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=");

  // final safety net: strip anything outside printable ASCII (prevents any
  // other unsupported glyph from reaching the PDF and corrupting layout)
  s = s.replace(/[^\x20-\x7E\n]/g, "");
  s = s.replace(/[ \t]{2,}/g, " ").trim();

  return s;
}

const NAVY = "#065078";
const GREEN = "#0D6B40";
const AMBER = "#B45309";
const LIGHT_BG = "#F8FAFC";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const DARK = "#0F172A";

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    backgroundColor: "#FFFFFF",
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 48,
  },
  // Header stripe
  headerStripe: {
    backgroundColor: NAVY,
    marginHorizontal: -48,
    marginTop: -36,
    paddingHorizontal: 48,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  logo: { width: 80, height: 28, objectFit: "contain" },
  headerRight: { alignItems: "flex-end" },
  headerLabel: { fontSize: 8, color: "#93C5FD", letterSpacing: 1, textTransform: "uppercase" },
  headerValue: { fontSize: 11, color: "#FFFFFF", fontFamily: "Helvetica-Bold", marginTop: 2 },
  // Section headings
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  // KSG blocks
  ksgBlock: {
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  ksgHeader: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  ksgHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  ksgBody: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: LIGHT_BG,
    border: `1 solid ${BORDER}`,
    borderTopWidth: 0,
    borderRadius: 4,
  },
  bulletRow: { flexDirection: "row", marginBottom: 4 },
  bullet: { width: 12, color: MUTED, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, color: DARK },
  termRow: { flexDirection: "row", marginBottom: 4, flexWrap: "wrap" },
  termBold: { fontFamily: "Helvetica-Bold", fontSize: 9, marginRight: 4 },
  termDef: { fontSize: 9, color: MUTED, flex: 1 },
  // Steps
  stepCard: {
    backgroundColor: LIGHT_BG,
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    marginBottom: 8,
    padding: 10,
  },
  stepHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  stepBadge: {
    backgroundColor: NAVY,
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  stepAction: { fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK },
  stepWork: { fontSize: 9, color: DARK, marginBottom: 4 },
  stepWhy: { fontSize: 8, color: MUTED, fontStyle: "italic" },
  // Answer highlight
  answerBox: {
    backgroundColor: "#DCFCE7",
    border: `1 solid #86EFAC`,
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  answerLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: GREEN, marginRight: 6 },
  answerText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: GREEN },
  // Practice problems
  problemCard: {
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  problemHeader: {
    backgroundColor: NAVY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  problemNum: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  problemBody: { padding: 10, backgroundColor: LIGHT_BG },
  problemQ: { fontSize: 10, color: DARK, marginBottom: 12 },
  answerKeyDivider: {
    borderTop: `1 dashed ${BORDER}`,
    marginTop: 16,
    paddingTop: 12,
  },
  answerKeyLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: MUTED,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  answerKeyRow: { flexDirection: "row", marginBottom: 4 },
  answerKeyNum: { width: 20, fontSize: 9, fontFamily: "Helvetica-Bold", color: DARK },
  answerKeyText: { flex: 1, fontSize: 9, color: DARK },
  // Generated-resource pages (Teaching Guide, Worked Example, etc.)
  resourceHeader: {
    backgroundColor: AMBER,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resourceHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  para: { fontSize: 9, color: DARK, marginBottom: 8, lineHeight: 1.4 },
  qaBlock: {
    backgroundColor: LIGHT_BG,
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  qaQuestion: { fontSize: 9, color: DARK, marginBottom: 4 },
  qaAnswer: { fontSize: 9, fontFamily: "Helvetica-Bold", color: GREEN, marginBottom: 2 },
  qaExplanation: { fontSize: 8, color: MUTED },
  // Resources page
  resourceCard: {
    backgroundColor: LIGHT_BG,
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
  },
  resourceTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: DARK, marginBottom: 4 },
  resourceSub: { fontSize: 9, color: MUTED, marginBottom: 8 },
  linkText: { fontSize: 9, color: NAVY, textDecoration: "underline" },
  // Cover page extras
  coverTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 6,
  },
  coverSub: { fontSize: 12, color: MUTED, marginBottom: 24 },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  metaCell: {
    backgroundColor: LIGHT_BG,
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    padding: 10,
    minWidth: 120,
    flex: 1,
  },
  metaLabel: { fontSize: 7, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 },
  metaValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: DARK },
  pageNumber: {
    position: "absolute",
    bottom: 18,
    right: 48,
    fontSize: 8,
    color: MUTED,
  },
  pageFooterLeft: {
    position: "absolute",
    bottom: 18,
    left: 48,
    fontSize: 8,
    color: MUTED,
  },
  divider: { borderTop: `1 solid ${BORDER}`, marginVertical: 14 },
  watchOutBox: {
    backgroundColor: "#FEF9C3",
    border: `1 solid #FDE047`,
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  watchOutLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#854D0E", marginBottom: 2 },
  watchOutText: { fontSize: 9, color: "#713F12" },
});

type SolveData = {
  problem: string;
  ksg: KSGOutput;
  wolframVerified: boolean;
};

export type PacketResourceItem = {
  capability: Capability;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  wolframVerified: boolean;
};

type Props = {
  studentName: string;
  subject: string;
  solve?: SolveData | null;
  practice?: PacketPracticeOutput | null;
  resources: PacketResourceItem[];
  selectedVideo: { videoId: string; title: string } | null;
  skillName?: string;
  date: string;
};

function PageHeader({
  studentName,
  subject,
  date,
}: {
  studentName: string;
  subject: string;
  date: string;
}) {
  return (
    <View style={s.headerStripe}>
      <Image
        src="https://myedgecenter.com/wp-content/uploads/EDGE_Logo.png"
        style={s.logo}
      />
      <View style={s.headerRight}>
        <Text style={s.headerLabel}>Student</Text>
        <Text style={s.headerValue}>{studentName || "Student"}</Text>
      </View>
      <View style={s.headerRight}>
        <Text style={s.headerLabel}>Subject</Text>
        <Text style={s.headerValue}>{subject}</Text>
      </View>
      <View style={s.headerRight}>
        <Text style={s.headerLabel}>Date</Text>
        <Text style={s.headerValue}>{date}</Text>
      </View>
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bullet}>•</Text>
          <Text style={s.bulletText}>{clean(item)}</Text>
        </View>
      ))}
    </>
  );
}

function NumberedItems({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <View key={i} style={s.answerKeyRow}>
          <Text style={s.answerKeyNum}>{i + 1}.</Text>
          <Text style={s.answerKeyText}>{clean(item)}</Text>
        </View>
      ))}
    </>
  );
}

function QA({ q, a, explanation }: { q: string; a: string; explanation?: string }) {
  return (
    <View style={s.qaBlock}>
      <Text style={s.qaQuestion}>{clean(q)}</Text>
      <Text style={s.qaAnswer}>Answer: {clean(a)}</Text>
      {explanation && <Text style={s.qaExplanation}>{clean(explanation)}</Text>}
    </View>
  );
}

// A generated capability resource (Teaching Guide, Worked Example, etc.) can be
// any of 8 different shapes — dispatch per-capability rather than assuming one.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderResourceBody(capability: Capability, data: Record<string, any>) {
  switch (capability) {
    case "teachingGuide":
      return (
        <>
          <Text style={s.sectionLabel}>Concept Overview</Text>
          <Text style={s.para}>{clean(data.concept_overview)}</Text>
          <Text style={s.sectionLabel}>Simple Explanation</Text>
          <Text style={s.para}>{clean(data.simple_explanation)}</Text>
          <Text style={s.sectionLabel}>Common Misconceptions</Text>
          <Bullets items={data.common_misconceptions} />
          <Text style={[s.sectionLabel, { marginTop: 8 }]}>Tutor Talking Points</Text>
          <Bullets items={data.tutor_talking_points} />
        </>
      );
    case "workedExample":
      return (
        <>
          <Text style={s.sectionLabel}>Problem</Text>
          <View style={[s.stepCard, { marginTop: 0 }]}>
            <Text style={{ fontSize: 10, color: DARK }}>{clean(data.problem)}</Text>
          </View>
          <Text style={s.sectionLabel}>Step-by-Step Solution</Text>
          <NumberedItems items={data.step_by_step} />
          <View style={[s.answerBox, { marginTop: 8 }]}>
            <Text style={s.answerLabel}>Final Answer</Text>
            <Text style={s.answerText}>{clean(data.final_answer)}</Text>
          </View>
          {data.tutor_note && (
            <Text style={[s.para, { marginTop: 8, fontStyle: "italic", color: MUTED }]}>
              {clean(data.tutor_note)}
            </Text>
          )}
        </>
      );
    case "practiceSet":
      return (
        <>
          {(["easy", "medium", "hard"] as const).map((tier) => (
            <View key={tier} style={{ marginBottom: 8 }}>
              <Text style={s.sectionLabel}>{tier}</Text>
              {(data[tier] as { question: string; answer: string; explanation: string }[]).map(
                (q, i) => (
                  <QA key={i} q={q.question} a={q.answer} explanation={q.explanation} />
                )
              )}
            </View>
          ))}
        </>
      );
    case "miniLesson":
      return (
        <>
          <Text style={s.sectionLabel}>Objective</Text>
          <Text style={s.para}>{clean(data.objective)}</Text>
          <Text style={s.sectionLabel}>Opening Hook</Text>
          <Text style={[s.para, { fontStyle: "italic" }]}>{clean(data.opening_hook)}</Text>
          <Text style={s.sectionLabel}>Instruction Steps</Text>
          <NumberedItems items={data.instruction_steps} />
          <Text style={[s.sectionLabel, { marginTop: 8 }]}>Check for Understanding</Text>
          <View style={[s.stepCard, { marginTop: 0 }]}>
            <Text style={{ fontSize: 9, color: DARK }}>{clean(data.check_for_understanding)}</Text>
          </View>
          <Text style={s.sectionLabel}>Closing</Text>
          <Text style={s.para}>{clean(data.closing)}</Text>
        </>
      );
    case "exitTicket":
      return (
        <>
          {(data.questions as { question: string; answer: string }[]).map((q, i) => (
            <QA key={i} q={q.question} a={q.answer} />
          ))}
        </>
      );
    case "homework":
      return (
        <>
          <Text style={s.sectionLabel}>Skill Focus</Text>
          <Text style={s.para}>{clean(data.skill_focus)}</Text>
          <Text style={s.sectionLabel}>Instructions</Text>
          <Text style={s.para}>{clean(data.instructions)}</Text>
          <Text style={s.sectionLabel}>Questions</Text>
          {(data.questions as { question: string; answer: string; explanation: string }[]).map(
            (q, i) => (
              <QA key={i} q={q.question} a={q.answer} explanation={q.explanation} />
            )
          )}
        </>
      );
    case "parentUpdate":
      return (
        <>
          <Text style={s.sectionLabel}>Student Strength</Text>
          <Text style={s.para}>{clean(data.student_strength)}</Text>
          <Text style={s.sectionLabel}>Main Gap</Text>
          <Text style={s.para}>{clean(data.main_gap)}</Text>
          <Text style={s.sectionLabel}>Skills Practiced</Text>
          <Bullets items={data.skills_practiced} />
          <Text style={[s.sectionLabel, { marginTop: 8 }]}>Homework Assigned</Text>
          <Text style={s.para}>{clean(data.homework_assigned)}</Text>
          <Text style={s.sectionLabel}>Encouragement Note</Text>
          <Text style={[s.para, { fontStyle: "italic" }]}>{clean(data.encouragement_note)}</Text>
        </>
      );
    case "progressNote":
      return (
        <>
          <Text style={s.sectionLabel}>Session Summary</Text>
          <Text style={s.para}>{clean(data.session_summary)}</Text>
          <Text style={s.sectionLabel}>Concepts Covered</Text>
          <Bullets items={data.concepts_covered} />
          <Text style={[s.sectionLabel, { marginTop: 8 }]}>Student Performance</Text>
          <Text style={s.para}>{clean(data.student_performance)}</Text>
          <Text style={s.sectionLabel}>Next Steps</Text>
          <Text style={s.para}>{clean(data.next_steps)}</Text>
        </>
      );
  }
}

export function SessionPacket({
  studentName,
  subject,
  solve,
  practice,
  resources,
  selectedVideo,
  skillName,
  date,
}: Props) {
  const videoUrl = selectedVideo
    ? `https://www.youtube.com/watch?v=${selectedVideo.videoId}`
    : null;
  const anyVerified = Boolean(solve?.wolframVerified) || resources.some((r) => r.wolframVerified);

  return (
    <Document
      title={`Session Packet — ${studentName || "Student"} — ${date}`}
      author="The Center at the EDGE"
    >
      {/* ── Page 1: Cover ── */}
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.coverTitle}>Session Packet</Text>
        <Text style={s.coverSub}>The Center at the EDGE · Academic Coaching</Text>

        <View style={s.metaGrid}>
          {skillName && (
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Skill</Text>
              <Text style={s.metaValue}>{skillName}</Text>
            </View>
          )}
          {solve && (
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Problem Type</Text>
              <Text style={s.metaValue}>{clean(solve.ksg.show.problem_type)}</Text>
            </View>
          )}
          {resources.length > 0 && (
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Resources</Text>
              <Text style={s.metaValue}>{resources.length}</Text>
            </View>
          )}
          {anyVerified && (
            <View style={s.metaCell}>
              <Text style={s.metaLabel}>Verification</Text>
              <Text style={[s.metaValue, { color: GREEN }]}>Wolfram Verified</Text>
            </View>
          )}
        </View>

        <View style={[s.divider, { marginTop: 20 }]} />

        {solve && (
          <>
            <Text style={s.sectionLabel}>Today&apos;s Problem</Text>
            <View style={[s.stepCard, { marginTop: 0 }]}>
              <Text style={{ fontSize: 11, color: DARK }}>{clean(solve.problem)}</Text>
            </View>
          </>
        )}

        {!solve && resources.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Resources Covered This Session</Text>
            <View style={[s.stepCard, { marginTop: 0 }]}>
              {resources.map((r, i) => (
                <View key={i} style={s.bulletRow}>
                  <Text style={s.bullet}>•</Text>
                  <Text style={s.bulletText}>{CAPABILITY_LABELS[r.capability]}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={[s.pageFooterLeft]}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* ── Page 2: KSG Summary (Solve flow only) ── */}
      {solve && (
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Know · Show · Grow</Text>

        {/* KNOW */}
        <View style={s.ksgBlock}>
          <View style={[s.ksgHeader, { backgroundColor: NAVY }]}>
            <Text style={s.ksgHeaderText}>KNOW — Prerequisites &amp; Vocabulary</Text>
          </View>
          <View style={s.ksgBody}>
            {solve.ksg.know.prerequisites.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={[s.sectionLabel, { marginBottom: 4 }]}>Prerequisites</Text>
                {solve.ksg.know.prerequisites.map((p, i) => (
                  <View key={i} style={s.bulletRow}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={s.bulletText}>{clean(p)}</Text>
                  </View>
                ))}
              </View>
            )}
            {solve.ksg.know.key_vocabulary.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={[s.sectionLabel, { marginBottom: 4 }]}>Key Vocabulary</Text>
                {solve.ksg.know.key_vocabulary.map((v, i) => (
                  <View key={i} style={s.termRow}>
                    <Text style={s.termBold}>{clean(v.term)}:</Text>
                    <Text style={s.termDef}>{clean(v.definition)}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={s.watchOutBox}>
              <Text style={s.watchOutLabel}>Watch Out For</Text>
              <Text style={s.watchOutText}>{clean(solve.ksg.know.watch_out_for)}</Text>
            </View>
          </View>
        </View>

        {/* GROW */}
        <View style={s.ksgBlock}>
          <View style={[s.ksgHeader, { backgroundColor: GREEN }]}>
            <Text style={s.ksgHeaderText}>GROW — Key Takeaway &amp; Connections</Text>
          </View>
          <View style={s.ksgBody}>
            <Text style={{ fontSize: 9, color: DARK, marginBottom: 8, fontFamily: "Helvetica-Bold" }}>
              {clean(solve.ksg.grow.key_takeaway)}
            </Text>
            {solve.ksg.grow.connections.map((c, i) => (
              <View key={i} style={s.bulletRow}>
                <Text style={s.bullet}>{"->"}</Text>
                <Text style={s.bulletText}>{clean(c)}</Text>
              </View>
            ))}
            <View style={[s.divider, { marginTop: 8 }]} />
            <Text style={[s.sectionLabel, { marginBottom: 3 }]}>Next Challenge</Text>
            <Text style={{ fontSize: 9, color: DARK }}>{clean(solve.ksg.grow.next_challenge)}</Text>
          </View>
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
      )}

      {/* ── Page 3: Worked Solution (Solve flow only) ── */}
      {solve && (
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Step-by-Step Solution</Text>

        {solve.ksg.show.steps.map((step, i) => (
          <View key={i} style={s.stepCard}>
            <View style={s.stepHeader}>
              <Text style={s.stepBadge}>Step {i + 1}</Text>
              <Text style={s.stepAction}>{clean(step.step)}</Text>
            </View>
            <Text style={s.stepWork}>{clean(step.work)}</Text>
            <Text style={s.stepWhy}>{clean(step.why)}</Text>
          </View>
        ))}

        <View style={s.answerBox}>
          <Text style={s.answerLabel}>Final Answer</Text>
          <Text style={s.answerText}>{clean(solve.ksg.show.final_answer)}</Text>
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
      )}

      {/* ── Page 4: Practice Problems + Answer Key (Solve flow only) ── */}
      {solve && practice && (
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Practice Problems</Text>

        {practice.problems.map((prob, i) => (
          <View key={i} style={s.problemCard}>
            <View style={s.problemHeader}>
              <Text style={s.problemNum}>Problem {i + 1}</Text>
            </View>
            <View style={s.problemBody}>
              <Text style={s.problemQ}>{clean(prob.question)}</Text>
              {/* blank work area lines */}
              {[0, 1, 2].map((l) => (
                <View key={l} style={{ borderTop: `1 solid ${BORDER}`, marginBottom: 14 }} />
              ))}
            </View>
          </View>
        ))}

        {/* Answer Key — dashed separator so tutor can fold/tear if desired */}
        <View style={s.answerKeyDivider}>
          <Text style={s.answerKeyLabel}>Answer Key</Text>
          {practice.problems.map((prob, i) => (
            <View key={i} style={s.answerKeyRow}>
              <Text style={s.answerKeyNum}>{i + 1}.</Text>
              <Text style={s.answerKeyText}>
                {clean(prob.answer)}
                {prob.explanation ? `  -  ${clean(prob.explanation)}` : ""}
              </Text>
            </View>
          ))}
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
      )}

      {/* ── Generated resource pages — one per Generate-tool result from the session ── */}
      {resources.map((resource, i) => (
        <Page key={i} size="LETTER" style={s.page}>
          <PageHeader studentName={studentName} subject={subject} date={date} />

          <View style={s.resourceHeader}>
            <Text style={s.resourceHeaderText}>{CAPABILITY_LABELS[resource.capability]}</Text>
            {resource.wolframVerified && (
              <Text style={[s.resourceHeaderText, { marginLeft: "auto" }]}>Wolfram Verified</Text>
            )}
          </View>

          {renderResourceBody(resource.capability, resource.data)}

          <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
          <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </Page>
      ))}

      {/* ── Final page: Tools & Links ── */}
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Tools &amp; Links</Text>

        {videoUrl && selectedVideo && (
          <View style={s.resourceCard}>
            <Text style={s.resourceTitle}>Recommended Video</Text>
            <Text style={s.resourceSub}>{clean(selectedVideo.title)}</Text>
            <Link src={videoUrl} style={s.linkText}>
              {videoUrl}
            </Link>
          </View>
        )}

        {!videoUrl && (
          <View style={s.resourceCard}>
            <Text style={s.resourceTitle}>Recommended Video</Text>
            <Text style={[s.resourceSub, { marginBottom: 0 }]}>
              No video was selected for this session.
            </Text>
          </View>
        )}

        <View style={s.resourceCard}>
          <Text style={s.resourceTitle}>Interactive Visual</Text>
          <Text style={s.resourceSub}>
            {subject === "Geometry"
              ? "Practice with GeoGebra Geometry"
              : subject === "ELA"
              ? "No calculator tool for ELA sessions."
              : "Practice graphing with Desmos"}
          </Text>
          {subject !== "ELA" && (
            <Link
              src={
                subject === "Geometry"
                  ? "https://www.geogebra.org/geometry"
                  : "https://www.desmos.com/calculator"
              }
              style={s.linkText}
            >
              {subject === "Geometry"
                ? "www.geogebra.org/geometry"
                : "www.desmos.com/calculator"}
            </Link>
          )}
        </View>

        <View style={s.resourceCard}>
          <Text style={s.resourceTitle}>About The Center at the EDGE</Text>
          <Text style={s.resourceSub}>
            K-12 academic coaching and test prep in Metro Atlanta.
          </Text>
          <Link src="https://myedgecenter.com" style={s.linkText}>
            myedgecenter.com
          </Link>
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
}
