import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adomate Lite — AI Ad Studio",
  description:
    "Turn brand and product details into on-brand ad copy and downloadable multi-channel creatives, powered by Claude.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
