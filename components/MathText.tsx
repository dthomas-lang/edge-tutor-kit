"use client";

import katex from "katex";

// Splits on $$...$$ (block) and $...$ (inline) delimiters, rendering each
// math segment with KaTeX and leaving everything else as plain text.
const MATH_SPLIT = /(\$\$[^$]+\$\$|\$[^$\n]+\$)/g;

function renderSegment(segment: string, key: number) {
  const isBlock = segment.startsWith("$$") && segment.endsWith("$$");
  const isInline = !isBlock && segment.startsWith("$") && segment.endsWith("$");

  if (!isBlock && !isInline) {
    return <span key={key}>{segment}</span>;
  }

  const expr = isBlock ? segment.slice(2, -2) : segment.slice(1, -1);

  let html: string;
  try {
    html = katex.renderToString(expr, {
      throwOnError: false,
      displayMode: isBlock,
    });
  } catch {
    return <span key={key}>{segment}</span>;
  }

  return isBlock ? (
    <span
      key={key}
      className="block my-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

type Props = {
  text: string;
  className?: string;
};

export default function MathText({ text, className }: Props) {
  if (!text || !text.includes("$")) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(MATH_SPLIT).filter((p) => p.length > 0);
  return <span className={className}>{parts.map(renderSegment)}</span>;
}
