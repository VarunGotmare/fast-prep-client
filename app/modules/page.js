"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { subjectData } from "../../data/data"; // Ensure correct path

export default function ModulesPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sortBy, setSortBy] = useState("sequence"); // Default sorting method
  const router = useRouter();

  const sortModules = (modules) => {
    return [...modules].sort((a, b) => {
      if (sortBy === "sequence") return a.sequence - b.sequence;
      if (sortBy === "weightage") return b.weightage - a.weightage;
      if (sortBy === "priority") return b.priority - a.priority;
    });
  };

  return (
    <div className="text-white min-h-screen px-6 py-10 flex flex-col">
      {/* Page Title */}
      <h2 className="text-4xl font-bold mb-10 text-gray-200 self-start ml-2">
        Select Your Modules
      </h2>

      {/* Subject Selection */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(subjectData).map((subject) => (
          <motion.button
            key={subject}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`px-6 py-3 rounded-xl font-semibold text-lg transition ${
              selectedSubject === subject
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </motion.button>
        ))}
      </div>

      {/* Sorting Options */}
      {selectedSubject && (
        <div className="mb-6">
          <label className="text-lg font-semibold mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-700 text-white font-semibold"
          >
            <option value="sequence">Default</option>
            <option value="weightage">Weightage (High to Low)</option>
            <option value="priority">Priority (High to Low)</option>
          </select>
        </div>
      )}

      {/* Modules List */}
      {!selectedSubject && (
        <p className="text-gray-400 text-lg">Choose a subject to view modules.</p>
      )}

      {selectedSubject && subjectData[selectedSubject] && (
        <div className="mt-6 w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{selectedSubject} Modules</h2>
          <ul className="space-y-6">
            {sortModules(subjectData[selectedSubject]).map((module) => (
              <motion.li
                key={module.chapter}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-6 border border-gray-700 rounded-2xl flex justify-between items-center bg-gray-800 shadow-lg"
              >
                <div>
                  <span className="text-xl font-semibold">{module.chapter}</span>
                  <p className="text-md text-gray-400">
                    Weightage: {module.weightage} | Priority: {module.priority}
                  </p>
                </div>
                <button
                  className="bg-green-500 text-white px-5 py-2 text-lg rounded-xl hover:bg-green-600 transition"
                  onClick={() =>
                    router.push(`/modules/${module.chapter.replace(/\s+/g, "-").toLowerCase()}`)
                  }
                >
                  Start
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
