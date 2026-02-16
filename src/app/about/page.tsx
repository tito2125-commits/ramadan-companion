import { BadgeInfo } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";

export default function AboutPage(): React.JSX.Element {
  return (
    <SectionCard>
      <SectionHeader title="حول المحتوى والمصادر" icon={BadgeInfo} />
      <div className="list">
        <div className="list-item">
          <h3>نص القرآن</h3>
          <p>يتم جلب السور من نسخة عثمانية عبر مزود موثوق ثم تخزينها محليًا للاستخدام دون اتصال.</p>
        </div>
        <div className="list-item">
          <h3>مواقيت الصلاة</h3>
          <p>يتم جلب المواقيت من خدمة مواقيت موثوقة مع أم القرى كطريقة افتراضية للسعودية.</p>
        </div>
        <div className="list-item">
          <h3>الأذكار والمكتبة</h3>
          <p>تم إعداد المحتوى المضمّن بروابط موثقة ومراجعة بتاريخ 16 فبراير 2026.</p>
        </div>
      </div>
    </SectionCard>
  );
}
