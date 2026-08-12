// Wolfram Alpha's "llm-api" endpoint takes a natural-language math query and
// returns a short, plain-text authoritative answer — used both to verify a
// tutor-entered problem (app/api/solve) and to independently check Claude's
// own generated problems before they go into student-facing materials
// (app/api/generate, app/api/packet).
export async function callWolfram(problem: string): Promise<string | null> {
  const appId = process.env.WOLFRAM_APP_ID;
  if (!appId) return null;

  try {
    const url = `https://www.wolframalpha.com/api/v1/llm-api?input=${encodeURIComponent(problem)}&appid=${appId}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim() || null;
  } catch {
    return null;
  }
}

export type WolframCheck = { problem: string; wolframAnswer: string | null };

// Best-effort, run in parallel: some problems (word problems, ELA content)
// may not be parseable by Wolfram — those come back with wolframAnswer: null
// and are simply left unverified rather than failing the whole batch.
export async function verifyProblemsWithWolfram(problems: string[]): Promise<WolframCheck[]> {
  return Promise.all(
    problems.map(async (problem) => ({ problem, wolframAnswer: await callWolfram(problem) }))
  );
}
