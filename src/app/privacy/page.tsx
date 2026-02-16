import { ShieldCheck } from "lucide-react";
import { SectionCard, SectionHeader } from "@/components/ui";

export default function PrivacyPage(): React.JSX.Element {
  return (
    <SectionCard>
      <SectionHeader title="سياسة الخصوصية المختصرة" icon={ShieldCheck} />
      <div className="list">
        <div className="list-item">
          <p>لا يوجد تتبع تسويقي أو تحليلات سلوكية في هذه النسخة.</p>
        </div>
        <div className="list-item">
          <p>بيانات الختمة والعلامات والأذكار تُحفظ محليًا داخل جهازك.</p>
        </div>
        <div className="list-item">
          <p>عند تفعيل Push، يتم تخزين معرف جهاز مجهول واشتراك التنبيه فقط.</p>
        </div>
      </div>
    </SectionCard>
  );
}
