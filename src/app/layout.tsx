import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: {
    default: "Yoshibow Blog",
    template: "%s | Yoshibow Blog",
  },
  description: "技術やライフスタイルについての記事を発信するブログサイト",
  keywords: ["ブログ", "技術", "プログラミング", "ライフスタイル", "Next.js", "React"],
  authors: [{ name: "Yoshibow" }],
  creator: "Yoshibow",
  publisher: "Yoshibow",
  metadataBase: new URL("https://yoshibow-blog.vercel.app"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://yoshibow-blog.vercel.app",
    siteName: "Yoshibow Blog",
    title: "Yoshibow Blog",
    description: "技術やライフスタイルについての記事を発信するブログサイト",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yoshibow Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yoshibow",
    creator: "@yoshibow",
    title: "Yoshibow Blog",
    description: "技術やライフスタイルについての記事を発信するブログサイト",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Yoshibow Blog",
  "description": "技術やライフスタイルについての記事を発信するブログサイト",
  "url": "https://yoshibow-blog.vercel.app",
  "author": {
    "@type": "Person",
    "name": "Yoshibow"
  },
  "publisher": {
    "@type": "Person",
    "name": "Yoshibow"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-75BMQPVFKV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-75BMQPVFKV');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
