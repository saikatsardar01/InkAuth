"use client";

import { useEffect, useState } from "react";
import { Link2, Menu } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  // Parse headers from markdown content
  useEffect(() => {
    const lines = content.split("\n");
    const headings: TOCItem[] = [];
    
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // number of '#'
        const text = match[2].trim().replace(/\*|_|`/g, ""); // clean formatting
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        headings.push({ id, text, level });
      }
    });

    setItems(headings);
  }, [content]);

  // Track scroll position to highlight active header
  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      let currentActiveId = "";
      const scrollPosition = window.scrollY + 200; // offset for navbar/progress

      for (const el of headingElements) {
        if (el.offsetTop <= scrollPosition) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (items.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 120; // account for headers
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-card/20 border border-border p-6 rounded-[2rem] space-y-4 max-h-[70vh] overflow-y-auto sticky top-28">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Menu className="w-4 h-4 text-indigo-400" />
        <h4 className="font-black text-xs uppercase tracking-widest text-foreground">Table of Contents</h4>
      </div>

      <nav className="space-y-2.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`block text-xs font-semibold leading-relaxed transition-all pl-1 border-l-2 ${
              activeId === item.id
                ? "text-indigo-500 border-indigo-500 font-bold translate-x-1"
                : "text-foreground/50 border-transparent hover:text-foreground/80 hover:translate-x-0.5"
            } ${item.level === 3 ? "ml-3 text-[11px]" : ""}`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
