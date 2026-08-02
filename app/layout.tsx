import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "PantryPulse – Track Food, Save Money, Waste Less";
const description = "Track groceries, receive expiry reminders, reduce household food waste, and understand your food-saving habits with PantryPulse.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s · PantryPulse",
  },
  description,
  keywords: ["pantry tracker", "grocery manager", "food waste reduction", "expiry alerts", "household food tracking"],
  authors: [{ name: "PantryPulse Team" }],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "PantryPulse",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f7d53",
};

// Injected before render to prevent flash of wrong theme
const themeScript = `
(function(){
  try{
    var t=localStorage.getItem('pp-theme');
    var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    document.documentElement.setAttribute('data-theme', t||p);
  }catch(e){}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
