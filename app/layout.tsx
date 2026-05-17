import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoomMuse",
  description: "Interior design inspiration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--background)] font-sans text-stone-900 antialiased dark:text-stone-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}