import { ReminderPreferences } from "@/core/types";

export const TOTAL_QURAN_PAGES = 604;

export const KAABA_COORDS = {
  lat: 21.422487,
  lng: 39.826206,
};

export const DEFAULT_PRAYER_METHOD = 4; // Umm Al-Qura University, Makkah

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  wirdTime: "08:00",
  morningAthkarTime: "06:30",
  eveningAthkarTime: "18:00",
  prePrayerMinutes: 15,
  enabledChannels: ["in-app"],
  timezone: "Asia/Riyadh",
};

export type RoutePlacement = "primary" | "secondary";
export type AppIconKey =
  | "home"
  | "khatma"
  | "quran"
  | "prayer"
  | "more"
  | "imsakiya"
  | "qibla"
  | "athkar"
  | "library"
  | "settings"
  | "about"
  | "privacy";

export interface AppRouteItem {
  key: string;
  href: string;
  label: string;
  icon: AppIconKey;
  placement: RoutePlacement;
  ariaLabel: string;
}

export const PRIMARY_TABS: AppRouteItem[] = [
  { key: "home", href: "/", label: "اليوم", icon: "home", placement: "primary", ariaLabel: "الانتقال إلى صفحة اليوم" },
  {
    key: "khatma",
    href: "/khatma",
    label: "الختمة",
    icon: "khatma",
    placement: "primary",
    ariaLabel: "الانتقال إلى صفحة الختمة",
  },
  {
    key: "quran",
    href: "/quran",
    label: "القرآن",
    icon: "quran",
    placement: "primary",
    ariaLabel: "الانتقال إلى صفحة القرآن",
  },
  {
    key: "prayer",
    href: "/prayer",
    label: "الصلاة",
    icon: "prayer",
    placement: "primary",
    ariaLabel: "الانتقال إلى صفحة الصلاة",
  },
  {
    key: "more",
    href: "/more",
    label: "المزيد",
    icon: "more",
    placement: "primary",
    ariaLabel: "الانتقال إلى صفحة المزيد",
  },
];

export const SECONDARY_ROUTES: AppRouteItem[] = [
  {
    key: "imsakiya",
    href: "/imsakiya",
    label: "الإمساكية",
    icon: "imsakiya",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة الإمساكية",
  },
  {
    key: "qibla",
    href: "/qibla",
    label: "القبلة",
    icon: "qibla",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة القبلة",
  },
  {
    key: "athkar",
    href: "/athkar",
    label: "الأذكار",
    icon: "athkar",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة الأذكار",
  },
  {
    key: "library",
    href: "/library",
    label: "المكتبة",
    icon: "library",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة المكتبة",
  },
  {
    key: "settings",
    href: "/settings",
    label: "الإعدادات",
    icon: "settings",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة الإعدادات",
  },
  {
    key: "about",
    href: "/about",
    label: "حول المحتوى",
    icon: "about",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة حول المحتوى",
  },
  {
    key: "privacy",
    href: "/privacy",
    label: "الخصوصية",
    icon: "privacy",
    placement: "secondary",
    ariaLabel: "الانتقال إلى صفحة الخصوصية",
  },
];
