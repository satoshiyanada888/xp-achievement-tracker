"use client";

import { useEffect, useMemo, useState } from "react";

import { useXpStore, selectToday } from "../lib/store/useXpStore";
import { getLevelInfo } from "../lib/domain/level";
import { formatLocalDate } from "../lib/date";

import Card from "./ui/Card";
import ProgressBar from "./ui/ProgressBar";
import QuestRow from "./QuestRow";
import AddQuestModal from "./AddQuestModal";
import TinyToast from "./TinyToast";

const TEXT = {
  ja: {
    today: "今日",
    todayXp: "今日のXP",
    totalXp: "累計XP",
    level: "レベル",
    addQuest: "クエスト追加",
    todayQuests: "今日のクエスト",
    customQuests: "カスタム",
    dailyQuests: "デイリー",
    recentLog: "最近の達成ログ",
    emptyLog: "まだログがありません。小さくても一つ、進めてみよう。",
    reset: "全リセット",
  },
  en: {
    today: "Today",
    todayXp: "XP Today",
    totalXp: "Total XP",
    level: "Level",
    addQuest: "Add quest",
    todayQuests: "Today's quests",
    customQuests: "Custom",
    dailyQuests: "Daily",
    recentLog: "Recent log",
    emptyLog: "No logs yet. Do one small thing—make progress visible.",
    reset: "Reset all",
  },
} as const;

export default function Dashboard() {
  const language = useXpStore((s) => s.language);
  const setLanguage = useXpStore((s) => s.setLanguage);
  const ensureToday = useXpStore((s) => s.ensureToday);
  const resetAll = useXpStore((s) => s.resetAll);

  const quests = useXpStore((s) => s.quests);
  const logs = useXpStore((s) => s.logs);
  const totalXp = useXpStore((s) => s.totalXp);
  const lastEvent = useXpStore((s) => s.lastEvent);

  const { ymd, todayXp, completedIds } = useXpStore(selectToday);
  const levelInfo = useMemo(() => getLevelInfo(totalXp), [totalXp]);

  const t = TEXT[language];

  useEffect(() => {
    ensureToday();
  }, [ensureToday]);

  const daily = quests.filter((q) => q.kind === "daily");
  const custom = quests.filter((q) => q.kind === "custom");

  const recentDays = useMemo(() => {
    const keys = Object.keys(logs || {}).sort((a, b) => (a > b ? -1 : 1));
    return keys.slice(0, 7).map((k) => logs[k]).filter(Boolean);
  }, [logs]);

  const [openAdd, setOpenAdd] = useState(false);
  const [xpPop, setXpPop] = useState(false);
  const [levelGlow, setLevelGlow] = useState(false);

  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.type === "questCompleted") {
      setXpPop(true);
      window.setTimeout(() => setXpPop(false), 320);
    }
    if (lastEvent.type === "levelUp") {
      setLevelGlow(true);
      window.setTimeout(() => setLevelGlow(false), 520);
    }
  }, [lastEvent?.ts]);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-[0.22em] text-zinc-400 uppercase">
            XP Tracker
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
            {t.today} · {formatLocalDate(ymd, language)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === "ja" ? "en" : "ja")}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 hover:bg-white/8"
          >
            {language === "ja" ? "EN" : "日本語"}
          </button>
          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-3 py-1 text-xs font-extrabold text-zinc-950 shadow-sm hover:brightness-105"
          >
            {t.addQuest}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-xs font-semibold text-zinc-400">{t.todayXp}</div>
          <div
            className="mt-1 text-2xl font-extrabold tracking-tight"
            style={xpPop ? { animation: "xp-pop 320ms ease-out 1" } : undefined}
          >
            {todayXp}
            <span className="ml-1 text-sm font-bold text-zinc-400">XP</span>
          </div>
        </Card>
        <Card>
          <div className="text-xs font-semibold text-zinc-400">{t.totalXp}</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight">
            {totalXp}
            <span className="ml-1 text-sm font-bold text-zinc-400">XP</span>
          </div>
        </Card>
      </section>

      <Card>
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-zinc-400">{t.level}</div>
            <div
              className="mt-1 text-xl font-extrabold tracking-tight"
              style={levelGlow ? { animation: "level-glow 520ms ease-out 1" } : undefined}
            >
              Lv {levelInfo.level}
            </div>
          </div>
          <div className="text-xs font-semibold text-zinc-400">
            {levelInfo.nextLevelXp == null
              ? language === "en"
                ? "MAX"
                : "MAX"
              : `${totalXp - levelInfo.currentLevelMinXp}/${levelInfo.nextLevelXp - levelInfo.currentLevelMinXp} XP`}
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value01={levelInfo.progress01} />
        </div>
      </Card>

      <Card>
        <div className="flex items-baseline justify-between">
          <div className="text-sm font-bold text-zinc-50">{t.todayQuests}</div>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  language === "en"
                    ? "Reset all data? This cannot be undone."
                    : "全データをリセットします。よろしいですか？"
                )
              ) {
                resetAll();
                window.location.reload();
              }
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-200"
          >
            {t.reset}
          </button>
        </div>

        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-500">
            {t.dailyQuests}
          </div>
          <div className="flex flex-col gap-1">
            {daily.map((q) => (
              <QuestRow key={q.id} quest={q} checked={completedIds.has(q.id)} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-500">
            {t.customQuests}
          </div>
          <div className="flex flex-col gap-1">
            {custom.length ? (
              custom.map((q) => (
                <QuestRow key={q.id} quest={q} checked={completedIds.has(q.id)} />
              ))
            ) : (
              <div className="text-sm text-zinc-400">
                {language === "en"
                  ? "Add your own quests to fit your day."
                  : "自分のクエストを追加して、今日の前進を作ろう。"}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-bold text-zinc-50">{t.recentLog}</div>
        <div className="mt-2 flex flex-col gap-3">
          {recentDays.length ? (
            recentDays.map((d) => {
              const dayXp = (d.completed || []).reduce((acc, x) => acc + (Number(x.xp) || 0), 0);
              return (
                <div key={d.date} className="rounded-xl border border-white/10 bg-white/3 p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-100">
                      {formatLocalDate(d.date, language)}
                    </div>
                    <div className="text-xs font-bold text-zinc-300">{dayXp} XP</div>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {(d.completed || []).slice().reverse().slice(0, 8).map((c) => (
                      <div key={c.completedAt} className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0 truncate text-sm text-zinc-300">
                          {c.title}
                          {c.category ? (
                            <span className="ml-2 text-xs font-semibold text-zinc-500">
                              {c.category}
                            </span>
                          ) : null}
                        </div>
                        <div className="shrink-0 text-xs font-bold text-zinc-400">
                          +{c.xp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-zinc-400">{t.emptyLog}</div>
          )}
        </div>
      </Card>

      <AddQuestModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <TinyToast event={lastEvent} lang={language} />
    </div>
  );
}

