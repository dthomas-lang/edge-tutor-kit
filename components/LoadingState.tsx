"use client";

type Props = {
  label?: string;
};

export default function LoadingState({ label = "Generating..." }: Props) {
  return (
    <div className="flex items-center gap-3 py-8 px-4">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
      </div>
      <span className="text-slate-400 text-sm font-medium">{label}</span>
    </div>
  );
}
