import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  pdf_base64: string;
  pdf_filename: string;
  studentName: string;
  studentEmail: string;
  subject: string;
  problem: string;
  problemType: string;
  skillName?: string;
  wolframVerified: boolean;
  /** First video only — kept so the existing n8n email template still works. */
  videoTitle?: string;
  videoUrl?: string;
  /** Every video attached to the session, in the order the tutor added them. */
  videos?: { topic: string; title: string; url: string }[];
  sessionNotes?: string;
  date: string;
};

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl === "REPLACE_ME") {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL is not configured — set it in .env.local" },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.pdf_base64) {
    return NextResponse.json({ error: "Missing pdf_base64" }, { status: 400 });
  }
  if (!body.studentEmail) {
    return NextResponse.json({ error: "Student email is required to send the packet" }, { status: 400 });
  }

  let n8nRes: Response;
  try {
    n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("n8n webhook fetch failed:", err);
    return NextResponse.json({ error: "Could not reach n8n" }, { status: 502 });
  }

  if (!n8nRes.ok) {
    const text = await n8nRes.text().catch(() => "");
    console.error("n8n webhook error:", n8nRes.status, text);
    return NextResponse.json(
      { error: `n8n webhook returned ${n8nRes.status}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
