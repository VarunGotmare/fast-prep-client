"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);

  // Sample quiz data (Replace with API fetch)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const sampleQuizzes = [
      { id: "daily", title: "Today's Quiz", date: today, pinned: true },
      { id: "physics-quiz-1", title: "Physics - Kinematics", date: "2025-02-22" },
      { id: "chemistry-quiz-1", title: "Chemistry - Organic Reactions", date: "2025-02-21" },
      { id: "maths-quiz-1", title: "Maths - Trigonometry", date: "2025-02-20" },
    ];

    setQuizzes(sampleQuizzes);
  }, []);

  return (
    <div className="text-white min-h-screen px-6 py-10 flex flex-col">
      {/* Page Title */}
      <h2 className="text-4xl font-bold mb-10 text-gray-200 self-start ml-2">
        Quizzes
      </h2>

      {/* Quizzes List Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        {/* Daily Quiz (Pinned) */}
        {quizzes.length > 0 && (
          <motion.div
            key={quizzes[0].id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-purple-600 rounded-2xl shadow-lg cursor-pointer hover:bg-purple-500 flex justify-between items-center"
            onClick={() => router.push(`/quizzes/${quizzes[0].id}`)}
          >
            <div>
              <h3 className="text-xl font-semibold">{quizzes[0].title}</h3>
              <p className="text-md text-gray-300">Date: {quizzes[0].date}</p>
            </div>
            <span className="text-sm font-semibold bg-yellow-500 text-black px-3 py-1 rounded">
              Daily Quiz
            </span>
          </motion.div>
        )}

        {/* Other Quizzes List */}
        <ul className="space-y-6">
          {quizzes.slice(1).map((quiz, index) => (
            <motion.li
              key={quiz.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 border border-gray-700 rounded-2xl bg-gray-800 shadow-lg cursor-pointer hover:bg-gray-700 flex justify-between items-center"
              onClick={() => router.push(`/quizzes/${quiz.id}`)}
            >
              <div>
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
                <p className="text-md text-gray-400">Date: {quiz.date}</p>
              </div>
              <button className="bg-green-500 text-white px-5 py-2 text-lg rounded-xl hover:bg-green-600 transition">
                Start
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
