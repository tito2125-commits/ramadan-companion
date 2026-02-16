"use client";

import { useMemo, useState } from "react";
import { HandCoins } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { ATHKAR_DATA } from "@/data/athkar";
import { DhikrCategory } from "@/core/types";

const CATEGORY_LABELS: Record<DhikrCategory, string> = {
  morning: "أذكار الصباح",
  evening: "أذكار المساء",
  after_prayer: "أذكار بعد الصلاة",
  sleep: "أذكار النوم",
};

export default function AthkarPage(): React.JSX.Element {
  const [category, setCategory] = useState<DhikrCategory>("morning");
  const [counts, setCounts] = useState<Record<string, number>>({});

  const items = useMemo(() => ATHKAR_DATA.filter((item) => item.category === category), [category]);

  const increment = (id: string): void => {
    setCounts((previous) => ({
      ...previous,
      [id]: (previous[id] ?? 0) + 1,
    }));
  };

  const reset = (id: string): void => {
    setCounts((previous) => ({
      ...previous,
      [id]: 0,
    }));
  };

  return (
    <SectionCard>
      <SectionHeader
        title="الأذكار اليومية"
        subtitle="اختر التصنيف واستخدم العداد داخل كل ذكر."
        icon={HandCoins}
      />

      <div className="form-row">
        <label htmlFor="athkarCategory">التصنيف</label>
        <select
          id="athkarCategory"
          value={category}
          onChange={(event) => setCategory(event.target.value as DhikrCategory)}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="list">
        {items.map((item) => {
          const count = counts[item.id] ?? 0;
          const done = count >= item.repeatTarget;

          return (
            <article className="list-item" key={item.id}>
              <p>{item.text}</p>
              <p className="muted">المصدر: {item.sourceRef}</p>
              <div className="inline-actions">
                <button onClick={() => increment(item.id)}>
                  تسبيح ({count}/{item.repeatTarget})
                </button>
                <button className="secondary" onClick={() => reset(item.id)}>
                  تصفير
                </button>
              </div>
              {done ? <p className="success">أكملت العدد المطلوب.</p> : null}
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
}
