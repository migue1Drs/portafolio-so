"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SyntaxHighlighter } from "./SyntaxHighlighter";

interface CopyCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** Si se provee una salida, el bloque se vuelve "Ejecutable" */
  output?: string;
  /** Comando de compilación a simular (opcional) */
  compileCommand?: string;
  /** Comando de ejecución a simular (opcional) */
  runCommand?: string;
}

export function CopyCodeBlock({ 
  code, 
  language = "c", 
  filename,
  output,
  compileCommand = "gcc program.c -o program",
  runCommand = "./program"
}: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estados para la animación de la terminal
  const [terminalPhase, setTerminalPhase] = useState<"idle" | "compiling" | "running" | "done">("idle");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [executionTime, setExecutionTime] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRun = () => {
    if (isRunning) return;
    
    setIsExpanded(true);
    setIsRunning(true);
    setTerminalPhase("compiling");
    setDisplayedOutput("");
    
    // Auto-scroll para asegurar que la terminal se vea
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);

    const startTime = Date.now();

    // Simular fase de compilación
    setTimeout(() => {
      setTerminalPhase("running");
      
      // Simular fase de ejecución
      setTimeout(() => {
        // Efecto máquina de escribir para la salida
        if (output) {
          let i = 0;
          // Mostrar de golpe si es muy largo, o animar si es corto
          const step = output.length > 500 ? 5 : 1;
          const interval = setInterval(() => {
            setDisplayedOutput(output.slice(0, i + step));
            i += step;
            if (i >= output.length) {
              clearInterval(interval);
              setDisplayedOutput(output);
              setTerminalPhase("done");
              setIsRunning(false);
              setExecutionTime(((Date.now() - startTime) / 1000) + 0.12);
            }
          }, 10);
        } else {
          setTerminalPhase("done");
          setIsRunning(false);
          setExecutionTime(((Date.now() - startTime) / 1000));
        }
      }, 500);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6 flex flex-col group hover:border-[#484f58] hover:shadow-[0_8px_30px_rgba(88,166,255,0.05)] transition-all duration-300"
    >
      {/* File header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        {filename && (
          <span className="text-xs text-[#8b949e] font-mono">{filename}</span>
        )}
        <span className="ml-auto text-[10px] text-[#484f58] font-mono uppercase mr-3">{language}</span>
        
        {/* Run button (Only if output is provided) */}
        {output && (
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-all duration-300 mr-2 ${
              isRunning 
                ? "bg-[#2d333b] text-[#8b949e] cursor-not-allowed" 
                : "bg-[#238636] text-white hover:bg-[#2ea043] shadow-[0_0_10px_rgba(35,134,54,0.3)] hover:shadow-[0_0_15px_rgba(46,160,67,0.5)]"
            }`}
          >
            {isRunning ? (
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {isRunning ? "Ejecutando..." : "Ejecutar"}
          </button>
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-all duration-300 ${
            copied
              ? "bg-[#238636] text-white"
              : "bg-[#30363d] text-[#8b949e] hover:bg-[#484f58] hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 font-mono text-sm overflow-x-auto relative">
        <SyntaxHighlighter code={code} language={language} />
      </div>

      {/* Simulated Terminal Output */}
      <div 
        className={`transition-all duration-500 ease-in-out border-t border-[#30363d] bg-[#090c10] grid`}
        style={{ 
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          opacity: isExpanded ? 1 : 0 
        }}
      >
        <div ref={contentRef} className="font-mono text-xs flex flex-col min-h-[120px] overflow-hidden">
          <div className="p-4 flex flex-col h-full">
          {/* Terminal Tab Bar */}
          <div className="flex items-center gap-2 mb-3 text-[#8b949e]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="uppercase tracking-widest text-[10px] font-bold">Terminal de Salida</span>
            {terminalPhase === "done" && (
              <button 
                onClick={() => setIsExpanded(false)}
                className="ml-auto hover:text-white transition-colors"
                title="Cerrar terminal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex-1 space-y-1">
            {/* Compiling step */}
            {(terminalPhase === "compiling" || terminalPhase === "running" || terminalPhase === "done") && (
              <div className="text-[#8b949e]">
                <span className="text-[#58a6ff]">user@linux</span>:<span className="text-[#3fb950]">~</span>$ {compileCommand}
              </div>
            )}
            
            {/* Running step */}
            {(terminalPhase === "running" || terminalPhase === "done") && (
              <div className="text-[#8b949e]">
                <span className="text-[#58a6ff]">user@linux</span>:<span className="text-[#3fb950]">~</span>$ {runCommand}
              </div>
            )}

            {/* Output */}
            {(terminalPhase === "running" || terminalPhase === "done") && displayedOutput && (
              <div className="text-[#e6edf3] whitespace-pre-wrap mt-2 pl-2 border-l-2 border-[#238636]">
                {displayedOutput}
              </div>
            )}
            
            {/* Blinking cursor during execution */}
            {terminalPhase !== "done" && (
              <div className="w-2 h-3 bg-[#f5a623] animate-pulse mt-1 inline-block"></div>
            )}
            
            {/* Return prompt after done */}
            {(terminalPhase === "done") && (
              <div className="mt-4 pt-2 border-t border-[#30363d] flex items-center justify-between text-[#8b949e]">
                <div>
                  <span className="text-[#58a6ff]">user@linux</span>:<span className="text-[#3fb950]">~</span>$ <span className="w-2 h-3 bg-white/50 animate-pulse inline-block align-middle"></span>
                </div>
                <div className="flex items-center gap-2 text-[#3fb950] bg-[#23863620] px-2 py-0.5 rounded text-[10px] font-bold">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Process exited with code 0 ({(executionTime).toFixed(2)}s)
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
