import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
      {children}
    </section>
  );
}

