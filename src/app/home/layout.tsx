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
