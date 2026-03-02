import { QuestDefinition } from "./types";

export const DEFAULT_DAILY_QUESTS: Omit<QuestDefinition, "createdAt">[] = [
  { id: "daily-focus-30", title: "30分集中作業", xp: 10, kind: "daily", category: "Focus" },
  { id: "daily-small-improve", title: "小さな改善", xp: 15, kind: "daily", category: "Improve" },
  { id: "daily-deep-understand", title: "技術理解の深化", xp: 15, kind: "daily", category: "Learn" },
];

export const XP_PRESETS = [
  { title: "深い集中", xp: 10, category: "Focus" },
  { title: "小さな改善", xp: 15, category: "Improve" },
  { title: "技術理解", xp: 15, category: "Learn" },
  { title: "設計整理", xp: 20, category: "Design" },
  { title: "構造改善", xp: 40, category: "Refactor" },
  { title: "モジュール化", xp: 50, category: "Refactor" },
  { title: "設計思想整理", xp: 60, category: "Design" },
] as const;

export function createQuestId() {
  return `q_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

