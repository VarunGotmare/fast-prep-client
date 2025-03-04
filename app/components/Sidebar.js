"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList, MessageSquare } from "lucide-react";
import { Inconsolata } from "next/font/google";

// Import Inconsolata font
const inconsolata = Inconsolata({ subsets: ["latin"] });

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Modules", href: "/modules", icon: <BookOpen size={20} /> },
    { name: "Quizzes", href: "/quizzes", icon: <ClipboardList size={20} /> },
    { name: "Chat", href: "/chat", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="h-screen w-60 bg-gray-950 text-white flex flex-col p-4 fixed overflow-y-auto">
      {/* Apply Inconsolata font */}
      <h2 className={`${inconsolata.className} text-3xl ml-2 font-bold mb-4`}>fastprep</h2>
      <nav className="flex flex-col space-y-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              pathname === link.href ? "bg-purple-500" : "hover:bg-gray-700"
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
