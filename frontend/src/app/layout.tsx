import type { Metadata, Viewport } from "next";
import "./globals.css";
import LoadingScreen from "../components/LoadingScreen";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "S C Markting",
  description: "شركة سيلكت كاستمرز الرائدة في برمجة وتصميم المواقع والمتاجر الإلكترونية وحملات الدعاية والإعلان الرقمي والتسويق الممول بأعلى عائد استثماري",
  keywords: ["برمجة مواقع", "تصميم مواقع", "دعاية وإعلان", "تسويق إلكتروني", "تصميم متاجر إلكترونية", "هوية بصرية", "موشن جرافيك", "سوشيال ميديا", "SEO"],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "S C Markting | برمجة مواقع ودعاية وإعلان",
    description: "اكتشف أقوى حلول التسويق الرقمي وبرمجة المواقع المخصصة لزيادة مبيعاتك وأرباحك مع سيلكت كاستمرز",
    siteName: "S C Markting",
    locale: "ar_SA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9d027c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Suspense fallback={null}>
          <LoadingScreen />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
