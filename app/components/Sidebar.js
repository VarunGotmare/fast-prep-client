"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList } from "lucide-react";
import { MessageSquare } from "lucide-react";


export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Modules", href: "/modules", icon: <BookOpen size={20} /> },
    { name: "Quizzes", href: "/quizzes", icon: <ClipboardList size={20} /> },
    { name: "Chat", href: "/chat", icon: <MessageSquare size={20} /> }, // Added Chat link
  ];

  return (
    <div className="h-screen w-60 bg-gray-950 text-white flex flex-col p-4 fixed overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">fastprep</h2>
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
