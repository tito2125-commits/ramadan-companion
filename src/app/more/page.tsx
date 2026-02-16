import { MoreHorizontal } from "lucide-react";
import { ActionTile, SectionCard, SectionHeader } from "@/components/ui";
import { SECONDARY_ROUTES } from "@/core/constants";
import { APP_ICON_MAP } from "@/core/icons";

export default function MorePage(): React.JSX.Element {
  return (
    <SectionCard>
      <SectionHeader
        icon={MoreHorizontal}
        title="المزيد"
        subtitle="اختصارات سريعة لباقي أقسام التطبيق."
      />

      <div className="action-tiles-grid">
        {SECONDARY_ROUTES.map((route) => {
          const Icon = APP_ICON_MAP[route.icon];
          return (
            <ActionTile
              key={route.key}
              href={route.href}
              title={route.label}
              subtitle={route.ariaLabel.replace("الانتقال إلى ", "")}
              icon={Icon}
            />
          );
        })}
      </div>
    </SectionCard>
  );
}
