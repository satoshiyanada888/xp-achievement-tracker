"use client";

import { useMemo, useState } from "react";
import type { QuestDefinition } from "../lib/domain/types";
import { useXpStore } from "../lib/store/useXpStore";

export default function QuestRow({
  quest,
  checked,
}: {
  quest: QuestDefinition;
  checked: boolean;
}) {
  const toggle = useXpStore((s) => s.toggleQuestComplete);
  const [pulse, setPulse] = useState(false);

  const xpLabel = useMemo(() => {
    const xp = Number(quest.xp) || 0;
    return xp > 0 ? `+${xp}XP` : "0XP";
  }, [quest.xp]);

  return (
    <button
      type="button"
      onClick={() => {
        toggle(quest.id);
        setPulse(true);
        window.setTimeout(() => setPulse(false), 380);
      }}
      className={[
        "group flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition",
        checked
          ? "border-emerald-400/20 bg-emerald-400/10"
          : "border-white/10 bg-white/0 hover:bg-white/5",
        pulse ? "ring-2 ring-amber-300/35" : "",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={[
              "inline-flex h-5 w-5 items-center justify-center rounded-md border text-xs font-black",
              checked
                ? "border-emerald-300/30 bg-emerald-300/20 text-emerald-200"
                : "border-white/15 bg-white/5 text-zinc-300",
            ].join(" ")}
          >
            {checked ? "✓" : ""}
          </span>
          <div className="min-w-0 truncate text-sm font-semibold text-zinc-100">
            {quest.title}
          </div>
        </div>
        {quest.category ? (
          <div className="mt-0.5 truncate text-xs font-semibold text-zinc-500">
            {quest.category}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-extrabold text-zinc-200">
        {xpLabel}
      </div>
    </button>
  );
}

