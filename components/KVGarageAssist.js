import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const STARTER_MESSAGES = [
  {
    role: "assistant",
    content: "KV Garage Assist is live. Ask about products, orders, mentorship, or where to find something on the site.",
  },
];

function buildReply(message, context) {
  const text = String(message || "").toLowerCase();

  if (text.includes("order") || text.includes("track")) {
    return "For order help, head to Track Your Order in the footer or visit /track-order. If you already have an order number, that page will show the latest status.";
  }

  if (text.includes("mentor") || text.includes("course") || text.includes("business advice")) {
    return "The Mentorship page is the best place to start if you want supplier access, execution systems, and direct guidance. If you want, I can also point you to the Learn library for business reselling and sales psychology content.";
  }

  if (text.includes("product") || text.includes("inventory") || text.includes("shop")) {
    return `You're currently on ${context}. The Shop page is where retail inventory lives, while Wholesale is better for MOQ-driven sourcing. Use the product grid or ask me about top picks, watches, or new arrivals.`;
  }

  if (text.includes("learn") || text.includes("blog") || text.includes("article")) {
    return "The Learn section now includes latest insights across Business & Reselling, Markets & Investing, AI & Technology, and Sales & Psychology. It's designed to help KV Garage rank while giving customers a deeper reason to stay engaged.";
  }

  if (text.includes("where") || text.includes("find") || text.includes("navigate")) {
    return "Use the top navigation for Retail, Wholesale, Mentorship, and Learn. If you're looking for a specific order or product, I can point you faster if you tell me what you're trying to do.";
  }

  return "I can help with product discovery, order help, business reselling guidance, and site navigation. Try asking about top picks, tracking an order, or which page fits your goal.";
}

export default function KVGarageAssist() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(STARTER_MESSAGES);

  const contextLabel = useMemo(() => {
    if (router.pathname.startsWith("/shop")) return "the retail catalog";
    if (router.pathname.startsWith("/wholesale")) return "the wholesale catalog";
    if (router.pathname.startsWith("/learn")) return "the Learn content engine";
    if (router.pathname.startsWith("/mentorship")) return "the mentorship funnel";
    return "the KV Garage platform";
  }, [router.pathname]);

  useEffect(() => {
    setMessages(STARTER_MESSAGES);
  }, [router.pathname]);

  const send = () => {
    if (!input.trim()) return;
    const nextUserMessage = { role: "user", content: input.trim() };
    const assistantMessage = {
      role: "assistant",
      content: buildReply(input, contextLabel),
    };
    setMessages((prev) => [...prev, nextUserMessage, assistantMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      {open ? (
        <div className="mb-3 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020] shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">KV Garage Assist</p>
              <p className="text-xs text-[#94A3B8]">Context-aware help across the platform</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm text-[#94A3B8]">
              Close
            </button>
          </div>
          <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "assistant" ? "mr-8" : "ml-8"}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "bg-white/5 text-white" : "bg-[#D4AF37] text-black"}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") send();
                }}
                placeholder="Ask about products, orders, or mentorship"
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />
              <button onClick={send} className="rounded-2xl bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black">
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-xl text-black shadow-lg shadow-[#D4AF37]/20"
        aria-label="Open KV Garage Assist"
      >
        ✦
      </button>
    </div>
  );
}

