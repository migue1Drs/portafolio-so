"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface InteractiveTerminalProps {
  command?: string;
  output: string;
  title?: string;
  typingSpeed?: number;
}

export function InteractiveTerminal({
  command,
  output,
  title = "bash",
  typingSpeed = 12,
}: InteractiveTerminalProps) {
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  const runAnimation = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setDisplayedOutput("");
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (indexRef.current < output.length) {
        setDisplayedOutput(output.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setHasRun(true);
      }
    }, typingSpeed);
  }, [output, typingSpeed, isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const highlightTerminal = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Directorios y rutas (ej. /home/user, /bin, dir/)
    html = html.replace(/(\/[a-zA-Z0-9_.-]+)+/g, '<span class="text-[#58a6ff] font-bold">$&</span>');
    html = html.replace(/(\b[a-zA-Z0-9_-]+\/)(?=\s|$)/g, '<span class="text-[#58a6ff] font-bold">$1</span>');

    // Archivos .c o binarios
    html = html.replace(/([a-zA-Z0-9_.-]+\.[ch]\b)/g, '<span class="text-[#3fb950]">$1</span>');
    html = html.replace(/(\.\/[a-zA-Z0-9_-]+)/g, '<span class="text-[#3fb950] font-bold">$1</span>');
    
    // Ejecutables listados en el output
    html = html.replace(/(gcc|make|ls|pwd|mkdir|rm|cd)\b/g, '<span class="text-[#3fb950]">$1</span>');

    // Permisos estilo ls -l
    html = html.replace(/^(d[rwx-]{9})/gm, '<span class="text-[#58a6ff]">$1</span>');
    html = html.replace(/^(-[rwx-]{9})/gm, '<span class="text-[#c9d1d9]">$1</span>');

    // Tags de estado
    html = html.replace(/(\[INFO\])/g, '<span class="text-[#58a6ff] font-bold">$1</span>');
    html = html.replace(/(\[OK\]|✓)/g, '<span class="text-[#238636] font-bold">$1</span>');
    html = html.replace(/(\[ERROR\]|✗)/g, '<span class="text-[#ff5f56] font-bold">$1</span>');
    
    return html;
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6 group/term">
      {/* Terminal header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="mx-auto text-xs text-[#8b949e] font-mono select-none">
          {title}
        </div>
        {/* Run button */}
        <button
          onClick={runAnimation}
          disabled={isRunning}
          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-all duration-300 ${
            isRunning
              ? "bg-[#f5a62330] text-[#f5a623] cursor-wait"
              : hasRun
              ? "bg-[#238636] text-white hover:bg-[#2ea043]"
              : "bg-[#f5a623] text-[#0d1117] hover:bg-[#d48810]"
          }`}
        >
          {isRunning ? (
            <>
              <span className="inline-block w-2 h-2 border border-[#f5a623] border-t-transparent rounded-full animate-spin"></span>
              Ejecutando...
            </>
          ) : hasRun ? (
            "▶ Re-ejecutar"
          ) : (
            "▶ Ejecutar"
          )}
        </button>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-sm overflow-x-auto min-h-[60px]">
        {command && (
          <div className="mb-2">
            <span className="text-[#58a6ff]">user@linux</span>
            <span className="text-white">:</span>
            <span className="text-[#3fb950]">~</span>
            <span className="text-white">$ {command}</span>
          </div>
        )}
        {(displayedOutput || !command) && (
          <div className="text-[#c9d1d9] whitespace-pre flex">
            <span dangerouslySetInnerHTML={{ __html: highlightTerminal(displayedOutput) }} />
            {isRunning && (
              <span className="inline-block w-2 h-4 bg-[#f5a623] ml-0.5 animate-pulse shrink-0"></span>
            )}
          </div>
        )}
        {!displayedOutput && !isRunning && command && (
          <div className="text-[#484f58] italic text-xs mt-2">
            Haz click en &quot;▶ Ejecutar&quot; para ver la salida...
          </div>
        )}
      </div>
    </div>
  );
}
