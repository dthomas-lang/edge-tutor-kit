"use client";

import { useState, useEffect, useRef } from "react";
import type { VideoResult } from "@/app/api/videos/route";
import type { SessionVideo } from "@/types";

type Props = {
  defaultQuery: string;
  /** The topic the current output is about — pre-fills the label on newly added videos. */
  currentTopic: string;
  videos: SessionVideo[];
  onAdd: (video: VideoResult, topic: string) => void;
  onRemove: (id: string) => void;
};

export default function VideoSearch({
  defaultQuery,
  currentTopic,
  videos,
  onAdd,
  onRemove,
}: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<VideoResult[]>([]);
  const [preview, setPreview] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAutoQuery = useRef<string>("");

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setPreview(null);

    try {
      const res = await fetch(`/api/videos?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Search failed");
        return;
      }
      setResults(json.results ?? []);
    } catch {
      setError("Network error — check your connection");
    } finally {
      setLoading(false);
    }
  }

  // Auto-search when defaultQuery changes (new solve/skill context)
  useEffect(() => {
    if (defaultQuery && defaultQuery !== lastAutoQuery.current) {
      lastAutoQuery.current = defaultQuery;
      setQuery(defaultQuery);
      search(defaultQuery);
    }
  }, [defaultQuery]);

  // The topic label a newly added video gets. Falls back to the search query so
  // a tutor who searched off-topic still ends up with a meaningful PDF heading.
  const topicForAdd = currentTopic.trim() || query.trim() || "Session topic";

  function handleAdd(video: VideoResult) {
    onAdd(video, topicForAdd);
  }

  const addedVideoIds = new Set(videos.map((v) => v.videoId));

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search bar */}
      <div className="flex gap-2 shrink-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search(query)}
          placeholder="Search YouTube for a tutorial…"
          className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-edge-navy"
        />
        <button
          onClick={() => search(query)}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-edge-navy text-white text-sm font-medium rounded hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded px-3 py-2 shrink-0">
          {error}
        </p>
      )}

      {/* Videos already attached to this session */}
      {videos.length > 0 && (
        <div className="shrink-0 border border-slate-700 rounded-lg bg-slate-900 p-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            In this session · {videos.length}
          </p>
          <ul className="flex flex-col gap-2">
            {videos.map((v) => (
              <li key={v.id} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-cyan-400 truncate">{v.topic}</p>
                  <p className="text-sm text-slate-200 leading-tight line-clamp-2">
                    {v.title}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(v.id)}
                  aria-label={`Remove ${v.title}`}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors shrink-0 px-1"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview player */}
      {preview && (
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Preview
            </p>
            <button
              onClick={() => setPreview(null)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Results
            </button>
          </div>
          <div className="rounded overflow-hidden bg-black aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${preview.videoId}?rel=0`}
              title={preview.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 line-clamp-2">
                {preview.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{preview.channelTitle}</p>
            </div>
            <button
              onClick={() => handleAdd(preview)}
              className="shrink-0 px-3 py-1.5 bg-edge-green text-white text-xs font-semibold rounded hover:opacity-90 transition-opacity"
            >
              + Add to session
            </button>
          </div>
        </div>
      )}

      {/* Results list */}
      {!preview && !loading && results.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs text-slate-500 mb-2">
            Adding as: <span className="text-cyan-400">{topicForAdd}</span>
          </p>
          <div className="flex flex-col gap-3">
            {results.map((video) => {
              const added = addedVideoIds.has(video.videoId);
              return (
                <div
                  key={video.videoId}
                  className="flex gap-3 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setPreview(video)}
                    className="flex gap-3 text-left min-w-0 flex-1 hover:bg-slate-700 transition-colors"
                  >
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="w-32 h-[72px] object-cover shrink-0"
                    />
                    <div className="flex flex-col justify-center gap-1 py-2 min-w-0">
                      <p className="text-sm font-medium text-slate-200 line-clamp-2 leading-tight">
                        {video.title}
                      </p>
                      <p className="text-xs text-slate-500">{video.channelTitle}</p>
                    </div>
                  </button>
                  <div className="flex items-center pr-3 shrink-0">
                    <button
                      onClick={() => handleAdd(video)}
                      disabled={added}
                      title={added ? "Already in this session" : "Add to session"}
                      className="px-3 py-1.5 bg-edge-green text-white text-xs font-semibold rounded hover:opacity-90 disabled:opacity-40 disabled:cursor-default transition-opacity"
                    >
                      {added ? "Added ✓" : "+ Add"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex gap-3 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
            >
              <div className="w-32 h-[72px] bg-slate-700 shrink-0 animate-pulse" />
              <div className="flex flex-col justify-center gap-2 py-2 pr-3 flex-1">
                <div className="h-3.5 bg-slate-700 rounded w-4/5 animate-pulse" />
                <div className="h-3 bg-slate-700 rounded w-2/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && !preview && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-slate-600">
          <p className="text-3xl select-none">▶</p>
          <p className="text-sm">
            {defaultQuery
              ? "Searching for a relevant video…"
              : "Search for a tutorial video to share with your student"}
          </p>
        </div>
      )}
    </div>
  );
}
