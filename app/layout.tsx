import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "秦川｜AI动画导演 / 制片人",
  description: "秦川，AI动画导演 / 制片人，以智能体工作流完成从创意到成片的全链路制作。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
