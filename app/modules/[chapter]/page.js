"use client";

import { useParams } from "next/navigation";

export default function ModulePage() {
  const { chapter } = useParams();

  return (
    <div className="min-h-screen px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-4 capitalize">{chapter.replace(/-/g, " ")}</h1>
      <p className="text-lg">Module content for <b>{chapter.replace(/-/g, " ")}</b> will be displayed here.</p>
    </div>
  );
}
