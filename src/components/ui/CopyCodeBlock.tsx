"use client";

import { useState } from "react";
import { SyntaxHighlighter } from "./SyntaxHighlighter";

interface CopyCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CopyCodeBlock({ code, language = "c", filename }: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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



  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6 group/code">
      {/* File header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        {filename && (
          <span className="text-xs text-[#8b949e] font-mono">{filename}</span>
        )}
        <span className="ml-auto text-[10px] text-[#484f58] font-mono uppercase mr-3">{language}</span>
        
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
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <SyntaxHighlighter code={code} language={language} />
      </div>
    </div>
  );
}
