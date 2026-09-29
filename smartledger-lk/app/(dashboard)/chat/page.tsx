"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Bot, User, MessageCircle, ArrowRight, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { text: "What is my net profit this month?", label: "Net Profit" },
  { text: "List all low stock items in my inventory", label: "Low Stock" },
  { text: "Sinhala: මගේ ව්‍යාපාරයේ ශුද්ධ ලාභය කීයද?", label: "Sinhala Query" },
  { text: "Give me some cost-saving recommendations", label: "Business Tips" }
];

export default function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your SmartLedger AI business assistant. I can query your actual sales, expenses, net profit, and stock alerts to answer specific questions. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: data.message,
            timestamp: new Date()
          }
        ]);
      } else {
        const errData = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: `Error: ${errData.error || "Failed to process message."}`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (e) {
      console.error("Chat fetch error:", e);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "Sorry, I could not connect to the server. Please try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow-brand-sm">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Smart Assistant
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Ask questions about your finances, expense breakdowns, and low stock warnings.
          </p>
        </div>
      </div>

      {/* Main Chat Layout */}
      <Card className="flex-1 flex flex-col min-h-0 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden relative">
        
        {/* Messages scroll box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-brand-500 text-white" 
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-500" />}
                </div>

                {/* Text Bubble */}
                <div className={`p-4 rounded-3xl ${
                  msg.role === "user"
                    ? "bg-brand-gradient text-white rounded-tr-none shadow-glow-brand-sm font-semibold"
                    : "bg-neutral-100/80 dark:bg-neutral-900/80 text-neutral-900 dark:text-neutral-100 rounded-tl-none border border-neutral-200/40 dark:border-neutral-800/40"
                }`}>
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {msg.content}
                  </p>
                  <span className={`block text-[10px] mt-1.5 ${
                    msg.role === "user" ? "text-white/60" : "text-neutral-400"
                  }`}>
                    {msg.timestamp.toLocaleTimeString("en-LK", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Generator Loader */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[85%] mr-auto"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-brand-500 animate-spin" />
              </div>
              <div className="bg-neutral-100/60 dark:bg-neutral-900/60 p-4 rounded-3xl rounded-tl-none border border-neutral-200/40 dark:border-neutral-800/40">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips (only when no input/history is silent or ready) */}
        {messages.length === 1 && !loading && (
          <div className="px-6 pb-2 pt-4 flex flex-wrap gap-2 justify-center shrink-0 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.text)}
                className="text-xs bg-brand-500/10 hover:bg-brand-500 hover:text-white border border-brand-500/20 text-brand-600 dark:text-brand-400 px-3.5 py-1.5 rounded-full transition-all shadow-sm font-medium"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input box form */}
        <div className="p-4 md:p-6 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-950/20 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-3 relative"
          >
            <Input
              type="text"
              placeholder="Ask about monthly profits, stock counts, utility bills..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 pr-12 rounded-2xl h-12"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`absolute right-2 p-2 rounded-xl transition-all ${
                input.trim() && !loading
                  ? "bg-brand-gradient text-white shadow-glow-brand-sm"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
