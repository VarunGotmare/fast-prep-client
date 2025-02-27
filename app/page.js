"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 sm:p-20 bg-gray-100 dark:bg-gray-900 text-center">
      <Image
        src="/ai-tutor-logo.svg" // Replace with your actual logo
        alt="AI Tutor Logo"
        width={200}
        height={50}
        priority
        className="dark:invert"
      />

      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Welcome to AI Tutor
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300">
        Your personalized AI-powered learning platform for JEE & NEET.
      </p>

      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
        onClick={() => router.push("/dashboard")}
      >
        Start Learning
      </button>

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
