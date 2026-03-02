export type LevelInfo = {
  level: number;
  currentLevelMinXp: number;
  nextLevelXp: number | null;
  progress01: number; // 0..1 within this level
};

export const LEVELS = [
  { level: 1, minXp: 0, maxXp: 99 },
  { level: 2, minXp: 100, maxXp: 249 },
  { level: 3, minXp: 250, maxXp: 499 },
  { level: 4, minXp: 500, maxXp: 999 },
  { level: 5, minXp: 1000, maxXp: Number.POSITIVE_INFINITY },
] as const;

export function getLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, Math.floor(totalXp || 0));
  const row =
    LEVELS.find((r) => xp >= r.minXp && xp <= r.maxXp) ?? LEVELS[0];
  const next = LEVELS.find((r) => r.level === row.level + 1) ?? null;
  const nextLevelXp = next ? next.minXp : null;
  const span = Number.isFinite(row.maxXp) ? row.maxXp - row.minXp + 1 : 200;
  const within = xp - row.minXp;
  const progress01 =
    row.level === 5 ? 1 : Math.min(1, Math.max(0, within / span));

  return {
    level: row.level,
    currentLevelMinXp: row.minXp,
    nextLevelXp,
    progress01,
  };
}

