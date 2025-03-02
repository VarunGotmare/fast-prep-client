"use client";

import { useUser } from "../../context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import StreakCard from "../components/StreakCard";
import ProfileCard from "../components/ProfileCard";
import CircularProgress from "../components/ProgressCircle";
import { Progress } from "rsuite";
import ProgressCircle from "../components/ProgressCircle";

export default function Dashboard() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  if (loading) return <p className="text-center text-gray-300">Loading...</p>;
  if (!user) return null;

  return (
    <div className="text-white min-h-screen px-6 py-10 flex flex-col">
      {/* Dashboard Title */}
      <h2 className="text-4xl font-bold mb-10 text-gray-200 self-start ml-2">
        Your prep for {user.exam}
      </h2>

      {/* Container for cards */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        {/* First Row: Profile and Streak Cards */}
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileCard username={user.username} exam={user.exam} userClass={user.class} />
          <StreakCard streak={user.streak || 0} />
        </div>

        {/* Second Row: Progress Card (Full Width) */}
        {/* <ProgressCircle />
         */}
         <div className=''>
    <Progress.Circle className="w-32" strokeColor="#ffc107" trailColor="#222423" percent={30} />
  </div>
        
      </div>

      {/* Floating Ask Doubts Button */}
      <button
        onClick={() => router.push("/chat")}
        className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-all"
      >
        <MessageSquare size={24} /> Ask Doubts
      </button>
    </div>
  );
}
