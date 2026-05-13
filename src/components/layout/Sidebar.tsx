"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PORTFOLIO_TOPICS } from "@/lib/constants";
import { useProgress } from "@/lib/progress-context";

export function Sidebar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<string>("");
  const { isTopicComplete, getCompletionPercent, progress, resetProgress } = useProgress();

  const completionPercent = getCompletionPercent();

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

      {/* Progress overview */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">
            Progreso general
          </span>
          <span className="text-[10px] text-[#f5a623] font-bold font-mono">
            {completionPercent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#30363d] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#f5a623] to-[#d48810] rounded-full transition-all duration-700 ease-out progress-bar-glow"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-4">
        {PORTFOLIO_TOPICS.map((topic, i) => {
          const isActive = pathname === topic.href;
          const numberStr = (i + 1).toString().padStart(2, '0');
          const topicComplete = isTopicComplete(topic.id);
          const topicQuizPassed = progress[topic.id]?.quizPassed;
          
          return (
            <div key={topic.id} className="group">
              <Link
                href={topic.href}
                className="flex items-center"
              >
                {/* Completion indicator */}
                <div className="mr-3 shrink-0">
                  {topicComplete ? (
                    <div className="w-5 h-5 rounded-full bg-[#238636] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold transition-colors ${
                      isActive 
                        ? "border-[#f5a623] text-[#f5a623]" 
                        : "border-[#484f58] text-[#484f58] group-hover:border-[#888888]"
                    }`}>
                      {numberStr}
                    </div>
                  )}
                </div>

                <div className={`text-sm font-bold transition-colors flex-1 ${
                  isActive
                    ? "text-white"
                    : topicComplete
                    ? "text-[#8b949e] group-hover:text-[#f5a623]"
                    : "text-[#cccccc] group-hover:text-[#f5a623]"
                }`}>
                  {topic.title}
                </div>

                {/* Quiz badge */}
                {topicQuizPassed && (
                  <span className="ml-2 text-[8px] bg-[#23863620] text-[#3fb950] px-1.5 py-0.5 rounded-full font-bold shrink-0">
                    QUIZ ✓
                  </span>
                )}
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

      <div className="p-6 mt-auto space-y-3">
        {/* Reset progress */}
        <button
          onClick={resetProgress}
          className="w-full text-[10px] text-[#484f58] hover:text-[#f85149] transition-colors font-bold uppercase tracking-wider py-2"
        >
          ↺ Reiniciar progreso
        </button>

        <div className="bg-[#252525] border border-[#333333] rounded-sm p-4 text-center">
          <div className="text-[#f5a623] text-xs font-bold uppercase mb-2 tracking-widest">Autores:</div>
          <div className="text-xs text-[#cccccc] font-semibold mb-1">Gonzalez Giron Luis Eduardo</div>
          <div className="text-xs text-[#cccccc] font-semibold">Suárez Dolores Miguel</div>
        </div>
      </div>
    </aside>
  );
}
