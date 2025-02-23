"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const newMessage = { text: input, file, sender: "user" };
    setMessages([...messages, newMessage]);

    setInput("");
    setFile(null);

    // Send to AI API (Implement API call here)
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input, file }),
    });

    const botReply = await response.json();
    setMessages((prev) => [...prev, { text: botReply.reply, sender: "bot" }]);
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
            {msg.file ? (
              <img src={URL.createObjectURL(msg.file)} alt="Uploaded file" className="max-w-full rounded-lg" />
            ) : (
              <p>{msg.text}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center gap-3 py-3">
        <label className="cursor-pointer">
          <Paperclip size={24} className="text-gray-400" />
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
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
