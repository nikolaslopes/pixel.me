import type { Metadata } from 'next';
import { Geist, Pixelify_Sans } from 'next/font/google';
import '@/app/globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const pixelify = Pixelify_Sans({
  variable: '--font-pixelify',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'pixel.me',
  description: 'Turn your images into pixel art with a click',
  metadataBase: new URL('https://pixelme-pi.vercel.app'),
  keywords: ['pixel art', 'image converter', 'pixelate', 'retro', 'art tool'],
  authors: [{ name: 'pixel.me' }],
  creator: 'pixel.me',
  publisher: 'pixel.me',

  openGraph: {
    title: 'pixel.me - Turn your images into pixel art',
    description:
      'Transform any image into beautiful pixel art with just one click. Free online pixel art converter.',
    url: '/',
    siteName: 'pixel.me',
    images: [
      {
        url: 'og-image.png',
        width: 1200,
        height: 630,
        alt: 'pixel.me - Transform images into pixel art',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'pixel.me - Turn your images into pixel art',
    description: 'Transform any image into beautiful pixel art with just one click.',
    images: ['/og-image.png'],
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

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${pixelify.variable} antialiased`}>{children}</body>
    </html>
  );
}
