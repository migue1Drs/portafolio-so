"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { PORTFOLIO_TOPICS } from "@/lib/constants";
import { useProgress } from "@/lib/progress-context";

export function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getCompletionPercent } = useProgress();

  const completionPercent = getCompletionPercent();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  const filteredResults = PORTFOLIO_TOPICS.flatMap((topic) => {
    const topicMatches = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const subtopicMatches = (topic.subtopics || []).filter(sub => 
      sub.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (topicMatches || subtopicMatches.length > 0) {
      return [
        ...(topicMatches && topic.id !== 'prologo' ? [{ id: topic.id, title: topic.title, href: topic.href, isSub: false, parentTitle: '' }] : []),
        ...subtopicMatches.map(sub => ({ id: sub.id, title: sub.title, href: sub.href, isSub: true, parentTitle: topic.title }))
      ];
    }
    return [];
  });

  return (
    <header className="w-full bg-[#1c1c1c]/85 backdrop-blur-md border-b border-[#333333] sticky top-0 z-50 shadow-md">
      {/* Thin progress bar at the very top of the navbar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#30363d]">
        <div
          className="h-full bg-gradient-to-r from-[#f5a623] to-[#3fb950] transition-all duration-1000 ease-out"
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link href="/" className="flex items-center group cursor-pointer shrink-0">
            <div className="w-10 h-10 bg-[#f5a623] transition-colors flex items-center justify-center rounded-sm mr-3 shadow-md">
              <span className="text-[#111111] font-bold text-xl">SO</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-wide group-hover:text-[#f5a623] transition-colors leading-tight">
                PORTAFOLIO
              </span>
              <span className="text-[#f5a623] text-[10px] uppercase tracking-widest leading-tight font-bold mt-0.5">
                Evidencias
              </span>
            </div>
          </Link>

          <div className="flex items-center shrink-0 gap-4">
            {/* Progress badge */}
            <div className="hidden md:flex items-center gap-2 bg-[#252525] border border-[#333333] rounded-sm px-3 py-1.5">
              <div className="w-16 h-1.5 bg-[#30363d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f5a623] to-[#3fb950] rounded-full transition-all duration-700"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#8b949e] font-mono font-bold">
                {completionPercent}%
              </span>
            </div>

            <div className="relative hidden md:block" ref={searchRef}>
              <input 
                type="text" 
                placeholder="Buscar temas, comandos, syscalls..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="bg-[#252525] border border-[#333333] focus:border-[#f5a623] text-white text-xs px-4 py-2 w-72 rounded-sm outline-none transition-colors"
              />
              <svg className="absolute right-3 top-2 w-4 h-4 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              {/* Search Results Dropdown */}
              {isFocused && searchQuery.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-[#1c1c1c] border border-[#333333] rounded-sm shadow-xl max-h-96 overflow-y-auto z-50">
                  {filteredResults.length > 0 ? (
                    <div className="flex flex-col py-2">
                      {filteredResults.map((result, idx) => (
                        <Link 
                          key={idx} 
                          href={result.href}
                          onClick={() => {
                            setIsFocused(false);
                            setSearchQuery("");
                          }}
                          className="px-4 py-3 hover:bg-[#252525] transition-colors border-b border-[#333333] last:border-0"
                        >
                          <div className="text-[#f5a623] text-[10px] font-bold uppercase tracking-widest mb-1">
                            {result.isSub ? result.parentTitle : 'Tema Principal'}
                          </div>
                          <div className="text-white text-xs font-semibold">
                            {result.title}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-[#888888] text-xs text-center">
                      No se encontraron resultados para &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center ml-4">
            <button className="text-[#cccccc] hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
