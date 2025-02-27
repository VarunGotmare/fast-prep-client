"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StreakCard({ streak }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-between text-white w-full"
    >
      {/* Streak Icon */}
      <div className="relative flex items-center">
        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
          <Flame size={50} className="text-white" />
        </div>
        {/* Streak Count at Top Right */}
        <div className="absolute -top-3 -right-6 bg-yellow-500 text-black px-3 py-1 rounded-full text-lg font-bold shadow-md">
          {streak}🔥
        </div>
      </div>

      {/* Streak Text */}
      <h3 className="text-2xl font-bold">Daily Streak</h3>

      {/* Solve Today's Quiz Button */}
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        onClick={() => router.push("/quiz/today")}
      >
        Solve Today's Quiz
      </button>
    </motion.div>
  );
}
