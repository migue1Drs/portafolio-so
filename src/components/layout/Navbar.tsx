"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { PORTFOLIO_TOPICS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
        ...(topicMatches && topic.id !== 'prologo' ? [{ ...topic, isSub: false }] : []),
        ...subtopicMatches.map(sub => ({ ...sub, isSub: true, parentTitle: topic.title }))
      ];
    }
    return [];
  });

  return (
    <header className="w-full bg-[#1c1c1c]/85 backdrop-blur-md border-b border-[#333333] sticky top-0 z-50 shadow-md">
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

          <div className="flex items-center shrink-0">
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
                      No se encontraron resultados para "{searchQuery}"
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
