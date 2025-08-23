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

  openGraph: {
    title: 'pixel.me',
    description: 'Turn your images into pixel art with a click',
    url: '/',
    siteName: 'pixel.me',
    images: [
      {
        url: 'https://media.cleanshot.cloud/media/43819/Zwyq4eXUPHpYytrpQEvRTiaTtBH5PjzcXkwHoghE.jpeg?Expires=1755930685&Signature=P8VA6sWSMaJ1SIcnTPld~Y3jMVSyTyYAERz55oCIL-EB10llQBCbTfZOOJne6gDLNaDi24WDnniSVGVXaXuJ0OszA7jHscj63G~cftAK-M9m9r88vWJ1J94hnpUhuiT3~vEjzpgMWlzUkUtBXuO00t1c~Bu-JH5TeTy~aRCsQ7d5onKFhvssbOi5fIww1vZtroeNPx3Ed-3l5znkMDSN2J8~1~CkannoyKgviIyT0P~y8J9AMWxcH7WIWpRcAFG0Yf2JcJpL7BlWb25b7TtNhFdrT0NpEY0XXuuPE~asEi6i0D7tGksHlxhiRzcqBwyvjyg95QkkjYgZ~EZu0QIqBQ__&Key-Pair-Id=K269JMAT9ZF4GZ',
        width: 1200,
        height: 630,
        alt: 'A promotional image for pixel.me',
      },
    ],
    locale: 'en-US',
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
