import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./components/Providers";
export const metadata: Metadata = {
  title: "OSM",
  description: "Multi-store order management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
