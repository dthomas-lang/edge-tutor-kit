import { NextRequest, NextResponse } from "next/server";

export type VideoResult = {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "5",
    safeSearch: "strict",
    q: query,
    key: apiKey,
  });

  const ytRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
  );

  if (!ytRes.ok) {
    const body = await ytRes.text();
    console.error("YouTube API error:", body);
    return NextResponse.json({ error: "YouTube search failed" }, { status: 502 });
  }

  const json = await ytRes.json();

  const results: VideoResult[] = (json.items ?? []).map(
    (item: {
      id: { videoId: string };
      snippet: {
        title: string;
        thumbnails: { medium?: { url: string }; default?: { url: string } };
        channelTitle: string;
      };
    }) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        "",
      channelTitle: item.snippet.channelTitle,
    })
  );

  return NextResponse.json({ results });
}
