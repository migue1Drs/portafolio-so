"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PORTFOLIO_TOPICS } from "@/lib/constants";

export function Sidebar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    // Collect all subtopic hashes for the current page
    const currentTopic = PORTFOLIO_TOPICS.find(t => t.href === pathname);
    if (!currentTopic || !currentTopic.subtopics) {
      setActiveHash("");
      return;
    }

    const hashes = currentTopic.subtopics.map(s => s.href.split('#')[1]).filter(Boolean);
    const elements = hashes.map(hash => document.getElementById(hash)).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible entry
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio or just pick the first (topmost) visible element
          setActiveHash(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Triggers when the element is in the upper part of the viewport
        threshold: 0
      }
    );

    elements.forEach(el => observer.observe(el));

    // Handle initial hash on load or manual navigation
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && hashes.includes(hash)) {
        setActiveHash(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    
    // Check initial hash
    if (window.location.hash) {
      handleHashChange();
    } else {
      // Set to first section if at top
      if (window.scrollY < 100 && elements.length > 0) {
        setActiveHash(elements[0].id);
      }
    }

    return () => {
      elements.forEach(el => observer.unobserve(el));
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return (
    <aside className="h-full bg-[#1c1c1c]/50 backdrop-blur-xl overflow-y-auto flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="text-2xl text-[#f5a623] font-bold uppercase tracking-wider mb-2">Índice</h3>
        <p className="text-xs text-[#888888] uppercase tracking-wider border-b border-[#333333] pb-4">
          Navegación del curso
        </p>
      </div>

      <nav className="flex-1 px-6 space-y-4">
        {PORTFOLIO_TOPICS.map((topic, i) => {
          const isActive = pathname === topic.href;
          const numberStr = (i + 1).toString().padStart(2, '0');
          
          return (
            <div key={topic.id} className="group">
              <Link
                href={topic.href}
                className="flex items-center"
              >
                <div className={`text-xs font-bold mr-4 transition-colors ${isActive ? "text-[#f5a623]" : "text-[#555555] group-hover:text-[#888888]"}`}>
                  {numberStr}
                </div>
                <div className={`text-sm font-bold transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-[#cccccc] group-hover:text-[#f5a623]"
                }`}>
                  {topic.title}
                </div>
              </Link>
              
              {topic.subtopics && isActive && (
                <div className="ml-8 mt-3 mb-4 space-y-2 border-l border-[#333333] pl-4">
                  {topic.subtopics.map((sub) => {
                    const subHash = sub.href.split('#')[1];
                    const isSubActive = activeHash === subHash;
                    
                    return (
                      <Link
                        key={sub.id}
                        href={sub.href}
                        className={`block text-xs transition-colors ${
                          isSubActive
                            ? "text-[#f5a623] font-bold"
                            : "text-[#888888] hover:text-[#cccccc]"
                        }`}
                        onClick={() => setActiveHash(subHash)}
                      >
                        • {sub.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-[#252525] border border-[#333333] rounded-sm p-4 text-center">
          <div className="text-[#f5a623] text-xs font-bold uppercase mb-2 tracking-widest">Autores:</div>
          <div className="text-xs text-[#cccccc] font-semibold mb-1">Gonzalez Giron Luis Eduardo</div>
          <div className="text-xs text-[#cccccc] font-semibold">Suárez Dolores Miguel</div>
        </div>
      </div>
    </aside>
  );
}
