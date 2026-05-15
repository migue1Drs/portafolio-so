"use client";

import React from "react";
import { motion } from "framer-motion";


// ─── Design tokens ───────────────────────────────────────────
const BLUE   = { bg: "#0d2044", border: "#1f6feb", text: "#79c0ff" };
const GREEN  = { bg: "#0d2a14", border: "#3fb950", text: "#3fb950" };
const PURPLE = { bg: "#1e0a3c", border: "#8957e5", text: "#d2a8ff" };
const ORANGE = { bg: "#2a1400", border: "#e3861b", text: "#f5a623" };
const RED    = { bg: "#2a0d0d", border: "#f85149", text: "#ff7b72" };

// Shared fade-in-up variant
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay, ease: "easeOut" },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: -12 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, delay, ease: "easeOut" },
});

// ─── Sub-components ──────────────────────────────────────────
function ThreadBox({
  label,
  fn,
  color,
  delay = 0,
}: {
  label: string;
  fn: string;
  color: typeof BLUE;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex flex-col items-center justify-center rounded-lg px-3 py-2.5 text-center min-w-[120px] select-none"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        boxShadow: `0 0 14px ${color.border}22`,
      }}
    >
      <span className="text-[10px] font-medium mb-0.5" style={{ color: color.text + "bb" }}>
        {label}
      </span>
      <code className="text-[12px] font-bold font-mono" style={{ color: color.text }}>
        {fn}
      </code>
    </motion.div>
  );
}

