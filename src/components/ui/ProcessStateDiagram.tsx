"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── State definitions ────────────────────────────────────────
interface StateInfo {
  id: string;
  label: string;
  sublabel?: string;
  bg: string;
  border: string;
  glow: string;
  text: string;
  description: string;
  syscall?: string;
  cx: number;
  cy: number;
}

const STATES: StateInfo[] = [
  {
    id: "nuevo",
    label: "Nuevo",
    sublabel: "New",
    bg: "#1c2128", border: "#484f58", glow: "#6e7681", text: "#e6edf3",
    description: "El proceso acaba de ser creado mediante fork(). El kernel ha reservado un PCB (Process Control Block) pero aún no ha sido admitido en la cola de procesos listos.",
    syscall: "fork()",
    cx: 15, cy: 55,
  },
  {
    id: "listo",
    label: "Listo",
    sublabel: "Ready",
    bg: "#0d2044", border: "#1f6feb", glow: "#58a6ff", text: "#79c0ff",
    description: "El proceso está en memoria principal, con todos sus recursos asignados, esperando que el planificador (scheduler) le otorgue tiempo de CPU.",
    syscall: "— en cola —",
    cx: 45, cy: 25,
  },
  {
    id: "ejecucion",
    label: "Ejecución",
    sublabel: "Running",
    bg: "#0d2a14", border: "#238636", glow: "#3fb950", text: "#3fb950",
    description: "El proceso tiene la CPU y está ejecutando instrucciones activamente. Solo puede haber un proceso en este estado por núcleo de CPU.",
    syscall: "— ejecutando —",
    cx: 85, cy: 25,
  },
  {
    id: "bloqueado",
    label: "Bloqueado",
    sublabel: "Waiting",
    bg: "#2a1800", border: "#e3861b", glow: "#f5a623", text: "#f5a623",
    description: "El proceso está esperando un evento externo: completar I/O, recibir una señal, adquirir un mutex o que un recurso esté disponible. No puede usar la CPU hasta que el evento ocurra.",
    syscall: "wait() / read()",
    cx: 65, cy: 80,
  },
  {
    id: "zombie",
    label: "Zombie",
    sublabel: "Zombie",
    bg: "#2a0d2a", border: "#8957e5", glow: "#d2a8ff", text: "#d2a8ff",
    description: "El proceso ha terminado su ejecución pero su padre aún no ha recogido su código de salida con wait(). El PCB permanece en memoria hasta ese momento.",
    syscall: "— wait() pdte. —",
    cx: 105, cy: 55,
  },
  {
    id: "terminado",
    label: "Terminado",
    sublabel: "Exit",
    bg: "#2a0d0d", border: "#f85149", glow: "#ff7b72", text: "#ff7b72",
    description: "El proceso ha finalizado. El kernel libera todos sus recursos: memoria, descriptores de archivo, etc. El PCB es eliminado tras ser leído por el proceso padre.",
    syscall: "exit()",
    cx: 105, cy: 85,
  },
];

// ── Transitions ──────────────────────────────────────────────
interface Trans {
  from: string;
  to: string;
  label: string;
  color: string;
  path: string;
  labelX: number;
  labelY: number;
  textAnchor?: "start" | "middle" | "end";
}

const TRANSITIONS: Trans[] = [
  {
    from: "nuevo", to: "listo",
    label: "Admitido (fork→ready)",
    color: "#58a6ff",
    path: "M 22 48 Q 30 38 37 32",
    labelX: 28, labelY: 41,
    textAnchor: "end",
  },
  {
    from: "listo", to: "ejecucion",
    label: "Dispatch (scheduler)",
    color: "#3fb950",
    path: "M 53 20.5 Q 65 12 76 20.5",
    labelX: 65, labelY: 13.5,
    textAnchor: "middle",
  },
  {
    from: "ejecucion", to: "listo",
    label: "Preemption / timeout",
    color: "#79c0ff",
    path: "M 77 29.5 Q 65 38 54 29.5",
    labelX: 65, labelY: 37,
    textAnchor: "middle",
  },
  {
    from: "ejecucion", to: "bloqueado",
    label: "I/O request / wait()",
    color: "#f5a623",
    path: "M 82 34 Q 78 50 69 70",
    labelX: 80, labelY: 53,
    textAnchor: "start",
  },
  {
    from: "bloqueado", to: "listo",
    label: "I/O completado / evento",
    color: "#58a6ff",
    path: "M 62 71 Q 48 55 49 35",
    labelX: 47, labelY: 56,
    textAnchor: "end",
  },
  {
    from: "ejecucion", to: "zombie",
    label: "exit() llamado",
    color: "#d2a8ff",
    path: "M 90 33 Q 98 38 99 46",
    labelX: 103, labelY: 38,
    textAnchor: "start",
  },
  {
    from: "zombie", to: "terminado",
    label: "wait() por padre",
    color: "#ff7b72",
    path: "M 105 65 L 105 74",
    labelX: 107, labelY: 70,
    textAnchor: "start",
  },
];

