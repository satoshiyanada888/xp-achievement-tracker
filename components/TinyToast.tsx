"use client";

import { useEffect, useMemo, useState } from "react";
import type { UiEvent } from "../lib/domain/types";

export default function TinyToast({
  event,
  lang,
}: {
  event: UiEvent | null;
  lang: "ja" | "en";
}) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  const msg = useMemo(() => {
    if (!event) return "";
    if (event.type === "levelUp") {
      return lang === "en"
        ? `Level up! Lv ${event.from} → Lv ${event.to}`
        : `レベルアップ！ Lv${event.from} → Lv${event.to}`;
    }
    if (event.type === "questCompleted") {
      return lang === "en"
        ? `+${event.xp} XP`
        : `+${event.xp} XP`;
    }
    return "";
  }, [event, lang]);

  useEffect(() => {
    if (!event) return;
    setKey((k) => k + 1);
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(t);
  }, [event?.ts]);

  if (!visible || !msg) return null;

  return (
    <div
      key={key}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-[toastIn_0.22s_ease-out] rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm font-bold text-zinc-100 shadow-lg backdrop-blur"
    >
      {msg}
      <style jsx>{`
        @keyframes toastIn {
          from {
            transform: translate(-50%, 8px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

