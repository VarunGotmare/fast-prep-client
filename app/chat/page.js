"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

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

      const botReply = await response.json();
      const aiMessage = { text: botReply.result || "🤖 No response", sender: "bot" };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { text: "❌ Error fetching response", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white h-screen flex flex-col px-6 py-6">
      <h2 className="text-4xl font-extrabold mb-4">Ask Your Doubts</h2>

      {/* Chat Box */}
      <div className="flex-1 overflow-auto bg-inherit p-4 rounded-xl space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg w-fit max-w-xs ${
              msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-700"
            }`}
          >
            <p>{msg.text}</p>
          </motion.div>
        ))}

        {isLoading && <p className="text-gray-400">🤖 Thinking...</p>}
      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-3 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-3 bg-gray-700 rounded-lg text-white outline-none"
        />
        <button onClick={sendMessage} className="bg-purple-600 px-4 py-2 rounded-lg flex items-center">
          <Send size={26} />
        </button>
      </div>
    </div>
  );
}
