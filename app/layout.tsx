import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HablaDos - Castilian Spanish Duo",
  description: "Learn authentic Castilian Spanish together with AI conversations, pronunciation feedback, and couple duels.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HablaDos",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      className="h-full bg-neutral-950 text-neutral-100 antialiased"
      suppressHydrationWarning
    >
      <body 
        className="h-full bg-neutral-950 text-neutral-100 overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}