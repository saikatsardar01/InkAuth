"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

export default function BlogShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url:", err);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="bg-card/20 border border-border p-6 rounded-[2rem] space-y-4">
      <h4 className="font-black text-xs uppercase tracking-widest text-foreground border-b border-border pb-3">Share Article</h4>
      
      <div className="grid grid-cols-4 gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border hover:bg-foreground/5 hover:border-foreground/20 text-foreground/70 hover:text-foreground transition-all gap-1.5 group"
          title="Share on X"
        >
          <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-wider">X (Twitter)</span>
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border hover:bg-foreground/5 hover:border-foreground/20 text-foreground/70 hover:text-foreground transition-all gap-1.5 group"
          title="Share on LinkedIn"
        >
          <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-wider">LinkedIn</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border hover:bg-foreground/5 hover:border-foreground/20 text-foreground/70 hover:text-foreground transition-all gap-1.5 group"
          title="Share on Facebook"
        >
          <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-wider">Facebook</span>
        </a>

        <button
          onClick={handleCopy}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-card border border-border hover:bg-foreground/5 hover:border-foreground/20 text-foreground/70 hover:text-foreground transition-all gap-1.5 group"
          title="Copy Link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500 animate-bounce" />
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-black uppercase tracking-wider">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
