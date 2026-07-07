import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { SettingsProvider } from '@/components/providers/SettingsProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://taverna-zeus.de'),
  title: {
    default: 'Taverna Zeus - Griechisches Restaurant',
    template: '%s | Taverna Zeus',
  },
  description: 'Authentische griechische Küche in herzlicher Atmosphäre. Genießen Sie traditionelle Gerichte und frische Zutaten.',
  keywords: ['griechisches restaurant', 'taverna', 'authentische küche', 'speisekarte', 'essen', 'trinken'],
  authors: [{ name: 'Taverna Zeus' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://taverna-zeus.de',
    siteName: 'Taverna Zeus',
    title: 'Taverna Zeus - Griechisches Restaurant',
    description: 'Authentische griechische Küche in herzlicher Atmosphäre.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taverna Zeus - Griechisches Restaurant',
    description: 'Authentische griechische Küche in herzlicher Atmosphäre.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          <SettingsProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
            <CookieBanner />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}