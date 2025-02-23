"use client";

export default function CircularProgress({ label, completed = 0, total = 1 }) {
  const safeCompleted = Number(completed) || 0;
  const safeTotal = Number(total) || 1;
  const percentage = safeTotal > 0 ? (safeCompleted / safeTotal) * 100 : 0; // Avoid NaN
  const radius = 40; // Circle radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#1e293b" // Dark Gray background
          strokeWidth="8"
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={label === "Maths" ? "#facc15" : label === "Physics" ? "#3b82f6" : "#ef4444"}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)" // Rotates progress to start from the top
        />
        {/* Percentage Text */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy="5"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          {Math.round(percentage)}%
        </text>
      </svg>
      <p className="text-gray-200 mt-2 font-medium">{label}</p>
    </div>
  );
}
