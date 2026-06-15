"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    // Simulate submission to API route
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/10 py-16 px-8 sm:px-16 shadow-2xl mt-20">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] inline-block">
          Newsletter
        </span>
        <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Stay ahead of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">curve</span>
        </h3>
        <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto font-medium">
          Get expert guides, technical case studies, and engineering updates delivered directly to your inbox. No spam, ever.
        </p>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-4 animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
            <h4 className="text-xl font-bold text-white">You are on the list!</h4>
            <p className="text-slate-400 text-sm">Thank you for subscribing. We will send you updates soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group py-4 px-8 bg-white hover:bg-slate-100 disabled:bg-slate-300 text-slate-950 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
