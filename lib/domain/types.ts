export type QuestKind = "daily" | "custom";

export type QuestDefinition = {
  id: string;
  title: string;
  xp: number;
  category?: string;
  kind: QuestKind;
  createdAt: string; // ISO
};

export type CompletedQuest = {
  questId: string;
  title: string;
  xp: number;
  category?: string;
  kind: QuestKind;
  completedAt: string; // ISO
};

export type DailyLog = {
  date: string; // YYYY-MM-DD (local)
  completed: CompletedQuest[];
};

export type UiEvent =
  | { type: "questCompleted"; date: string; questId: string; xp: number; ts: number }
  | { type: "levelUp"; from: number; to: number; ts: number };

export type AppStateV1 = {
  schemaVersion: 1;
  language: "ja" | "en";

  // quest catalog (definitions)
  quests: QuestDefinition[];

  // logs by day (what you did)
  logs: Record<string, DailyLog>;

  // cached totals (kept in sync by actions)
  totalXp: number;

  // last UI event for animations
  lastEvent: UiEvent | null;
};

