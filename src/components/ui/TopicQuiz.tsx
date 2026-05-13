"use client";

import { useState, useCallback } from "react";
import { useProgress } from "@/lib/progress-context";

/* ── Types ── */
export interface QuizQuestion {
 id: string;
 /** The question — supports JSX-like approach via string or component */
 question: string;
 /** Code snippet to analyze (optional) */
 codeSnippet?: string;
 /** Answer options */
 options: string[];
 /** Index of the correct answer (0-based) */
 correctIndex: number;
 /** Explanation shown after answering */
 explanation: string;
}

interface TopicQuizProps {
 topicId: string;
 title?: string;
 questions: QuizQuestion[];
}

/* ── Component ── */
export function TopicQuiz({
 topicId,
 title = "Test de Comprensión",
 questions,
}: TopicQuizProps) {
 const { markQuizPassed, progress } = useProgress();
 const [currentIndex, setCurrentIndex] = useState(0);
 const [selectedOption, setSelectedOption] = useState<number | null>(null);
 const [isRevealed, setIsRevealed] = useState(false);
 const [correctCount, setCorrectCount] = useState(0);
 const [isFinished, setIsFinished] = useState(false);

 const alreadyPassed = progress[topicId]?.quizPassed;
 const currentQ = questions[currentIndex];
 const isCorrect = selectedOption === currentQ?.correctIndex;

 const handleSelect = useCallback(
 (index: number) => {
 if (isRevealed) return;
 setSelectedOption(index);
 },
 [isRevealed]
 );

 const handleReveal = useCallback(() => {
 if (selectedOption === null) return;
 setIsRevealed(true);
 if (selectedOption === currentQ.correctIndex) {
 setCorrectCount((c) => c + 1);
 }
 }, [selectedOption, currentQ]);

 const handleNext = useCallback(() => {
 if (currentIndex < questions.length - 1) {
 setCurrentIndex((i) => i + 1);
 setSelectedOption(null);
 setIsRevealed(false);
 } else {
 // Finish
 const finalCorrect =
 correctCount + (selectedOption === currentQ.correctIndex ? 0 : 0);
 setIsFinished(true);
 // Pass if >= 70%
 if (((correctCount + (isCorrect ? 1 : 0)) / questions.length) >= 0.7) {
 markQuizPassed(topicId);
 }
 }
 }, [
 currentIndex,
 questions.length,
 correctCount,
 selectedOption,
 currentQ,
 isCorrect,
 markQuizPassed,
 topicId,
 ]);

 const handleRetry = useCallback(() => {
 setCurrentIndex(0);
 setSelectedOption(null);
 setIsRevealed(false);
 setCorrectCount(0);
 setIsFinished(false);
 }, []);

 const finalScore = correctCount;
 const passed = finalScore / questions.length >= 0.7;

 /* ── Finished screen ── */
 if (isFinished) {
 return (
 <div className="my-10 bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
 <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-3 flex items-center gap-3">
 <span className="text-lg"></span>
 <h3 className="text-white font-bold text-sm uppercase tracking-widest">
 {title} — Resultados
 </h3>
 </div>

 <div className="p-8 text-center">
 {/* Score ring */}
 <div className="relative inline-flex items-center justify-center mb-6">
 <svg width="120" height="120" viewBox="0 0 120 120">
 <circle
 cx="60"
 cy="60"
 r="50"
 fill="none"
 stroke="#30363d"
 strokeWidth="8"
 />
 <circle
 cx="60"
 cy="60"
 r="50"
 fill="none"
 stroke={passed ? "#238636" : "#da3633"}
 strokeWidth="8"
 strokeLinecap="round"
 strokeDasharray={`${(finalScore / questions.length) * 314} 314`}
 transform="rotate(-90 60 60)"
 className="transition-all duration-1000 ease-out"
 />
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span
 className={`text-3xl font-bold ${
 passed ? "text-[#3fb950]" : "text-[#f85149]"
 }`}
 >
 {finalScore}/{questions.length}
 </span>
 <span className="text-[10px] text-[#8b949e] uppercase tracking-wider">
 correctas
 </span>
 </div>
 </div>

 <p
 className={`text-lg font-bold mb-2 ${
 passed ? "text-[#3fb950]" : "text-[#f85149]"
 }`}
 >
 {passed
 ? "¡Excelente! Has aprobado el test ✓"
 : "No alcanzaste el mínimo. Inténtalo de nuevo."}
 </p>
 <p className="text-[#8b949e] text-sm mb-6">
 {passed
 ? "Tu progreso ha sido registrado."
 : "Necesitas al menos 70% para aprobar."}
 </p>

 {!passed && (
 <button
 onClick={handleRetry}
 className="bg-[#f5a623] hover:bg-[#d48810] text-[#0d1117] font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors"
 >
 ↺ Reintentar
 </button>
 )}
 </div>
 </div>
 );
 }

 /* ── Quiz in progress ── */
 return (
 <div className="my-10 bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
 {/* Header */}
 <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-3 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-lg"></span>
 <h3 className="text-white font-bold text-sm uppercase tracking-widest">
 {title}
 </h3>
 {alreadyPassed && (
 <span className="text-[#3fb950] text-[10px] font-bold bg-[#23863620] px-2 py-0.5 rounded-full uppercase tracking-wider">
 ✓ Aprobado
 </span>
 )}
 </div>
 <span className="text-[#8b949e] font-mono text-xs">
 {currentIndex + 1} / {questions.length}
 </span>
 </div>

 <div className="p-6">
 {/* Progress bar */}
 <div className="w-full h-1 bg-[#30363d] rounded-full mb-6 overflow-hidden">
 <div
 className="h-full bg-gradient-to-r from-[#f5a623] to-[#d48810] transition-all duration-500 rounded-full"
 style={{
 width: `${((currentIndex + 1) / questions.length) * 100}%`,
 }}
 />
 </div>

 {/* Question */}
 <p className="text-white font-semibold text-base mb-4 leading-relaxed">
 {currentQ.question}
 </p>

 {/* Code snippet */}
 {currentQ.codeSnippet && (
 <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-5 font-mono text-sm overflow-x-auto">
 <pre className="text-[#c9d1d9] whitespace-pre">
 {currentQ.codeSnippet.split("\n").map((line, i) => (
 <div key={i} className="flex">
 <span className="text-[#484f58] select-none w-8 text-right mr-4 shrink-0">
 {i + 1}
 </span>
 <span>{line}</span>
 </div>
 ))}
 </pre>
 </div>
 )}

 {/* Options */}
 <div className="space-y-3 mb-6">
 {currentQ.options.map((option, i) => {
 let borderColor = "border-[#30363d] hover:border-[#484f58]";
 let bgColor = "bg-[#161b22]";
 let textColor = "text-[#c9d1d9]";

 if (selectedOption === i && !isRevealed) {
 borderColor = "border-[#f5a623]";
 bgColor = "bg-[#f5a62310]";
 textColor = "text-white";
 }

 if (isRevealed) {
 if (i === currentQ.correctIndex) {
 borderColor = "border-[#3fb950]";
 bgColor = "bg-[#23863615]";
 textColor = "text-[#3fb950]";
 } else if (selectedOption === i) {
 borderColor = "border-[#f85149]";
 bgColor = "bg-[#da363315]";
 textColor = "text-[#f85149]";
 } else {
 borderColor = "border-[#21262d]";
 textColor = "text-[#484f58]";
 }
 }

 return (
 <button
 key={i}
 onClick={() => handleSelect(i)}
 disabled={isRevealed}
 className={`w-full text-left px-5 py-3.5 rounded-lg border ${borderColor} ${bgColor} transition-all duration-200 flex items-center gap-4 group ${
 isRevealed ? "cursor-default" : "cursor-pointer"
 }`}
 >
 <span
 className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
 selectedOption === i && !isRevealed
 ? "border-[#f5a623] bg-[#f5a623] text-[#0d1117]"
 : isRevealed && i === currentQ.correctIndex
 ? "border-[#3fb950] bg-[#3fb950] text-[#0d1117]"
 : isRevealed && selectedOption === i
 ? "border-[#f85149] bg-[#f85149] text-white"
 : "border-[#484f58] text-[#484f58] group-hover:border-[#8b949e]"
 }`}
 >
 {String.fromCharCode(65 + i)}
 </span>
 <span className={`text-sm font-medium ${textColor}`}>
 {option}
 </span>
 </button>
 );
 })}
 </div>

 {/* Explanation */}
 {isRevealed && (
 <div
 className={`border rounded-lg p-4 mb-6 text-sm leading-relaxed animate-in fade-in duration-300 ${
 isCorrect
 ? "border-[#3fb950] bg-[#23863610] text-[#8b949e]"
 : "border-[#f85149] bg-[#da363310] text-[#8b949e]"
 }`}
 >
 <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">
 {isCorrect ? "✓ ¡Correcto!" : "✗ Incorrecto"}
 </p>
 <p>{currentQ.explanation}</p>
 </div>
 )}

 {/* Actions */}
 <div className="flex justify-end gap-3">
 {!isRevealed ? (
 <button
 onClick={handleReveal}
 disabled={selectedOption === null}
 className={`text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-all ${
 selectedOption !== null
 ? "bg-[#f5a623] hover:bg-[#d48810] text-[#0d1117]"
 : "bg-[#30363d] text-[#484f58] cursor-not-allowed"
 }`}
 >
 Verificar
 </button>
 ) : (
 <button
 onClick={handleNext}
 className="bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors"
 >
 {currentIndex < questions.length - 1
 ? "Siguiente →"
 : "Ver Resultados"}
 </button>
 )}
 </div>
 </div>
 </div>
 );
}
