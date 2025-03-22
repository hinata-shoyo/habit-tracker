import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habitual",
  description: "hi :)",
  icons:'/web-app-manifest-192x192.png'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  if(session?.user){
    redirect('/dashboard')
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark:bg-zinc-900 bg-stone-200 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
