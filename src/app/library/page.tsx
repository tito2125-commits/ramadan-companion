"use client";

import { useEffect, useMemo, useState } from "react";
import { LibraryBig } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { fetchLibraryItems } from "@/core/api/client";
import { LibraryItem } from "@/core/types";

export default function LibraryPage(): React.JSX.Element {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("الكل");

  useEffect(() => {
    (async () => {
      try {
        const payload = await fetchLibraryItems();
        setItems(payload);
      } catch {
        setError("تعذر تحميل عناصر المكتبة.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tags = useMemo(() => {
    const values = new Set<string>();
    for (const item of items) {
      for (const tag of item.tags) {
        values.add(tag);
      }
    }
    return ["الكل", ...Array.from(values)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const search = query.trim();

    return items.filter((item) => {
      const matchesTag = activeTag === "الكل" || item.tags.includes(activeTag);
      if (!matchesTag) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        item.title.includes(search) ||
        item.description.includes(search) ||
        item.authority.includes(search) ||
        item.tags.some((tag) => tag.includes(search))
      );
    });
  }, [activeTag, items, query]);

  return (
    <SectionCard>
      <div className="library-hero">
        <SectionHeader
          title="المكتبة الإسلامية الموثقة"
          subtitle="مكتبة مرتبة بعناية لمصادر رسمية وموثوقة مع تصنيف سريع."
          icon={LibraryBig}
        />
        <div className="library-metrics">
          <div>
            <strong>{items.length}</strong>
            <span>مصدر موثّق</span>
          </div>
          <div>
            <strong>{tags.length - 1}</strong>
            <span>تصنيف</span>
          </div>
        </div>
      </div>

      <div className="library-toolbar">
        <div className="form-row">
          <label htmlFor="library-search">بحث في المكتبة</label>
          <input
            id="library-search"
            placeholder="اكتب عنوانًا أو جهة أو تصنيفًا"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="library-tags" aria-label="تصنيفات المكتبة">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? "tag-chip active" : "tag-chip"}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p className="muted">جارٍ التحميل...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error ? (
        <div className="library-grid">
          {filteredItems.length === 0 ? <p className="muted">لا توجد نتائج مطابقة للبحث الحالي.</p> : null}

          {filteredItems.map((item) => (
            <article className="library-card" key={item.id}>
              <div className="library-card-head">
                <h3>{item.title}</h3>
                <span className="verified-badge">موثّق</span>
              </div>

              <p>{item.description}</p>

              <p className="muted">الجهة: {item.authority}</p>
              <p className="muted">آخر تحقق: {item.verifiedAt}</p>

              <div className="library-tags-inline">
                {item.tags.map((tag) => (
                  <span key={`${item.id}-${tag}`}>{tag}</span>
                ))}
              </div>

              <a className="library-link" href={item.url} target="_blank" rel="noreferrer">
                فتح المصدر الرسمي
              </a>
            </article>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}
