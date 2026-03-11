import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sufumi — Minimal developer tools",
    template: "%s — Sufumi",
  },
  description:
    "Sufumi is a focused suite of developer tools: editors, CLIs, and frameworks built for speed, clarity, and tiny footprints.",
  applicationName: "Sufumi",
  category: "Developer Tools",
  keywords: [
    "Sufumi",
    "developer tools",
    "CLI",
    "Go",
    "Java",
    "Tauri",
    "desktop apps",
    "package manager",
    "hot reload",
    "code editor",
  ],
  authors: [{ name: "Jasn Rathore" }],
  creator: "Jasn Rathore",
  publisher: "Sufumi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Sufumi",
    title: "Sufumi — Minimal developer tools",
    description:
      "A focused suite of developer tools: editors, CLIs, and frameworks built for speed, clarity, and tiny footprints.",
  },
  twitter: {
    card: "summary",
    title: "Sufumi — Minimal developer tools",
    description:
      "A focused suite of developer tools: editors, CLIs, and frameworks built for speed, clarity, and tiny footprints.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
