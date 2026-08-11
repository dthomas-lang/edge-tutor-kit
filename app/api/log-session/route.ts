import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  date: string;
  studentName: string;
  studentEmail?: string;
  subject: string;
  skillName?: string;
  problemType: string;
  capability: string;
  duration?: number;
  difficulty?: string;
  wolframVerified?: boolean;
  homeworkAssigned?: string;
  sessionNotes?: string;
};

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_SESSION_LOG_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl === "REPLACE_ME") {
    return NextResponse.json(
      { error: "N8N_SESSION_LOG_WEBHOOK_URL is not configured — set it in .env.local" },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.studentName) {
    return NextResponse.json({ error: "studentName is required" }, { status: 400 });
  }

  let n8nRes: Response;
  try {
    n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("n8n session-log webhook fetch failed:", err);
    return NextResponse.json({ error: "Could not reach n8n" }, { status: 502 });
  }

  if (!n8nRes.ok) {
    const text = await n8nRes.text().catch(() => "");
    console.error("n8n session-log webhook error:", n8nRes.status, text);
    return NextResponse.json(
      { error: `n8n webhook returned ${n8nRes.status}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
