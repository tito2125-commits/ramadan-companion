"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenText, Bookmark as BookmarkIcon, ScrollText } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { fetchSurah, fetchSurahList } from "@/core/api/client";
import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
  getReadingProgress,
  getSurahList,
  getSurahPayload,
  saveReadingProgress,
  saveSurahList,
  saveSurahPayload,
} from "@/core/storage/client-db";
import { Bookmark, QuranSurah, QuranSurahPayload } from "@/core/types";

export default function QuranPage(): React.JSX.Element {
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [search, setSearch] = useState("");
  const [ayahSearch, setAyahSearch] = useState("");
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [payload, setPayload] = useState<QuranSurahPayload | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [cachedSurahs, savedBookmarks, readingProgress] = await Promise.all([
        getSurahList(),
        getBookmarks(),
        getReadingProgress(),
      ]);

      if (cachedSurahs) {
        setSurahs(cachedSurahs);
      }

      if (readingProgress) {
        setSelectedSurah(readingProgress.surah);
      }

      setBookmarks(savedBookmarks);

      try {
        const latest = await fetchSurahList();
        setSurahs(latest);
        await saveSurahList(latest);
      } catch {
        // Keep cached list when network fails.
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMessage(null);

      const cachedPayload = await getSurahPayload(selectedSurah);
      if (cachedPayload) {
        setPayload(cachedPayload);
      }

      try {
        const fresh = await fetchSurah(selectedSurah);
        setPayload(fresh);
        await saveSurahPayload(fresh);
      } catch {
        if (!cachedPayload) {
          setMessage("تعذر تحميل السورة حاليًا.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedSurah]);

  const filteredSurahs = useMemo(() => {
    const needle = search.trim();
    if (!needle) {
      return surahs;
    }

    return surahs.filter(
      (item) =>
        item.name.includes(needle) ||
        item.englishName.toLowerCase().includes(needle.toLowerCase()) ||
        String(item.number).includes(needle)
    );
  }, [search, surahs]);

  const filteredAyahs = useMemo(() => {
    if (!payload) {
      return [];
    }

    const needle = ayahSearch.trim();
    if (!needle) {
      return payload.ayahs;
    }

    return payload.ayahs.filter(
      (ayah) => String(ayah.numberInSurah).includes(needle) || ayah.text.includes(needle)
    );
  }, [ayahSearch, payload]);

  const onBookmark = async (ayah: number): Promise<void> => {
    await addBookmark({
      surah: selectedSurah,
      ayah,
      createdAt: new Date().toISOString(),
    });

    const latest = await getBookmarks();
    setBookmarks(latest);
    setMessage("تمت إضافة علامة بنجاح.");
  };

  const onSelectAyah = async (ayah: { numberInSurah: number; page: number }): Promise<void> => {
    await saveReadingProgress({
      surah: selectedSurah,
      ayah: ayah.numberInSurah,
      page: ayah.page,
      updatedAt: new Date().toISOString(),
    });
    setMessage(`تم حفظ آخر قراءة: آية ${ayah.numberInSurah}`);
  };

  const onDeleteBookmark = async (id: number): Promise<void> => {
    await deleteBookmark(id);
    const latest = await getBookmarks();
    setBookmarks(latest);
  };

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="المصحف الكامل"
          subtitle="نسخة عثمانية موثقة مع حفظ آخر قراءة والعلامات."
          icon={BookOpenText}
        />

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="searchSurah">بحث بالسورة</label>
            <input
              id="searchSurah"
              placeholder="اكتب اسم السورة أو رقمها"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="form-row">
            <label htmlFor="surahSelect">اختر السورة</label>
            <select
              id="surahSelect"
              value={selectedSurah}
              onChange={(event) => setSelectedSurah(Number(event.target.value))}
            >
              {filteredSurahs.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {message ? <p className="success">{message}</p> : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title={payload?.surah.name ?? "السورة"}
          subtitle={loading ? "جارٍ التحميل..." : "المصدر: نسخة عثمانية موثقة"}
          icon={ScrollText}
        />
        {message && !payload ? <p className="error">{message}</p> : null}

        <div className="form-row" style={{ marginBottom: "0.8rem" }}>
          <label htmlFor="ayahSearch">بحث بالآية (رقم أو نص)</label>
          <input
            id="ayahSearch"
            placeholder="مثال: 255 أو الحمد لله"
            value={ayahSearch}
            onChange={(event) => setAyahSearch(event.target.value)}
          />
        </div>

        {payload ? (
          <div className="list">
            {filteredAyahs.length === 0 ? <p className="muted">لا توجد آيات مطابقة للبحث.</p> : null}
            {filteredAyahs.map((ayah) => (
              <div className="list-item" key={ayah.number}>
                <p className="quran-text">{ayah.text}</p>
                <div className="inline-actions">
                  <button className="secondary" onClick={() => void onSelectAyah(ayah)}>
                    حفظ كآخر قراءة ({ayah.numberInSurah})
                  </button>
                  <button className="secondary" onClick={() => void onBookmark(ayah.numberInSurah)}>
                    إضافة علامة
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader title="العلامات المحفوظة" icon={BookmarkIcon} />
        <div className="list">
          {bookmarks.length === 0 ? <p className="muted">لا توجد علامات بعد.</p> : null}
          {bookmarks.map((bookmark) => {
            const bookmarkId = bookmark.id;

            return (
              <div className="list-item" key={bookmark.id}>
                <p>
                  سورة {bookmark.surah} - آية {bookmark.ayah}
                </p>
                {bookmarkId !== undefined ? (
                  <div className="inline-actions">
                    <button className="danger" onClick={() => void onDeleteBookmark(bookmarkId)}>
                      حذف
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
