import type { Metadata, Viewport } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { PwaRegistrar } from "@/components/pwa-registrar";
import "./globals.css";

const appFont = Tajawal({
  variable: "--font-app",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const quranFont = Amiri({
  variable: "--font-quran",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "رفيق رمضان",
  description: "رفيق عبادتك اليومية في رمضان: ختمة، قرآن، صلاة، قبلة، أذكار.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e4b3e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning className={`${appFont.variable} ${quranFont.variable}`}>
        <AppShell>
          <PwaRegistrar />
          {children}
        </AppShell>
      </body>
    </html>
  );
}
