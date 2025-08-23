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
  metadataBase: new URL('https://pixelme-pi.vercel.app/home'),

  openGraph: {
    title: 'pixel.me',
    description: 'Turn your images into pixel art with a click',
    url: '/',
    siteName: 'pixel.me',
    images: [
      {
        url: 'src/app/favicon.ico',
        width: 1200,
        height: 630,
        alt: 'A promotional image for pixel.me showing pixelated art.',
      },
    ],
    locale: 'src/app/favicon.ico',
    type: 'website',
  },
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
