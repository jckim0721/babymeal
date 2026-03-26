import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "베이비밀 - 우리 아이 이유식 레시피",
  description: "개월수에 맞는 이유식 레시피를 AI가 추천해드려요. 안전 재료 체크, 100가지 식재료 챌린지!",
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="text-center text-gray-400 text-xs py-6 space-x-4 border-t border-orange-100 bg-orange-50">
          <Link href="/about" className="hover:text-orange-500">서비스 소개</Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-orange-500">개인정보처리방침</Link>
          <span>·</span>
          <Link href="/terms-of-service" className="hover:text-orange-500">이용약관</Link>
        </footer>
      </body>
    </html>
  );
}
