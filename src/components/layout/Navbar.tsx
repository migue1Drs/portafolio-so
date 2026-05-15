"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_TOPICS } from "@/lib/constants";
import { useProgress } from "@/lib/progress-context";
import { buildSearchIndex, scoreEntry, type SearchEntry } from "@/lib/search-index";

const TYPE_ICONS: Record<SearchEntry["type"], string> = {
  topic: "📘",
  subtopic: "📄",
  function: "⚙️",
  command: "💻",
  concept: "💡",
};

const TYPE_LABELS: Record<SearchEntry["type"], string> = {
  topic: "Tema",
  subtopic: "Sección",
  function: "Función",
  command: "Comando",
  concept: "Concepto",
};

const TYPE_COLORS: Record<SearchEntry["type"], string> = {
  topic: "text-[#f5a623]",
  subtopic: "text-[#8b949e]",
  function: "text-[#d2a8ff]",
  command: "text-[#3fb950]",
  concept: "text-[#58a6ff]",
};

export function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getCompletionPercent } = useProgress();
  const completionPercent = getCompletionPercent();

  const searchIndex = useMemo(() => buildSearchIndex(PORTFOLIO_TOPICS), []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsFocused(false);
        setMobileMenuOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search + score + sort
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const scored = searchIndex
      .map((entry) => ({ entry, score: scoreEntry(entry, searchQuery) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
    return scored;
  }, [searchQuery, searchIndex]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(-1);
  }, [filteredResults]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIdx >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("[data-result-item]");
      items[selectedIdx]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx]);

  // Keyboard navigation inside results
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!filteredResults.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === "Enter" && selectedIdx >= 0) {
        e.preventDefault();
        const target = filteredResults[selectedIdx];
        if (target) {
          window.location.href = target.entry.href;
          setIsFocused(false);
          setSearchQuery("");
        }
      }
    },
    [filteredResults, selectedIdx]
  );

  // Highlight matching text
  function highlight(text: string, query: string) {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[#f5a623] font-bold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  }

  // Shared search results renderer
  const SearchResults = ({ mobile = false }: { mobile?: boolean }) => (
    <AnimatePresence>
      {isFocused && searchQuery.trim().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          ref={resultsRef}
          className={`${mobile ? "w-full mt-2" : "absolute top-full mt-2 w-full"} bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl shadow-black/50 max-h-[420px] overflow-y-auto z-50 custom-scrollbar`}
        >
          {filteredResults.length > 0 ? (
            <>
              <div className="px-3 py-2 border-b border-[#30363d] flex items-center justify-between">
                <span className="text-[10px] text-[#8b949e] uppercase tracking-widest font-bold">
                  {filteredResults.length} resultado{filteredResults.length !== 1 ? "s" : ""}
                </span>
                <span className="text-[10px] text-[#484f58] hidden sm:block">↑↓ Navegar · Enter Ir</span>
              </div>
              <div className="py-1">
                {filteredResults.map(({ entry }, idx) => (
                  <Link
                    key={entry.id + idx}
                    href={entry.href}
                    data-result-item
                    onClick={() => {
                      setIsFocused(false);
                      setSearchQuery("");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-start gap-3 px-3 py-2.5 transition-colors ${idx === selectedIdx
                      ? "bg-[#1f6feb]/15 border-l-2 border-[#1f6feb]"
                      : "hover:bg-[#1c2128] border-l-2 border-transparent"
                      }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-xs font-semibold truncate">
                          {highlight(entry.title, searchQuery)}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider shrink-0 ${TYPE_COLORS[entry.type]}`}>
                          {TYPE_LABELS[entry.type]}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8b949e] truncate">{entry.description}</div>
                      <div className="text-[10px] text-[#484f58] mt-0.5 truncate">{entry.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-[#8b949e] text-xs">
                No se encontraron resultados para <span className="text-white font-semibold">&quot;{searchQuery}&quot;</span>
              </div>
              <div className="text-[#484f58] text-[10px] mt-1">
                Intenta con funciones (fork, pipe), comandos (ls, pwd) o conceptos (zombie, inodo)
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header className="w-full bg-[#1c1c1c]/85 backdrop-blur-md border-b border-[#333333] sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center group cursor-pointer shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-[#f5a623] transition-colors flex items-center justify-center rounded-sm mr-2 md:mr-3 shadow-md">
                <span className="text-[#111111] font-bold text-lg md:text-xl">SO</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-base md:text-lg tracking-wide group-hover:text-[#f5a623] transition-colors leading-tight">
                  PORTAFOLIO
                </span>
                <span className="text-[#f5a623] text-[9px] md:text-[10px] uppercase tracking-widest leading-tight font-bold mt-0.5">
                  Evidencias
                </span>
              </div>
            </Link>

            {/* ── Desktop Search ── */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className={`w-72 lg:w-80 flex items-center bg-[#252525] border rounded-md transition-all duration-200 ${isFocused ? "border-[#f5a623] shadow-[0_0_0_1px_rgba(245,166,35,0.2)]" : "border-[#333333]"}`}>
                <svg className="w-4 h-4 text-[#666] ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar funciones, comandos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-white text-xs px-3 py-2.5 w-full outline-none placeholder:text-[#666]"
                />
                {!isFocused && (
                  <kbd className="text-[10px] text-[#555] bg-[#1c1c1c] border border-[#333] rounded px-1.5 py-0.5 mr-3 font-mono shrink-0">
                    Ctrl+K
                  </kbd>
                )}
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); inputRef.current?.focus(); }}
                    className="text-[#666] hover:text-white mr-3 shrink-0 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <SearchResults />
            </div>

            {/* ── Mobile: Search icon + Hamburger ── */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile search toggle */}
              <button
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setMobileMenuOpen(false);
                  setTimeout(() => mobileInputRef.current?.focus(), 100);
                }}
                className="p-2 text-[#cccccc] hover:text-white transition-colors"
                aria-label="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Hamburger */}
              <button
                onClick={() => {
                  setMobileMenuOpen((v) => !v);
                  setMobileSearchOpen(false);
                }}
                className="p-2 text-[#cccccc] hover:text-white transition-colors"
                aria-label="Menú"
              >
                <motion.div
                  animate={mobileMenuOpen ? "open" : "closed"}
                  className="w-5 h-5 flex flex-col justify-center gap-[5px]"
                >
                  <motion.span
                    variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }}
                    transition={{ duration: 0.25 }}
                    className="block h-0.5 w-full bg-current rounded-full origin-center"
                  />
                  <motion.span
                    variants={{ closed: { opacity: 1, scaleX: 1 }, open: { opacity: 0, scaleX: 0 } }}
                    transition={{ duration: 0.25 }}
                    className="block h-0.5 w-full bg-current rounded-full"
                  />
                  <motion.span
                    variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }}
                    transition={{ duration: 0.25 }}
                    className="block h-0.5 w-full bg-current rounded-full origin-center"
                  />
                </motion.div>
              </button>
            </div>
          </div>

          {/* ── Mobile Search Bar (collapsible) ── */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden pb-3"
              >
                <div className={`flex items-center bg-[#252525] border rounded-md transition-all duration-200 ${isFocused ? "border-[#f5a623]" : "border-[#333333]"}`}>
                  <svg className="w-4 h-4 text-[#666] ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={mobileInputRef}
                    type="text"
                    placeholder="Buscar funciones, comandos, conceptos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent text-white text-sm px-3 py-3 w-full outline-none placeholder:text-[#666]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(""); mobileInputRef.current?.focus(); }}
                      className="text-[#666] hover:text-white mr-3 shrink-0 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <SearchResults mobile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-[#161b22] border-l border-[#30363d] z-50 md:hidden flex flex-col overflow-y-auto custom-scrollbar"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363d]">
                <div>
                  <h2 className="text-white font-bold text-base tracking-wide">Índice</h2>
                  <p className="text-[#f5a623] text-[10px] uppercase tracking-widest font-bold">Sistemas Operativos</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#8b949e] hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-5 py-3 border-b border-[#30363d]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">Progreso general</span>
                  <span className="text-[10px] text-[#f5a623] font-bold font-mono">{completionPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#30363d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f5a623] to-[#d48810] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {PORTFOLIO_TOPICS.map((topic, i) => {
                  const isActive = pathname === topic.href;
                  const numberStr = (i + 1).toString().padStart(2, "0");
                  return (
                    <Link
                      key={topic.id}
                      href={topic.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-[#f5a623]/10 border border-[#f5a623]/30 text-white"
                          : "text-[#cccccc] hover:bg-[#1c2128] hover:text-white border border-transparent"
                      }`}
                    >
                      <span className={`text-[10px] font-bold font-mono w-5 text-center shrink-0 ${isActive ? "text-[#f5a623]" : "text-[#484f58]"}`}>
                        {numberStr}
                      </span>
                      <span className="text-sm font-semibold">{topic.title}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f5a623] shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Authors footer */}
              <div className="px-5 py-4 border-t border-[#30363d] mt-auto">
                <div className="bg-[#252525] border border-[#333333] rounded-lg p-4 text-center">
                  <div className="text-[#f5a623] text-[10px] font-bold uppercase mb-2 tracking-widest">Autores</div>
                  <div className="text-xs text-[#cccccc] font-semibold mb-1">Gonzalez Giron Luis Eduardo</div>
                  <div className="text-xs text-[#cccccc] font-semibold">Suárez Dolores Miguel</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
