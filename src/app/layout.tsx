import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EA Hub - Download EA & Indicator MT4/MT5 Gratis",
  description: "Platform download Expert Advisor dan Indicator MT4 & MT5 gratis tanpa batas. Auto trading, no ribet. Gas cuan!",
  keywords: ["EA MT4", "EA MT5", "Expert Advisor", "Indicator", "MetaTrader", "Trading", "Gratis", "Free EA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        {/* Google Analytics - G-J07SC4JPSB */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J07SC4JPSB" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J07SC4JPSB');
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0B0F1A] text-white">
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            style: {
              background: '#111827',
              border: '1px solid #1F2937',
              color: '#FFFFFF',
            },
          }}
        />
      </body>
    </html>
  );
}