export function ProcessStateDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const activeState = STATES.find((s) => s.id === active) ?? null;

  return (
    <figure className="my-10 bg-[#010409] border border-[#21262d] rounded-xl overflow-hidden shadow-2xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#21262d]">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#0d1117] bg-[#1f6feb] rounded px-1.5 py-0.5">
          FIGURA 2-1
        </span>
        <span className="text-[11px] text-[#8b949e] font-medium tracking-wide">
          Máquina de estados de un proceso UNIX — haz clic en cualquier estado
        </span>
      </div>

      {/* ── SVG diagram ── */}
      <div className="relative w-full" style={{ paddingBottom: "52%" }}>
        <svg
          viewBox="0 0 120 100"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Arrow markers for each color */}
            {[
              { id: "arr-blue",   color: "#58a6ff" },
              { id: "arr-green",  color: "#3fb950" },
              { id: "arr-orange", color: "#f5a623" },
              { id: "arr-purple", color: "#d2a8ff" },
              { id: "arr-red",    color: "#ff7b72" },
            ].map(({ id, color }) => (
              <marker
                key={id}
                id={id}
                markerWidth="6" markerHeight="6"
                refX="5" refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill={color} />
              </marker>
            ))}
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Transitions ── */}
          {TRANSITIONS.map((t) => {
            const markerMap: Record<string, string> = {
              "#58a6ff": "url(#arr-blue)",
              "#3fb950": "url(#arr-green)",
              "#f5a623": "url(#arr-orange)",
              "#d2a8ff": "url(#arr-purple)",
              "#ff7b72": "url(#arr-red)",
              "#79c0ff": "url(#arr-blue)",
            };
            const isActive = active === t.from || active === t.to;
            return (
              <g key={`${t.from}-${t.to}`} opacity={active ? (isActive ? 1 : 0.15) : 0.7}>
                <path
                  d={t.path}
                  fill="none"
                  stroke={t.color}
                  strokeWidth="0.6"
                  strokeDasharray={isActive ? "none" : "1.5 0.8"}
                  markerEnd={markerMap[t.color] ?? "url(#arr-blue)"}
                  filter={isActive ? "url(#glow)" : undefined}
                />
                <text
                  x={t.labelX}
                  y={t.labelY}
                  textAnchor={t.textAnchor ?? "middle"}
                  fontSize="2.2"
                  stroke="#010409"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  opacity={isActive ? 1 : 0.6}
                >
                  {t.label}
                </text>
                <text
                  x={t.labelX}
                  y={t.labelY}
                  textAnchor={t.textAnchor ?? "middle"}
                  fontSize="2.2"
                  fill={t.color}
                  opacity={isActive ? 1 : 0.6}
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {/* ── State nodes ── */}
          {STATES.map((s) => {
            const isActive = active === s.id;
            return (
              <g
                key={s.id}
                style={{ cursor: "pointer" }}
                onClick={() => setActive(isActive ? null : s.id)}
              >
                {/* Glow ring when active */}
                {isActive && (
                  <circle
                    cx={s.cx} cy={s.cy} r="10.5"
                    fill="none"
                    stroke={s.glow}
                    strokeWidth="0.5"
                    opacity="0.5"
                    filter="url(#glow)"
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={s.cx} cy={s.cy} r="9"
                  fill={s.bg}
                  stroke={s.border}
                  strokeWidth={isActive ? "0.8" : "0.5"}
                  opacity={active && !isActive ? 0.35 : 1}
                />
                {/* Label */}
                <text
                  x={s.cx} y={s.cy - 1.5}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight="bold"
                  fill={s.text}
                  opacity={active && !isActive ? 0.35 : 1}
                >
                  {s.label}
                </text>
                <text
                  x={s.cx} y={s.cy + 2.5}
                  textAnchor="middle"
                  fontSize="2"
                  fill={s.text}
                  opacity={active && !isActive ? 0.2 : 0.6}
                  fontStyle="italic"
                >
                  {s.sublabel}
                </text>
                {/* Syscall badge */}
                {s.syscall && (
                  <text
                    x={s.cx} y={s.cy + 6}
                    textAnchor="middle"
                    fontSize="1.6"
                    fill={s.border}
                    opacity={active && !isActive ? 0.2 : 0.9}
                    fontFamily="monospace"
                  >
                    {s.syscall}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Info panel ── */}
      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          {activeState ? (
            <motion.div
              key={activeState.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border p-4"
              style={{ background: activeState.bg, borderColor: activeState.border }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: activeState.glow }} />
                <span className="font-bold text-sm" style={{ color: activeState.text }}>
                  {activeState.label}
                </span>
                {activeState.syscall && (
                  <code className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: "#010409", color: activeState.border, border: `1px solid ${activeState.border}44` }}>
                    {activeState.syscall}
                  </code>
                )}
              </div>
              <p className="text-[#b0b8c4] text-[13px] leading-relaxed">{activeState.description}</p>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4 text-center"
            >
              <p className="text-[#484f58] text-xs italic">
                Haz clic en cualquier estado para ver su descripción y la syscall asociada.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-[#21262d]">
          {STATES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(active === s.id ? null : s.id)}
              className="flex items-center gap-1.5 transition-opacity"
              style={{ opacity: active && active !== s.id ? 0.4 : 1 }}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: s.bg, border: `1.5px solid ${s.border}` }} />
              <span className="text-[10px] font-medium" style={{ color: s.text }}>{s.label}</span>
            </button>
          ))}
        </div>

        <figcaption className="mt-3 text-[11px] text-[#484f58] text-center italic">
          Figura 2-1. Máquina de estados de un proceso UNIX/POSIX — cada transición indica la causa o syscall que la provoca.
        </figcaption>
      </div>
    </figure>
  );
}
