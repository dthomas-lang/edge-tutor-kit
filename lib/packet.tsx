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

const NAVY = "#065078";
const GREEN = "#0D6B40";
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
  bulletText: { flex: 1, fontSize: 9, color: DARK, lineHeight: 1.4 },
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
  stepWork: { fontSize: 9, color: DARK, marginBottom: 4, lineHeight: 1.5 },
  stepWhy: { fontSize: 8, color: MUTED, fontStyle: "italic", lineHeight: 1.4 },
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

type Props = {
  studentName: string;
  subject: string;
  problem: string;
  ksg: KSGOutput;
  wolframVerified: boolean;
  practice: PacketPracticeOutput;
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

export function SessionPacket({
  studentName,
  subject,
  problem,
  ksg,
  wolframVerified,
  practice,
  selectedVideo,
  skillName,
  date,
}: Props) {
  const videoUrl = selectedVideo
    ? `https://www.youtube.com/watch?v=${selectedVideo.videoId}`
    : null;

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
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>Problem Type</Text>
            <Text style={s.metaValue}>{ksg.show.problem_type}</Text>
          </View>
          <View style={s.metaCell}>
            <Text style={s.metaLabel}>Verification</Text>
            <Text style={[s.metaValue, { color: wolframVerified ? GREEN : MUTED }]}>
              {wolframVerified ? "Wolfram Verified" : "Claude Generated"}
            </Text>
          </View>
        </View>

        <View style={[s.divider, { marginTop: 20 }]} />

        <Text style={s.sectionLabel}>Today&apos;s Problem</Text>
        <View style={[s.stepCard, { marginTop: 0 }]}>
          <Text style={{ fontSize: 11, color: DARK, lineHeight: 1.5 }}>{problem}</Text>
        </View>

        <Text style={[s.pageFooterLeft]}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* ── Page 2: KSG Summary ── */}
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Know · Show · Grow</Text>

        {/* KNOW */}
        <View style={s.ksgBlock}>
          <View style={[s.ksgHeader, { backgroundColor: NAVY }]}>
            <Text style={s.ksgHeaderText}>KNOW — Prerequisites &amp; Vocabulary</Text>
          </View>
          <View style={s.ksgBody}>
            {ksg.know.prerequisites.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={[s.sectionLabel, { marginBottom: 4 }]}>Prerequisites</Text>
                {ksg.know.prerequisites.map((p, i) => (
                  <View key={i} style={s.bulletRow}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={s.bulletText}>{p}</Text>
                  </View>
                ))}
              </View>
            )}
            {ksg.know.key_vocabulary.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={[s.sectionLabel, { marginBottom: 4 }]}>Key Vocabulary</Text>
                {ksg.know.key_vocabulary.map((v, i) => (
                  <View key={i} style={s.termRow}>
                    <Text style={s.termBold}>{v.term}:</Text>
                    <Text style={s.termDef}>{v.definition}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={s.watchOutBox}>
              <Text style={s.watchOutLabel}>Watch Out For</Text>
              <Text style={s.watchOutText}>{ksg.know.watch_out_for}</Text>
            </View>
          </View>
        </View>

        {/* GROW */}
        <View style={s.ksgBlock}>
          <View style={[s.ksgHeader, { backgroundColor: GREEN }]}>
            <Text style={s.ksgHeaderText}>GROW — Key Takeaway &amp; Connections</Text>
          </View>
          <View style={s.ksgBody}>
            <Text style={[s.bulletText, { marginBottom: 8, fontFamily: "Helvetica-Bold" }]}>
              {ksg.grow.key_takeaway}
            </Text>
            {ksg.grow.connections.map((c, i) => (
              <View key={i} style={s.bulletRow}>
                <Text style={s.bullet}>→</Text>
                <Text style={s.bulletText}>{c}</Text>
              </View>
            ))}
            <View style={[s.divider, { marginTop: 8 }]} />
            <Text style={[s.sectionLabel, { marginBottom: 3 }]}>Next Challenge</Text>
            <Text style={{ fontSize: 9, color: DARK }}>{ksg.grow.next_challenge}</Text>
          </View>
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* ── Page 3: Worked Solution ── */}
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Step-by-Step Solution</Text>

        {ksg.show.steps.map((step, i) => (
          <View key={i} style={s.stepCard}>
            <View style={s.stepHeader}>
              <Text style={s.stepBadge}>Step {i + 1}</Text>
              <Text style={s.stepAction}>{step.step}</Text>
            </View>
            <Text style={s.stepWork}>{step.work}</Text>
            <Text style={s.stepWhy}>{step.why}</Text>
          </View>
        ))}

        <View style={s.answerBox}>
          <Text style={s.answerLabel}>Final Answer</Text>
          <Text style={s.answerText}>{ksg.show.final_answer}</Text>
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* ── Page 4: Practice Problems + Answer Key ── */}
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Practice Problems</Text>

        {practice.problems.map((prob, i) => (
          <View key={i} style={s.problemCard}>
            <View style={s.problemHeader}>
              <Text style={s.problemNum}>Problem {i + 1}</Text>
            </View>
            <View style={s.problemBody}>
              <Text style={s.problemQ}>{prob.question}</Text>
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
                {prob.answer}
                {prob.explanation ? `  —  ${prob.explanation}` : ""}
              </Text>
            </View>
          ))}
        </View>

        <Text style={s.pageFooterLeft}>The Center at the EDGE · theEDGEgroup.com</Text>
        <Text style={s.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>

      {/* ── Page 5: Resources ── */}
      <Page size="LETTER" style={s.page}>
        <PageHeader studentName={studentName} subject={subject} date={date} />

        <Text style={s.sectionLabel}>Session Resources</Text>

        {videoUrl && selectedVideo && (
          <View style={s.resourceCard}>
            <Text style={s.resourceTitle}>Recommended Video</Text>
            <Text style={s.resourceSub}>{selectedVideo.title}</Text>
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
