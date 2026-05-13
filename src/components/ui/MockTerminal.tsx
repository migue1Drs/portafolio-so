"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface MockTerminalProps {
 /** The command the user must type */
 expectedCommand: string;
 /** Output shown after correct command */
 output: string;
 /** Terminal title bar text */
 title?: string;
 /** Hint shown if user is stuck */
 hint?: string;
 /** Typing speed for output animation (ms per char) */
 typingSpeed?: number;
 /** Called when the user successfully completes the challenge */
 onComplete?: () => void;
}

export function MockTerminal({
 expectedCommand,
 output,
 title = "bash",
 hint,
 typingSpeed = 8,
 onComplete,
}: MockTerminalProps) {
 const [userInput, setUserInput] = useState("");
 const [isCorrect, setIsCorrect] = useState(false);
 const [isWrong, setIsWrong] = useState(false);
 const [showHint, setShowHint] = useState(false);
 const [attempts, setAttempts] = useState(0);
 const [displayedOutput, setDisplayedOutput] = useState("");
 const [isAnimating, setIsAnimating] = useState(false);
 const [hasCompleted, setHasCompleted] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);
 const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
 const indexRef = useRef(0);

 // Clean up interval on unmount
 useEffect(() => {
 return () => {
 if (intervalRef.current) clearInterval(intervalRef.current);
 };
 }, []);

 const animateOutput = useCallback(() => {
 setIsAnimating(true);
 setDisplayedOutput("");
 indexRef.current = 0;

 intervalRef.current = setInterval(() => {
 if (indexRef.current < output.length) {
 setDisplayedOutput(output.slice(0, indexRef.current + 1));
 indexRef.current++;
 } else {
 if (intervalRef.current) clearInterval(intervalRef.current);
 setIsAnimating(false);
 setHasCompleted(true);
 onComplete?.();
 }
 }, typingSpeed);
 }, [output, typingSpeed, onComplete]);

 const handleSubmit = useCallback(
 (e: React.FormEvent) => {
 e.preventDefault();
 const trimmed = userInput.trim();

 if (trimmed === expectedCommand.trim()) {
 setIsCorrect(true);
 setIsWrong(false);
 animateOutput();
 } else {
 setIsWrong(true);
 setIsCorrect(false);
 setAttempts((a) => a + 1);

 // Auto-clear wrong state after a shake
 setTimeout(() => setIsWrong(false), 600);

 // Show hint after 2 failed attempts
 if (attempts >= 1 && hint) {
 setShowHint(true);
 }
 }
 },
 [userInput, expectedCommand, animateOutput, attempts, hint]
 );

 const handleGiveUp = useCallback(() => {
 setUserInput(expectedCommand);
 setIsCorrect(true);
 setIsWrong(false);
 animateOutput();
 }, [expectedCommand, animateOutput]);

 const highlightOutput = (text: string) => {
 let html = text
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;");

 html = html.replace(/(\/[a-zA-Z0-9_.-]+)+/g, '<span class="text-[#58a6ff] font-bold">$&</span>');
 html = html.replace(/([a-zA-Z0-9_.-]+\.[ch]\b)/g, '<span class="text-[#3fb950]">$1</span>');
 html = html.replace(/(\[INFO\])/g, '<span class="text-[#58a6ff] font-bold">$1</span>');
 html = html.replace(/(\[OK\]|✓)/g, '<span class="text-[#238636] font-bold">$1</span>');
 html = html.replace(/(\[ERROR\]|✗)/g, '<span class="text-[#ff5f56] font-bold">$1</span>');

 return html;
 };

 return (
 <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6">
 {/* Terminal header */}
 <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
 <div className="flex space-x-2">
 <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
 <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
 <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
 </div>
 <div className="mx-auto text-xs text-[#8b949e] font-mono select-none flex items-center gap-2">
 <span className="inline-block w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
 {title} — interactiva
 </div>
 {!isCorrect && attempts >= 3 && (
 <button
 onClick={handleGiveUp}
 className="text-[10px] text-[#8b949e] hover:text-[#f5a623] transition-colors font-mono"
 >
 mostrar solución
 </button>
 )}
 </div>

 {/* Terminal body */}
 <div
 className="p-4 font-mono text-sm min-h-[80px] cursor-text"
 onClick={() => inputRef.current?.focus()}
 >
 {/* Prompt + input */}
 {!isCorrect ? (
 <form onSubmit={handleSubmit} className="flex items-center">
 <span className="text-[#58a6ff] shrink-0">user@linux</span>
 <span className="text-white shrink-0">:</span>
 <span className="text-[#3fb950] shrink-0">~</span>
 <span className="text-white shrink-0">$&nbsp;</span>
 <input
 ref={inputRef}
 type="text"
 value={userInput}
 onChange={(e) => setUserInput(e.target.value)}
 className={`bg-transparent outline-none text-white flex-1 caret-[#f5a623] ${
 isWrong ? "animate-shake" : ""
 }`}
 placeholder="Escribe el comando aquí..."
 autoFocus
 spellCheck={false}
 autoComplete="off"
 autoCapitalize="off"
 />
 </form>
 ) : (
 <div className="mb-2">
 <span className="text-[#58a6ff]">user@linux</span>
 <span className="text-white">:</span>
 <span className="text-[#3fb950]">~</span>
 <span className="text-white">$ {expectedCommand}</span>
 </div>
 )}

 {/* Wrong feedback */}
 {isWrong && (
 <div className="text-[#f85149] text-xs mt-2 animate-in fade-in duration-200">
 bash: comando no reconocido. Intenta de nuevo.
 </div>
 )}

 {/* Hint */}
 {showHint && hint && !isCorrect && (
 <div className="mt-3 border border-[#f5a62330] bg-[#f5a62308] rounded-lg px-4 py-2.5 animate-in fade-in duration-300">
 <p className="text-[#f5a623] text-[10px] font-bold uppercase tracking-wider mb-1">
 Pista
 </p>
 <p className="text-[#8b949e] text-xs font-mono">{hint}</p>
 </div>
 )}

 {/* Output */}
 {isCorrect && (
 <div className="text-[#c9d1d9] whitespace-pre flex">
 <span
 dangerouslySetInnerHTML={{
 __html: highlightOutput(displayedOutput),
 }}
 />
 {isAnimating && (
 <span className="inline-block w-2 h-4 bg-[#f5a623] ml-0.5 animate-pulse shrink-0"></span>
 )}
 </div>
 )}

 {/* Completion badge */}
 {hasCompleted && (
 <div className="mt-3 flex items-center gap-2 text-[#3fb950] text-xs font-bold animate-in fade-in duration-500">
 <svg
 className="w-4 h-4"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M5 13l4 4L19 7"
 />
 </svg>
 Comando ejecutado correctamente
 </div>
 )}
 </div>
 </div>
 );
}
