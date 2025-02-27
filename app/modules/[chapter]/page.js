"use client";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ModulePage() {
  const { chapter } = useParams();
  const router = useRouter(); // 🚀 For navigation
  const formattedChapter = chapter.replace(/-/g, " ");
  const [content, setContent] = useState(""); // Store streamed content
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStartedGenerating, setHasStartedGenerating] = useState(false);
  const bottomRef = useRef(null); // 🔥 Reference to the bottom of content

  useEffect(() => {
    async function fetchStudyMaterial() {
      setIsLoading(true);
      setContent("");
      setHasStartedGenerating(false);

      try {
        const response = await fetch("/api/generate-module", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapter: formattedChapter }),
        });

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          if (!hasStartedGenerating) {
            setHasStartedGenerating(true);
          }

          setContent((prev) => prev + chunk);
        }
      } catch (error) {
        console.error("Error fetching study material:", error);
        setContent("❌ Error loading study material.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudyMaterial();
  }, [formattedChapter]);

  useEffect(() => {
    // 🔥 Scroll to bottom whenever content updates
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [content]);

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  const handleCloseModule = () => {
    router.push("/modules"); // 🚀 Navigate back to module list
  };

  return (
    <div className="min-h-screen px-8 py-12 text-white bg-gray-900 overflow-auto relative">
      {/* Close Button (Top-Right) */}
      <motion.button
        onClick={handleCloseModule}
        whileTap={{ scale: 0.9 }} // Click feedback
        whileHover={{ scale: 1.1 }} // Hover effect
        className="absolute top-6 right-6 p-3 bg-slate-600 hover:bg-late-700 text-white rounded-full shadow-lg"
      >
        ❌
      </motion.button>

      <h1 className="text-4xl font-bold mb-6 capitalize">{formattedChapter}</h1>

      {isLoading && !hasStartedGenerating && (
        <p className="text-lg text-gray-300 animate-pulse">⏳ Generating study material...</p>
      )}

      <div className="prose prose-xl prose-invert leading-relaxed max-w-full space-y-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4" {...props} />,
            p: ({ node, ...props }) => <p className="text-lg leading-relaxed mt-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2" {...props} />,
            li: ({ node, ...props }) => (
              <li className="align-baseline ml-4" {...props} /> // 🔥 Fix applied here!
            ),
            strong: ({ node, ...props }) => <strong className="font-bold text-yellow-300" {...props} />,
            code: ({ node, ...props }) => (
              <code className="bg-gray-800 text-yellow-200 px-2 py-1 rounded-md text-sm" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        <div ref={bottomRef} /> {/* 🔥 Scroll target */}
      </div>

      {/* Floating Mark as Completed Button */}
      <motion.button
        onClick={handleMarkComplete}
        whileTap={{ scale: 0.9 }} // Click feedback
        whileHover={{ scale: 1.1 }} // Hover bounce
        animate={isCompleted ? { scale: 1.2 } : { scale: 1 }} // Single keyframe fix
        transition={{ type: "spring", stiffness: 200 }}
        className={`fixed bottom-6 right-6 px-6 py-3 text-lg font-semibold rounded-full transition-all shadow-lg ${
          isCompleted ? "bg-green-600 text-white cursor-default" : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
        disabled={isCompleted}
      >
        {isCompleted ? "✅ Completed" : "✔ Mark as Completed"}
      </motion.button>
    </div>
  );
}
