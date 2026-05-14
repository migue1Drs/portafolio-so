"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LinuxTerminal({
  command,
  output,
  title = "bash",
}: {
  command?: string;
  output: string;
  title?: string;
}) {
  const [hasRun, setHasRun] = useState(!command);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedCommand, setDisplayedCommand] = useState(command || "");

  const runSimulation = () => {
    if (!command || isTyping) return;
    setHasRun(false);
    setIsTyping(true);
    setDisplayedCommand("");

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCommand(command.substring(0, i + 1));
      i++;
      if (i >= command.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsTyping(false);
          setHasRun(true);
        }, 400); // Pausa antes de revelar la salida
      }
    }, 40); // Velocidad de tipeo
  };

  const highlightTerminal = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Directorios y rutas
    html = html.replace(/(\/[a-zA-Z0-9_.-]+)+/g, '<span class="text-[#58a6ff] font-bold">$&</span>');
    html = html.replace(/(\b[a-zA-Z0-9_-]+\/)(?=\s|$)/g, '<span class="text-[#58a6ff] font-bold">$1</span>');

    // Archivos .c o binarios
    html = html.replace(/([a-zA-Z0-9_.-]+\.[ch]\b)/g, '<span class="text-[#3fb950]">$1</span>');
    html = html.replace(/(\.\/[a-zA-Z0-9_-]+)/g, '<span class="text-[#3fb950] font-bold">$1</span>');
    
    // Comandos de linux
    html = html.replace(/(gcc|make|ls|pwd|mkdir|rm|cd)\b/g, '<span class="text-[#3fb950]">$1</span>');

    // Permisos ls -l
    html = html.replace(/^(d[rwx-]{9})/gm, '<span class="text-[#58a6ff]">$1</span>');
    html = html.replace(/^(-[rwx-]{9})/gm, '<span class="text-[#c9d1d9]">$1</span>');

    // Estados
    html = html.replace(/(\[INFO\])/g, '<span class="text-[#58a6ff] font-bold">$1</span>');
    html = html.replace(/(\[OK\]|✓)/g, '<span class="text-[#238636] font-bold">$1</span>');
    html = html.replace(/(\[ERROR\]|✗)/g, '<span class="text-[#ff5f56] font-bold">$1</span>');
    
    return html;
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6 group">
      {/* Mac/Linux terminal header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d] relative">
        <div className="flex space-x-2 absolute left-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        
        <div className="mx-auto text-xs text-[#8b949e] font-mono select-none flex items-center gap-2">
          {title}
          {isTyping && <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse"></span>}
        </div>

        <div className="absolute right-4 flex items-center">
          {command && !hasRun && !isTyping && (
            <button 
              onClick={runSimulation}
              className="flex items-center gap-1.5 bg-[#f5a623] hover:bg-[#d48810] text-[#111111] px-3 py-1 rounded text-xs font-bold transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4l12 6-12 6z" />
              </svg>
              EJECUTAR
            </button>
          )}
        </div>
      </div>
      
      {/* Terminal body */}
      <div className="p-4 font-mono text-sm overflow-x-auto whitespace-pre min-h-[100px]">
        {command && (
          <div className="mb-2">
            <span className="text-[#58a6ff]">user@linux</span>
            <span className="text-white">:</span>
            <span className="text-[#3fb950]">~</span>
            <span className="text-white">$ </span>
            <span className="text-white">{(!hasRun && !isTyping) ? command : displayedCommand}</span>
            {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse align-middle"></span>}
          </div>
        )}
        
        <AnimatePresence>
          {hasRun && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#c9d1d9]" 
              dangerouslySetInnerHTML={{ __html: highlightTerminal(output) }} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
