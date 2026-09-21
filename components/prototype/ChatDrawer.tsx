"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  from: "user" | "shop";
  text: string;
}

const SHOP_REPLIES = [
  "Thank you for your interest! This piece is available — would you like to see more colours?",
  "We can hold this saree for you until evening. When would you like to visit?",
  "Yes, blouse stitching is available. Share your measurements when you're ready.",
  "This is a bestseller this season — happy to send a short video on WhatsApp too.",
];

interface ChatDrawerProps {
  shopName: string;
  open: boolean;
  onClose: () => void;
}

export function ChatDrawer({ shopName, open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setMessages([
      {
        id: "welcome",
        from: "shop",
        text: `Hi from ${shopName}! Ask about size, colour, or availability.`,
      },
    ]);
    setDraft("");
  }, [open, shopName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;

    setMessages((m) => [...m, { id: `u-${Date.now()}`, from: "user", text }]);
    setDraft("");
    setTyping(true);

    const reply =
      SHOP_REPLIES[Math.floor(Math.random() * SHOP_REPLIES.length)];
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `s-${Date.now()}`, from: "shop", text: reply },
      ]);
    }, 700 + Math.random() * 900);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Chat with ${shopName}`}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close chat"
        onClick={onClose}
      />
      <div className="relative flex h-[min(88vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-stone-100 bg-gradient-to-r from-sky-50 to-white px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
            {shopName.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-stone-900">{shopName}</p>
            <p className="text-xs text-sky-700">Mock chat · demo replies</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600 hover:bg-stone-200"
          >
            Done
          </button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-stone-50 px-3 py-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  msg.from === "user"
                    ? "rounded-br-md bg-sky-600 text-white"
                    : "rounded-bl-md bg-white text-stone-800 ring-1 ring-stone-200/80"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
          {typing && (
            <p className="text-xs text-stone-400">● ● ● {shopName} is typing</p>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-stone-100 bg-white p-3">
          <p className="mb-2 text-center text-[10px] text-stone-400">
            Production enquiries still go to WhatsApp (ADR-0004)
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about this saree…"
              className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none ring-sky-500 focus:ring-2"
            />
            <button
              type="submit"
              className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 active:scale-95"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
