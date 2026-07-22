import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "秦川｜AI动画制作人/AI短剧全流程搭建";
const description = "秦川，AI动画制作人/AI短剧全流程搭建，以智能体工作流完成从创意到成片的全链路制作。";
const imagePath = "/og.png";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const siteUrl = new URL(`${protocol}://${host}`);
  const imageUrl = new URL(imagePath, siteUrl).toString();

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      url: siteUrl.toString(),
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "秦川｜AI动画制作人/AI短剧全流程搭建" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
