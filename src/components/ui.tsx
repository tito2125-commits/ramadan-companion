import Link from "next/link";
import { PropsWithChildren } from "react";
import type { LucideIcon } from "lucide-react";

export function SectionCard({ children }: PropsWithChildren): React.JSX.Element {
  return <section className="section-card">{children}</section>;
}

export function InAppAlert({ text }: { text: string }): React.JSX.Element {
  return <div className="in-app-alert">{text}</div>;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export function SectionHeader({ title, subtitle, icon: Icon }: SectionHeaderProps): React.JSX.Element {
  return (
    <div className="section-header">
      <div className="section-header-title">
        {Icon ? (
          <span className="section-header-icon">
            <Icon size={20} strokeWidth={2} />
          </span>
        ) : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </div>
  );
}

interface ActionTileProps {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export function ActionTile({ href, title, subtitle, icon: Icon }: ActionTileProps): React.JSX.Element {
  return (
    <Link href={href} className="action-tile">
      <span className="action-tile-icon">
        <Icon size={22} strokeWidth={2} />
      </span>
      <div className="action-tile-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </Link>
  );
}
