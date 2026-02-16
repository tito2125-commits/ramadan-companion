"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, TrendingUp } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";
import { buildKhatmaPlan, getTodayWird, pageToJuz, progressPercent } from "@/core/khatma";
import { getPrimaryKhatmaPlan, saveKhatmaPlan, updateCurrentPage } from "@/core/storage/client-db";
import { KhatmaPlan } from "@/core/types";

export default function KhatmaPage(): React.JSX.Element {
  const [durationDays, setDurationDays] = useState<10 | 20 | 30>(30);
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [reminderTime, setReminderTime] = useState("08:00");
  const [plan, setPlan] = useState<KhatmaPlan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await getPrimaryKhatmaPlan();
      if (saved) {
        setPlan(saved);
        setDurationDays(saved.durationDays);
        setStartDate(saved.startDate);
        setReminderTime(saved.reminderTime);
        setCurrentPage(saved.currentPage);
      }
    })();
  }, []);

  const today = useMemo(() => (plan ? getTodayWird(plan) : null), [plan]);

  const savePlan = async (): Promise<void> => {
    const created = buildKhatmaPlan(durationDays, startDate, reminderTime);
    await saveKhatmaPlan(created);
    setPlan(created);
    setCurrentPage(created.currentPage);
    setMessage("تم حفظ خطة الختمة بنجاح.");
  };

  const saveProgress = async (): Promise<void> => {
    if (!plan) {
      return;
    }

    const nextPage = Math.max(1, Math.min(604, Number(currentPage)));
    await updateCurrentPage(nextPage);
    setPlan({ ...plan, currentPage: nextPage });
    setMessage("تم تحديث تقدمك.");
  };

  return (
    <>
      <SectionCard>
        <SectionHeader
          title="خطة ختمة القرآن"
          subtitle="اختر مدة الختمة وسيتم احتساب وردك اليومي تلقائيًا."
          icon={CalendarCheck2}
        />

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="duration">مدة الختمة</label>
            <select
              id="duration"
              value={durationDays}
              onChange={(event) => setDurationDays(Number(event.target.value) as 10 | 20 | 30)}
            >
              <option value={30}>30 يوم</option>
              <option value={20}>20 يوم</option>
              <option value={10}>10 أيام</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="startDate">تاريخ البداية</label>
            <input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>

          <div className="form-row">
            <label htmlFor="reminderTime">وقت تذكير الورد</label>
            <input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
            />
          </div>

          <div className="inline-actions">
            <button onClick={() => void savePlan()}>حفظ الخطة</button>
          </div>
        </div>
        {message ? <p className="success">{message}</p> : null}
      </SectionCard>

      <SectionCard>
        <SectionHeader title="تقدم الختمة" icon={TrendingUp} />
        {!plan ? <p className="muted">ابدأ بحفظ خطة أولًا.</p> : null}
        {plan ? (
          <div className="form-grid">
            <p>
              ورد اليوم: <strong>{today ? `${today.startPage} - ${today.endPage}` : "انتهت المدة"}</strong>
            </p>
            <p>
              التقدم الحالي: <strong>{progressPercent(plan.currentPage)}%</strong>
            </p>
            <div className="progress-wrap">
              <div className="progress-bar" style={{ width: `${progressPercent(plan.currentPage)}%` }} />
            </div>

            <div className="form-row">
              <label htmlFor="currentPage">آخر صفحة وصلت لها</label>
              <input
                id="currentPage"
                type="number"
                min={1}
                max={604}
                value={currentPage}
                onChange={(event) => setCurrentPage(Number(event.target.value))}
              />
              <p className="muted">يعادل تقريبًا الجزء {pageToJuz(Number(currentPage))}</p>
            </div>

            <div className="inline-actions">
              <button onClick={() => void saveProgress()}>حفظ التقدم</button>
            </div>
          </div>
        ) : null}
      </SectionCard>
    </>
  );
}
