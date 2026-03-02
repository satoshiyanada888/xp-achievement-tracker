export function getLocalYmd(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatLocalDate(ymd: string, lang: "ja" | "en") {
  // ymd: YYYY-MM-DD
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(dt);
}

export function addDaysLocalYmd(ymd: string, deltaDays: number) {
  const [y, m, d] = ymd.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + (Number(deltaDays) || 0));
  return getLocalYmd(dt);
}

