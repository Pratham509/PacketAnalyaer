import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPI Packet Analyzer",
  description: "Deep Packet Inspection Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-slate-50 min-h-screen selection:bg-indigo-500/30">
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        {children}
      </body>
    </html>
  );
}