function Arrow({
  label,
  delay = 0,
  color = "#30363d",
  vertical = false,
}: {
  label?: string;
  delay?: number;
  color?: string;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center gap-0 my-0.5">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay }}
          style={{ transformOrigin: "top", background: color }}
          className="w-[2px] h-8"
        />
        {/* arrowhead */}
        <div
          style={{ borderLeft: `6px solid transparent`, borderRight: `6px solid transparent`, borderTop: `7px solid ${color}` }}
        />
        {label && (
          <span className="text-[9px] text-[#484f58] mt-1">{label}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 flex-1 min-w-[20px]">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay }}
        style={{ transformOrigin: "left", background: color }}
        className="flex-1 h-[2px]"
      />
      <div
        style={{ borderTop: `5px solid transparent`, borderBottom: `5px solid transparent`, borderLeft: `7px solid ${color}` }}
      />
    </div>
  );
}

// ─── Main diagram ─────────────────────────────────────────────
export function ThreadSyncDiagram() {
  return (
    <figure className="my-10 p-6 bg-[#010409] rounded-xl border border-[#21262d] overflow-x-auto shadow-2xl">

      {/* ── Title ── */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#0d1117] bg-[#8957e5] rounded px-1.5 py-0.5">
          FIGURA 2-2
        </span>
        <span className="text-[11px] text-[#8b949e] font-medium tracking-wide">
          Ciclo de vida y sincronización de un hilo POSIX
        </span>
      </div>

      {/* ── Diagram ── */}
      <div className="flex flex-col gap-0 min-w-[580px]">

        {/* ── ROW: Thread labels column header ── */}
        <div className="flex items-center gap-4 mb-1 px-2">
          <div className="w-24 shrink-0" />
          <div className="flex-1 text-center text-[9px] uppercase tracking-widest text-[#484f58] font-bold">
            Hilo Padre (main)
          </div>
          <div className="flex-1 text-center text-[9px] uppercase tracking-widest text-[#484f58] font-bold">
            Hilo Hijo (worker)
          </div>
        </div>

        {/* ── ROW 1: START ── */}
        <div className="flex items-center gap-4">
          {/* Timeline label */}
          <StepLabel label="1" color={BLUE.border} />

          {/* Parent lane */}
          <Lane>
            <ThreadBox label="Hilo principal" fn="main()" color={BLUE} delay={0.1} />
          </Lane>

          {/* Divider */}
          <div className="w-px self-stretch bg-[#21262d] shrink-0" />

          {/* Child lane */}
          <Lane>
            <div className="h-10 flex items-center">
              <span className="text-[10px] text-[#30363d] italic">— no existe aún —</span>
            </div>
          </Lane>
        </div>

        {/* Arrow down on parent */}
        <TwoLaneRow>
          <div className="flex justify-center">
            <Arrow vertical color={BLUE.border} delay={0.15} />
          </div>
          <div />
        </TwoLaneRow>

        {/* ── ROW 2: pthread_create ── */}
        <div className="flex items-center gap-4">
          <StepLabel label="2" color={GREEN.border} />
          <Lane>
            <ThreadBox label="Crea el hilo" fn="pthread_create()" color={GREEN} delay={0.2} />
          </Lane>
          <div className="w-px self-stretch bg-[#21262d] shrink-0" />
          <Lane>
            <div className="h-10" />
          </Lane>
        </div>

        {/* Fork arrow: parent → child */}
        <TwoLaneRow>
          {/* parent side: arrow down */}
          <div className="flex justify-center">
            <Arrow vertical color={GREEN.border} delay={0.25} />
          </div>
          {/* cross arrow hint */}
          <div className="flex items-center justify-start pl-4">
            <motion.div
              {...fadeRight(0.3)}
              className="flex items-center gap-1 text-[9px] text-[#3fb950]/70"
            >
              <svg width="28" height="12" viewBox="0 0 28 12">
                <path d="M0 6 Q14 6 28 6" stroke="#3fb950" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
                <polygon points="24,3 28,6 24,9" fill="#3fb950" />
              </svg>
              spawn
            </motion.div>
          </div>
        </TwoLaneRow>

        {/* ── ROW 3: Parallel execution ── */}
        <div className="flex items-center gap-4">
          <StepLabel label="3" color={PURPLE.border} />
          <Lane>
            <ThreadBox label="Bloqueado esperando" fn="pthread_join()" color={PURPLE} delay={0.35} />
          </Lane>
          <div className="w-px self-stretch bg-[#21262d] shrink-0" />
          <Lane>
            <ThreadBox label="En ejecución" fn="thread_fn()" color={ORANGE} delay={0.35} />
          </Lane>
        </div>

        {/* Arrows down on both lanes */}
        <TwoLaneRow>
          <div className="flex justify-center">
            <Arrow vertical color={PURPLE.border} delay={0.4} />
          </div>
          <div className="flex justify-center">
            <Arrow vertical color={ORANGE.border} delay={0.4} />
          </div>
        </TwoLaneRow>

        {/* ── ROW 4: Child exits ── */}
        <div className="flex items-center gap-4">
          <StepLabel label="4" color={RED.border} />
          <Lane>
            <div className="h-10 flex items-center justify-center">
              <span className="text-[10px] text-[#30363d] italic">— esperando —</span>
            </div>
          </Lane>
          <div className="w-px self-stretch bg-[#21262d] shrink-0" />
          <Lane>
            <ThreadBox label="Termina el hilo" fn="pthread_exit()" color={RED} delay={0.45} />
          </Lane>
        </div>

        {/* join arrow: child → parent */}
        <TwoLaneRow>
          <div className="flex items-center justify-end pr-4">
            <motion.div
              {...fadeRight(0.5)}
              className="flex items-center gap-1 text-[9px] text-[#f85149]/70 flex-row-reverse"
            >
              <svg width="28" height="12" viewBox="0 0 28 12" style={{ transform: "scaleX(-1)" }}>
                <path d="M0 6 Q14 6 28 6" stroke="#f85149" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
                <polygon points="24,3 28,6 24,9" fill="#f85149" />
              </svg>
              join
            </motion.div>
          </div>
          <div className="flex justify-center">
            <Arrow vertical color={RED.border} delay={0.5} />
          </div>
        </TwoLaneRow>

        {/* ── ROW 5: Parent resumes ── */}
        <div className="flex items-center gap-4">
          <StepLabel label="5" color={BLUE.border} />
          <Lane>
            <ThreadBox label="Reanuda ejecución" fn="main() continúa" color={BLUE} delay={0.55} />
          </Lane>
          <div className="w-px self-stretch bg-[#21262d] shrink-0" />
          <Lane>
            <div className="h-10 flex items-center justify-center">
              <span className="text-[10px] text-[#30363d] italic">— finalizado —</span>
            </div>
          </Lane>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#21262d]">
        {[
          { color: BLUE,   label: "Hilo padre activo"        },
          { color: GREEN,  label: "pthread_create()"         },
          { color: PURPLE, label: "pthread_join() – bloqueado"},
          { color: ORANGE, label: "Hilo hijo ejecutando"     },
          { color: RED,    label: "pthread_exit()"           },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: color.bg, border: `1px solid ${color.border}` }}
            />
            <span className="text-[10px] text-[#6e7681]">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Caption ── */}
      <figcaption className="mt-3 text-[11px] text-[#484f58] text-center italic">
        Figura 2-2. Ciclo de vida y sincronización de hilos POSIX — el padre crea el hilo con
        <code className="text-[#8b949e] mx-1">pthread_create()</code>, se bloquea en
        <code className="text-[#8b949e] mx-1">pthread_join()</code> hasta que el hijo termina con
        <code className="text-[#8b949e] mx-1">pthread_exit()</code>.
      </figcaption>
    </figure>
  );
}

// ─── Layout helpers ───────────────────────────────────────────
function Lane({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      {children}
    </div>
  );
}

function TwoLaneRow({ children }: { children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-7 shrink-0" /> {/* align with StepLabel width */}
      <div className="flex-1 flex items-start justify-center">{children[0]}</div>
      <div className="w-px self-stretch bg-[#21262d] shrink-0" />
      <div className="flex-1 flex items-start justify-center">{children[1]}</div>
    </div>
  );
}

function StepLabel({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black text-[#0d1117]"
      style={{ background: color }}
    >
      {label}
    </div>
  );
}
