import type { LucideIcon } from "lucide-react";
import {
  BookCopy,
  BookHeart,
  CalendarDays,
  Compass,
  FileCheck2,
  HandHelping,
  Home,
  LibraryBig,
  MoreHorizontal,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";
import type { AppIconKey } from "@/core/constants";

export const APP_ICON_MAP: Record<AppIconKey, LucideIcon> = {
  home: Home,
  khatma: Timer,
  quran: BookCopy,
  prayer: Sparkles,
  more: MoreHorizontal,
  imsakiya: CalendarDays,
  qibla: Compass,
  athkar: BookHeart,
  library: LibraryBig,
  settings: Settings,
  about: HandHelping,
  privacy: FileCheck2,
};
