"use client";

import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

export default function ProfileCard({ username, exam, userClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center gap-6 text-white w-full"
    >
      {/* User Icon */}
      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center shadow-md">
        <UserCircle size={50} className="text-white" />
      </div>

      {/* User Info */}
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold">{username}</h3>
        <p className="text-gray-400 text-lg">{exam} | Class {userClass}</p>
      </div>
    </motion.div>
  );
}
