import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getLocalYmd } from "../date";
import { DEFAULT_DAILY_QUESTS, createQuestId } from "../domain/quests";
import { getLevelInfo } from "../domain/level";
import type { AppStateV1, CompletedQuest, DailyLog, QuestDefinition } from "../domain/types";
import { zustandStorage, appStateKey } from "../storage/zustandStorage";

type Actions = {
  setLanguage: (lang: "ja" | "en") => void;
  addCustomQuest: (q: { title: string; xp: number; category?: string }) => void;
  toggleQuestComplete: (questId: string) => void;
  ensureToday: () => void;
  resetAll: () => void;
};

export type XpStore = AppStateV1 & Actions;

function sumAllXp(logs: Record<string, DailyLog>) {
  let total = 0;
  for (const k of Object.keys(logs || {})) {
    const day = logs[k];
    for (const item of day?.completed || []) total += Number(item.xp || 0) || 0;
  }
  return total;
}

function withDefaults(state?: Partial<AppStateV1>): AppStateV1 {
  const now = new Date().toISOString();
  const quests: QuestDefinition[] = [
    ...DEFAULT_DAILY_QUESTS.map((q) => ({ ...q, createdAt: now })),
    ...(state?.quests || []).filter((q) => q.kind === "custom"),
  ];
  const logs = state?.logs || {};
  const totalXp = typeof state?.totalXp === "number" ? state.totalXp : sumAllXp(logs);
  return {
    schemaVersion: 1,
    language: state?.language === "en" ? "en" : "ja",
    quests,
    logs,
    totalXp,
    lastEvent: null,
  };
}

export const useXpStore = create<XpStore>()(
  persist(
    (set, get) => ({
      ...withDefaults(),

      setLanguage: (lang) => set({ language: lang }),

      ensureToday: () => {
        const ymd = getLocalYmd();
        const st = get();
        if (st.logs[ymd]) return;
        set({
          logs: {
            ...st.logs,
            [ymd]: { date: ymd, completed: [] },
          },
        });
      },

      addCustomQuest: ({ title, xp, category }) => {
        const now = new Date().toISOString();
        const q: QuestDefinition = {
          id: createQuestId(),
          title: String(title || "").trim().slice(0, 60) || (get().language === "en" ? "Untitled" : "無題"),
          xp: Math.max(1, Math.min(999, Math.floor(xp || 0))),
          category: (category || "").trim().slice(0, 24) || undefined,
          kind: "custom",
          createdAt: now,
        };
        set({ quests: [...get().quests, q] });
      },

      toggleQuestComplete: (questId) => {
        const ymd = getLocalYmd();
        const st = get();
        const quest = st.quests.find((q) => q.id === questId);
        if (!quest) return;

        const day: DailyLog = st.logs[ymd] || { date: ymd, completed: [] };
        const idx = day.completed.findIndex((c) => c.questId === questId);

        const prevLevel = getLevelInfo(st.totalXp).level;

        let nextCompleted: CompletedQuest[];
        if (idx >= 0) {
          // undo: remove from today only (MVP)
          nextCompleted = [...day.completed.slice(0, idx), ...day.completed.slice(idx + 1)];
        } else {
          nextCompleted = [
            ...day.completed,
            {
              questId,
              title: quest.title,
              xp: quest.xp,
              category: quest.category,
              kind: quest.kind,
              completedAt: new Date().toISOString(),
            },
          ];
        }

        const nextLogs = {
          ...st.logs,
          [ymd]: { date: ymd, completed: nextCompleted },
        };
        const nextTotalXp = sumAllXp(nextLogs);
        const nextLevel = getLevelInfo(nextTotalXp).level;

        set({
          logs: nextLogs,
          totalXp: nextTotalXp,
          lastEvent:
            idx >= 0
              ? null
              : nextLevel > prevLevel
                ? { type: "levelUp", from: prevLevel, to: nextLevel, ts: Date.now() }
                : { type: "questCompleted", date: ymd, questId, xp: quest.xp, ts: Date.now() },
        });
      },

      resetAll: () => set(withDefaults({ logs: {}, quests: [] }) as any),
    }),
    {
      name: appStateKey,
      storage: createJSONStorage(() => zustandStorage as any),
      version: 1,
      migrate: (persisted: any) => {
        // V0/V1 normalize
        const next = withDefaults(persisted || {});
        return next;
      },
      partialize: (s) => ({
        schemaVersion: 1,
        language: s.language,
        quests: s.quests,
        logs: s.logs,
        totalXp: s.totalXp,
      }),
    }
  )
);

export function selectToday(store: XpStore) {
  const ymd = getLocalYmd();
  const log = store.logs[ymd]?.completed || [];
  const todayXp = log.reduce((acc, x) => acc + (Number(x.xp) || 0), 0);
  return { ymd, todayXp, completedIds: new Set(log.map((x) => x.questId)) };
}

