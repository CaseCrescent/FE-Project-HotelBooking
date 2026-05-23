import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import ReduxProvider from "@/redux/ReduxProvider";
import AmbientBackground from "@/components/layout/AmbientBackground";
import PageTransition from "@/components/layout/PageTransition";
import RouteProgress from "@/components/layout/RouteProgress";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import AppFooter from "@/components/layout/AppFooter";
import ToasterMount from "@/components/shared/ToasterMount";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Booking — Your Perfect Stay Awaits",
  description: "Hotel booking aggregator. Real-time availability across partner hotels.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nextAuthSession = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AmbientBackground />
        <ReduxProvider>
          <NextAuthProvider session={nextAuthSession}>
            <Suspense fallback={null}>
              <RouteProgress />
            </Suspense>
            <ScrollProgressBar />
            <TopMenu />
            <div className="flex-1 flex flex-col">
              <PageTransition>{children}</PageTransition>
            </div>
            <AppFooter />
            <ToasterMount />
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
