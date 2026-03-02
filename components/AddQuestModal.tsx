"use client";

import { useMemo, useState } from "react";
import { useXpStore } from "../lib/store/useXpStore";
import { XP_PRESETS } from "../lib/domain/quests";

export default function AddQuestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lang = useXpStore((s) => s.language);
  const add = useXpStore((s) => s.addCustomQuest);

  const t = useMemo(() => {
    if (lang === "en") {
      return {
        title: "Add a quest",
        desc: "Make progress visible. Keep it small and real.",
        labelTitle: "Title",
        labelXp: "XP",
        labelCategory: "Category (optional)",
        placeholderTitle: "e.g. Refactor one function",
        placeholderCategory: "e.g. Refactor",
        cancel: "Cancel",
        save: "Add",
        presets: "Presets",
      };
    }
    return {
      title: "クエスト追加",
      desc: "小さく、現実の前進を。積み上げを可視化しよう。",
      labelTitle: "タイトル",
      labelXp: "XP",
      labelCategory: "カテゴリ（任意）",
      placeholderTitle: "例：関数を1つリファクタ",
      placeholderCategory: "例：Refactor",
      cancel: "キャンセル",
      save: "追加",
      presets: "プリセット",
    };
  }, [lang]);

  const [title, setTitle] = useState("");
  const [xp, setXp] = useState(20);
  const [category, setCategory] = useState("");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
        <div className="text-sm font-extrabold text-zinc-50">{t.title}</div>
        <div className="mt-1 text-sm text-zinc-400">{t.desc}</div>

        <div className="mt-4 grid gap-3">
          <div>
            <div className="text-xs font-semibold text-zinc-400">{t.labelTitle}</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-300/35"
              placeholder={t.placeholderTitle}
              inputMode="text"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-zinc-400">{t.labelXp}</div>
              <input
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
                type="number"
                min={1}
                max={999}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-300/35"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400">{t.labelCategory}</div>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-300/35"
                placeholder={t.placeholderCategory}
                inputMode="text"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-zinc-500">
              {t.presets}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {XP_PRESETS.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => {
                    setTitle(lang === "en" ? p.title : p.title);
                    setXp(p.xp);
                    setCategory(p.category);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-200 hover:bg-white/8"
                >
                  {p.title} · {p.xp}XP
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 hover:bg-white/8"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              add({ title, xp, category: category || undefined });
              setTitle("");
              setXp(20);
              setCategory("");
              onClose();
            }}
            className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-4 py-2 text-sm font-extrabold text-zinc-950 shadow-sm hover:brightness-105"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

