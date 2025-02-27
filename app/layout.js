"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Show Sidebar only on these pages
  const showSidebar = ["/dashboard", "/modules", "/quizzes", "/chat"].includes(pathname);

  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full overflow-y-auto`}>
        <UserProvider>
          {/* Full-height container without scroll overflow issues */}
          <div className="flex h-screen w-full bg-gray-900 overflow-hidden">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 ${showSidebar ? "ml-60" : ""} h-full overflow-y-auto`}>
              {children}
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
