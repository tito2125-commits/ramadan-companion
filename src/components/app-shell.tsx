"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { PRIMARY_TABS, SECONDARY_ROUTES } from "@/core/constants";
import { APP_ICON_MAP } from "@/core/icons";

const ICON_SIZE = 20;
const ICON_STROKE = 2;

export function AppShell({ children }: PropsWithChildren): React.JSX.Element {
  const pathname = usePathname();
  const isSecondaryPath = SECONDARY_ROUTES.some((route) => route.href === pathname);

  return (
    <div className="app-frame">
      <div className="app-wrapper">
      <header className="topbar">
        <div>
          <p className="topbar-subtitle">نسخة تجريبية</p>
          <h1>رفيق رمضان</h1>
        </div>
        <div className="topbar-links">
          <Link href="/about">حول المحتوى</Link>
          <Link href="/privacy">الخصوصية</Link>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <nav className="bottom-nav" aria-label="التنقل الرئيسي">
        {PRIMARY_TABS.map((route) => {
          const Icon = APP_ICON_MAP[route.icon];
          const isActive = route.href === "/more" ? pathname === "/more" || isSecondaryPath : pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={isActive ? "active" : ""}
              aria-label={route.ariaLabel}
            >
              <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              {route.label}
            </Link>
          );
        })}
      </nav>
      </div>
    </div>
  );
}
