import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://rag-assistant-gm9x.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();

      // const botMsg = { role: "assistant", text: data.reply }; 
      const botMsg = {
              role: "assistant",
              text: data.reply || data.error || "No reply received from backend.",
              sources: data.sources || []
                  };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Server connection failed." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden relative">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-4xl h-[85vh] backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl flex flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/10 text-gray-100"
                  }`}
                >
                  {msg.text}
                  {msg.role === "assistant" && msg.sources?.length > 0 && (
                 <div className="mt-3 text-xs text-gray-300">
                <p className="font-semibold mb-1">Sources:</p>
                <ul className="list-disc ml-4 space-y-1">
                   {msg.sources.map((source, i) => (
                  <li key={i}>{source}</li>
                  ))}
               </ul>
               </div>
              )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-sm"
            >
              AI is thinking...
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/10 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something powerful..."
            className="flex-1 bg-white/10 text-white px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:scale-105 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="p-6 border-b border-white/10 flex items-center gap-3 text-white">
      <Sparkles className="text-purple-400" />
      <h1 className="text-xl font-semibold tracking-wide">
        Production-Grade GenAI Assistant with RAG
      </h1>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl top-[-200px] left-[-200px]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        className="absolute w-[700px] h-[700px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl bottom-[-200px] right-[-200px]"
      />
    </div>
  );
}
