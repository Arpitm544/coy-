import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy — Discover',
  description: 'Coy secret crush & discover experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="h-full bg-[#fbf8f5] text-[#27252b] antialiased">
        {children}
      </body>
    </html>
  );
}
