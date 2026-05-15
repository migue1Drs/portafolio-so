"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SyscallCardProps {
  /** Name displayed as the card title, e.g. "getcwd" */
  name: string;
  /** The C function prototype, e.g. "char *getcwd(char *buf, size_t size);" */
  prototype: string;
  /** Header file required, e.g. "<unistd.h>" */
  header: string;
  /** Brief description of what it does */
  description: string;
  /** Return value explanation */
  returns?: string;
  /** Optional: key parameters explained */
  params?: { name: string; desc: string }[];
  /** Optional: additional struct definition to show */
  structDef?: string;
  /** Man section number (defaults to 2 for syscalls, 3 for libc) */
  manSection?: number;
}

export function SyscallCard({
  name,
  prototype,
  header,
  description,
  returns,
  params,
  structDef,
  manSection = 2,
}: SyscallCardProps) {
  const [copied, setCopied] = useState(false);
  const manCmd = `man ${manSection} ${name}`;

  const handleCopyMan = async () => {
    try {
      await navigator.clipboard.writeText(manCmd);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = manCmd;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="my-5 rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-xl hover:border-[#58a6ff]/40 hover:shadow-[0_0_24px_rgba(88,166,255,0.06)] transition-all duration-300"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-0 border-b border-[#30363d]">
        {/* Left: label + name */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 flex-1 min-w-0">
          {/* Section pill */}
          <span className="text-[9px] font-black uppercase tracking-widest text-[#0d1117] bg-[#d2a8ff] rounded px-1.5 py-0.5 shrink-0 leading-none">
            SYSCALL
          </span>
          <span className="text-[#484f58] text-xs select-none">·</span>
          <code className="text-[#d2a8ff] font-mono text-sm font-bold">
            {name}
            <span className="text-[#8b949e] font-normal">()</span>
          </code>
          <span className="text-[#484f58] text-xs select-none hidden sm:inline">·</span>
          <code className="text-[10px] text-[#8b949e] font-mono hidden sm:inline truncate">
            #include{" "}
            <span className="text-[#a5d6ff]">{header}</span>
          </code>
        </div>

        {/* Right: man page badge */}
        <button
          onClick={handleCopyMan}
          title={`Copiar: ${manCmd}`}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-l border-[#30363d] text-[10px] font-mono font-bold transition-all duration-200 shrink-0 group/man ${
            copied
              ? "bg-[#238636]/20 text-[#3fb950]"
              : "text-[#484f58] hover:text-[#8b949e] hover:bg-[#161b22]"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              copiado
            </>
          ) : (
            <>
              <svg className="w-3 h-3 opacity-60 group-hover/man:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-[#58a6ff] font-bold">man</span>
              <span className="text-[#8b949e]">{manSection}</span>
              <span className="text-[#e6edf3]">{name}</span>
            </>
          )}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="divide-y divide-[#21262d]">

        {/* Prototype block */}
        <div className="px-4 py-3">
          <div className="text-[9px] text-[#484f58] uppercase tracking-widest font-bold mb-2">
            Prototipo
          </div>
          <div className="rounded-lg bg-[#010409] border border-[#21262d] px-4 py-3 overflow-x-auto">
            <pre className="text-[13px] font-mono leading-relaxed whitespace-pre-wrap">
              <CHighlight code={prototype} />
            </pre>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 py-3">
          <p className="text-[#8b949e] text-[13px] leading-relaxed">{description}</p>
        </div>

        {/* Params */}
        {params && params.length > 0 && (
          <div className="px-4 py-3">
            <div className="text-[9px] text-[#484f58] uppercase tracking-widest font-bold mb-2">
              Parámetros
            </div>
            <div className="space-y-1.5">
              {params.map((p) => (
                <div
                  key={p.name}
                  className="flex items-start gap-3 text-[12px]"
                >
                  <code className="text-[#79c0ff] font-mono font-bold shrink-0 bg-[#79c0ff]/8 px-1.5 py-0.5 rounded text-[11px]">
                    {p.name}
                  </code>
                  <span className="text-[#484f58] mt-0.5 shrink-0">—</span>
                  <span className="text-[#8b949e] leading-relaxed">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Struct */}
        {structDef && (
          <div className="px-4 py-3">
            <div className="text-[9px] text-[#484f58] uppercase tracking-widest font-bold mb-2">
              Estructura
            </div>
            <div className="rounded-lg bg-[#010409] border border-[#21262d] px-4 py-3 overflow-x-auto">
              <pre className="text-[12px] font-mono leading-[1.8] whitespace-pre">
                <CHighlight code={structDef} isStruct />
              </pre>
            </div>
          </div>
        )}

        {/* Returns */}
        {returns && (
          <div className="px-4 py-3 flex items-start gap-3">
            <span className="text-[9px] text-[#3fb950] font-black uppercase tracking-widest shrink-0 bg-[#3fb950]/10 border border-[#3fb950]/20 rounded px-1.5 py-1 leading-none mt-0.5">
              RETORNA
            </span>
            <span className="text-[#8b949e] text-[12px] leading-relaxed">{returns}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   C Syntax Highlighter — handles both prototypes and struct defs
───────────────────────────────────────────────────────────────── */
const C_TYPES = new Set([
  "void","int","char","short","long","unsigned","signed","float","double",
  "size_t","ssize_t","off_t","mode_t","pid_t","uid_t","gid_t","time_t",
  "ino_t","nlink_t","dev_t","blkcnt_t","blksize_t","uint8_t","uint16_t",
  "uint32_t","uint64_t","int8_t","int16_t","int32_t","int64_t",
  "DIR","FILE","struct","union","enum","typedef",
  "ifaddrs","ifreq","stat","statvfs","utmp","sysinfo","utsname",
  "tm","timeval","sockaddr","sockaddr_in","sockaddr_in6",
]);
const C_KEYWORDS = new Set(["const","restrict","volatile","static","extern","inline","register"]);

function CHighlight({ code, isStruct = false }: { code: string; isStruct?: boolean }) {
  // Tokenize by splitting on meaningful boundaries
  const TOKEN = /(\s+)|(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(->|[{}();,\[\]])|((\*)+)|(\b[A-Za-z_]\w*\b)|([0-9]+)|([#<>\/])/g;

  const parts: { text: string; cls: string }[] = [];
  let lastIndex = 0;
  let firstIdentSeen = false; // track function name in prototype

  let m: RegExpExecArray | null;
  while ((m = TOKEN.exec(code)) !== null) {
    // Gap before match
    if (m.index > lastIndex) {
      parts.push({ text: code.slice(lastIndex, m.index), cls: "text-[#e6edf3]" });
    }

    const [full, ws, lineComment, blockComment, strLit, charLit, punct, , stars, ident, num, misc] = m;

    if (ws) {
      parts.push({ text: full, cls: "" });
    } else if (lineComment) {
      // Comment: // Field name — dim gray
      // Try to split at first space after "//" to colour field description
      const afterSlash = lineComment.slice(2).trimStart();
      parts.push({ text: "//", cls: "text-[#484f58]" });
      parts.push({ text: lineComment.slice(2), cls: "text-[#6e7681]" });
    } else if (blockComment) {
      parts.push({ text: full, cls: "text-[#6e7681]" });
    } else if (strLit || charLit) {
      parts.push({ text: full, cls: "text-[#a5d6ff]" });
    } else if (punct) {
      // Braces / punctuation
      if (full === "{" || full === "}") {
        parts.push({ text: full, cls: "text-[#f0883e]" });
      } else if (full === "(" || full === ")") {
        parts.push({ text: full, cls: "text-[#e6edf3]" });
      } else {
        parts.push({ text: full, cls: "text-[#e6edf3]" });
      }
    } else if (stars) {
      // Pointer stars
      parts.push({ text: full, cls: "text-[#ff7b72]" });
    } else if (ident) {
      if (C_TYPES.has(full)) {
        parts.push({ text: full, cls: "text-[#79c0ff]" });
      } else if (C_KEYWORDS.has(full)) {
        parts.push({ text: full, cls: "text-[#ff7b72]" });
      } else if (!isStruct && !firstIdentSeen) {
        // First non-type identifier in prototype = return type suffix or func name
        // Actually: function name is the first identifier that is followed by "("
        // We handle this via lookahead below — mark as default for now
        parts.push({ text: full, cls: "text-[#d2a8ff] font-bold" });
        firstIdentSeen = true;
      } else if (isStruct) {
        // Inside a struct: field names (those NOT in C_TYPES and not keywords)
        // We want to detect: after a type sequence comes the field name
        parts.push({ text: full, cls: "text-[#e6edf3]" });
      } else {
        parts.push({ text: full, cls: "text-[#e6edf3]" });
      }
    } else if (num) {
      parts.push({ text: full, cls: "text-[#f0883e]" });
    } else if (misc) {
      parts.push({ text: full, cls: "text-[#484f58]" });
    } else {
      parts.push({ text: full, cls: "text-[#e6edf3]" });
    }

    lastIndex = m.index + full.length;
  }

  if (lastIndex < code.length) {
    parts.push({ text: code.slice(lastIndex), cls: "text-[#e6edf3]" });
  }

  // Post-process: for prototype, find function name = first non-type word before "("
  if (!isStruct) {
    // Walk parts to find the first identifier marked as purple (our heuristic first non-type)
    // and verify it's actually the function name by checking the very next non-ws part is "("
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].cls.includes("d2a8ff")) {
        // check next non-ws part
        let j = i + 1;
        while (j < parts.length && parts[j].cls === "") j++;
        if (j < parts.length && parts[j].text === "(") {
          break; // correct — keep purple
        } else {
          // was not the function name, recolour as default
          parts[i].cls = "text-[#e6edf3]";
        }
      }
    }
  }

  return (
    <>
      {parts.map((p, i) => (
        <span key={i} className={p.cls}>
          {p.text}
        </span>
      ))}
    </>
  );
}
