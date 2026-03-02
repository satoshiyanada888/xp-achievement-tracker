import type { DailyLog } from "./types";
import { addDaysLocalYmd, getLocalYmd } from "../date";

export type StreakInfo = {
  streakDays: number;
  weeklyCompletedDays: number; // 0..7
};

function hasAnyCompletion(day?: DailyLog | null) {
  return Boolean(day?.completed && day.completed.length > 0);
}

export function computeStreak(
  logs: Record<string, DailyLog>,
  todayYmd?: string
): StreakInfo {
  const today = todayYmd || getLocalYmd();

  // Consecutive days (including today) with >=1 completion.
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const ymd = addDaysLocalYmd(today, -i);
    if (!hasAnyCompletion(logs?.[ymd])) break;
    streak++;
  }

  // Weekly: last 7 days how many days had >=1 completion.
  let weekly = 0;
  for (let i = 0; i < 7; i++) {
    const ymd = addDaysLocalYmd(today, -i);
    if (hasAnyCompletion(logs?.[ymd])) weekly++;
  }

  return { streakDays: streak, weeklyCompletedDays: weekly };
}

