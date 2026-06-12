"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Desmos: any;
  }
}

type Props = {
  readOnly?: boolean;
};

// REPLACE_ME: swap for your registered non-commercial key from desmos.com/api
const DESMOS_API_KEY = "dcb31709b452b1cf9dc26972add0fda6";
const DESMOS_SCRIPT_ID = "desmos-api-script";

export default function DesmosEmbed({ readOnly = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let calculator: { destroy: () => void } | null = null;

    function init() {
      if (!containerRef.current || typeof window.Desmos === "undefined") return;
      calculator = window.Desmos.GraphingCalculator(containerRef.current, {
        readOnly,
      calculator = window.Desmos.GraphingCalculator(containerRef.current, {
  readOnly,
  expressions: !readOnly,
  settingsMenu: !readOnly,
  zoomButtons: true,
  border: false,
      });
    }

    if (typeof window.Desmos !== "undefined") {
      init();
    } else {
      let script = document.getElementById(DESMOS_SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = DESMOS_SCRIPT_ID;
        script.src = `https://www.desmos.com/api/v1.8/calculator.js?apiKey=${DESMOS_API_KEY}`;
        document.head.appendChild(script);
      }
      script.addEventListener("load", init, { once: true });
    }

    return () => {
      calculator?.destroy();
    };
  }, [readOnly]);

  return (
    <div className="relative w-full h-full rounded overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
