import { LanguageProvider } from '../contexts/LanguageContext';
import TrackingEngine from '../components/TrackingEngine';
import './globals.css';
import './agri_styles.css';
import './product_styles.css';
import './navbar_footer_styles.css';
import './booking_styles.css';
import './rahma_home.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata = {
  metadataBase: new URL('https://elrahma-metal.com'),
  title: {
    template: '%s | شركة الرحمة لتشكيل المعادن',
    default: 'شركة الرحمة لتشكيل المعادن | حلول التأريض والحماية من الصواعق',
  },
  description: 'شركة الرحمة لتشكيل المعادن متخصصة في تصنيع وتوريد مكونات التأريض والحماية من الصواعق بجودة صناعية موثوقة.',
  keywords: ['شركة الرحمة', 'تشكيل المعادن', 'تأريض', 'مانع صواعق', 'قضبان نحاس', 'مشابك تأريض', 'بسبارات نحاس', 'كوس نحاس'],
  authors: [{ name: 'El Rahma Factory' }],
  creator: 'El Rahma Factory',
  publisher: 'El Rahma Factory',
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
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://elrahma-metal.com',
    siteName: 'شركة الرحمة لتشكيل المعادن',
    title: 'شركة الرحمة لتشكيل المعادن | حلول التأريض والحماية',
    description: 'تصنيع وتوريد مكونات التأريض والحماية من الصواعق بجودة صناعية.',
    images: [
      {
        url: 'https://elrahma-metal.com/rahma-logo-full.png',
        secureUrl: 'https://elrahma-metal.com/rahma-logo-full.png',
        width: 800,
        height: 600,
        alt: 'El Rahma Factory Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شركة الرحمة لتشكيل المعادن',
    description: 'حلول تأريض وحماية من الصواعق بجودة صناعية.',
    images: ['https://elrahma-metal.com/rahma-logo-full.png'],
  },
  icons: {
    icon: '/rahma-site-icon.png',
    shortcut: '/rahma-site-icon.png',
    apple: '/rahma-site-icon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
          <TrackingEngine>
            <div style={{ overflowX: 'hidden', width: '100%', position: 'relative', maxWidth: '100%' }}>
              {children}
            </div>
          </TrackingEngine>
        </LanguageProvider>
      </body>
    </html>
  );
}
