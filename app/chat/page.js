"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) throw new Error("Empty response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botReply += decoder.decode(value, { stream: true });

        setMessages((prev) => [
          ...prev.filter((msg) => msg.sender !== "bot"),
          { text: botReply, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { text: "❌ Error fetching response", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="text-white min-h-screen flex flex-col px-6 py-10">
      {/* Page Title */}
      <h2 className="text-4xl font-extrabold mb-6 text-gray-200 self-start ml-2">
        Ask Your Doubts
      </h2>

      {/* Chat Box */}
      <div className="flex-1 overflow-auto bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg max-w-lg break-words ${
              msg.sender === "user" ? "bg-blue-600 self-end text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            {msg.sender === "bot" ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            ) : (
              <p>{msg.text}</p>
            )}
          </motion.div>
        ))}

        {isLoading && <p className="text-gray-400 animate-pulse">🤖 Thinking...</p>}
      </div>

      {/* Chat Input */}
      <div className="mt-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question..."
          className="flex-1 p-3 bg-gray-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 px-4 py-2 rounded-lg flex items-center hover:bg-purple-500 transition"
          disabled={isLoading}
        >
          <Send size={26} />
        </button>
      </div>
    </div>
  );
}
