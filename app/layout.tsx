import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "意识坐标 · 你最相信什么哲学主义？",
  description: "穿过自由、荒诞、意识、因果与现实底层的哲学思想测试。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
