"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { PORTFOLIO_TOPICS } from "@/lib/constants";

const TECH_STACK = [
  { label: "Linux",         color: "#f5a623" },
  { label: "C (ISO C11)",   color: "#58a6ff" },
  { label: "Next.js",       color: "#ffffff" },
  { label: "Framer Motion", color: "#d2a8ff" },
  { label: "Tailwind CSS",  color: "#3fb950" },
];

const AUTHORS = [
  {
    name: "Luis Eduardo González Girón",
    email: "gogl030101@gs.utm.mx",
    github: "https://github.com/LGxnzalez",
    githubUser: "LGxnzalez",
    initials: "LG",
  },
  {
    name: "Miguel Suárez Dolores",
    email: "sudm030713@gs.utm.mx",
    github: "https://github.com/migue1Drs",
    githubUser: "migue1Drs",
    initials: "MS",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="w-full relative overflow-hidden mt-auto"
    >
      {/* Ambient spotlight that follows mouse across entire footer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(245,166,35,0.05), transparent 50%)`,
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 left-1/3 w-80 h-48 bg-[#f5a623] opacity-[0.03] rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-1/4 w-64 h-40 bg-[#58a6ff] opacity-[0.025] rounded-full blur-3xl" />

      {/* Top separator — gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#f5a623]/40 to-transparent" />

      {/* Main footer background */}
      <div className="bg-[#111111] border-t border-[#1e2128]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

          {/* ── Main grid ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 relative z-10"
          >

            {/* ── Brand ── */}
            <motion.div variants={itemVariants}>
              <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
                <div className="w-9 h-9 bg-[#f5a623] flex items-center justify-center rounded-md group-hover:shadow-[0_0_18px_rgba(245,166,35,0.4)] transition-shadow duration-300">
                  <span className="text-[#111111] font-black text-lg">SO</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide leading-tight group-hover:text-[#f5a623] transition-colors">PORTAFOLIO</p>
                  <p className="text-[#f5a623] text-[9px] uppercase tracking-[0.25em] font-bold leading-tight">Sistemas Operativos</p>
                </div>
              </Link>

              <p className="text-[#6e7681] text-xs leading-relaxed mb-5">
                Evidencias prácticas de la materia de Sistemas Operativos.
                Implementaciones en C sobre Linux documentadas con rigor técnico.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {TECH_STACK.map((tech) => (
                  <motion.span
                    key={tech.label}
                    whileHover={{ scale: 1.06, y: -1 }}
                    transition={{ duration: 0.15 }}
                    className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider cursor-default"
                    style={{ color: tech.color, borderColor: `${tech.color}30`, backgroundColor: `${tech.color}09` }}
                  >
                    {tech.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* ── Temas ── */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#8b949e] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Temas del Curso
              </h3>
              <ul className="space-y-2.5">
                {PORTFOLIO_TOPICS.map((topic) => (
                  <li key={topic.id}>
                    <Link
                      href={topic.href}
                      className="flex items-center gap-2 text-[#6e7681] hover:text-[#f5a623] text-xs transition-colors duration-200 group"
                    >
                      <span className="w-3 h-px bg-[#333] group-hover:bg-[#f5a623] group-hover:w-4 transition-all duration-200 shrink-0" />
                      {topic.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Autores ── */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#8b949e] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Desarrolladores
              </h3>
              <div className="space-y-6">
                {AUTHORS.map((author) => (
                  <div key={author.githubUser}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#f5a623]/10 border border-[#f5a623]/25 flex items-center justify-center shrink-0">
                        <span className="text-[#f5a623] text-[9px] font-black">{author.initials}</span>
                      </div>
                      <p className="text-[#c9d1d9] text-xs font-semibold">{author.name}</p>
                    </div>
                    <div className="ml-9 space-y-1.5">
                      <a href={`mailto:${author.email}`}
                        className="flex items-center gap-1.5 text-[#6e7681] hover:text-[#c9d1d9] text-[11px] transition-colors">
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {author.email}
                      </a>
                      <a href={author.github} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-[#58a6ff] hover:text-[#f5a623] text-[11px] transition-colors">
                        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        github.com/{author.githubUser}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Info académica ── */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#8b949e] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Información Académica
              </h3>
              <div className="space-y-3 text-[11px]">
                {[
                  { label: "Institución", value: "Universidad Tecnológica de la Mixteca" },
                  { label: "Materia",     value: "Sistemas Operativos" },
                  { label: "Lenguaje",    value: "C (ISO C11) · Linux Kernel" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[#484f58] uppercase tracking-wider text-[8px] font-bold">{label}</span>
                    <span className="text-[#8b949e] font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Bottom bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="relative z-10 mt-10 pt-5 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-2"
          >
            <p className="text-[#484f58] text-[11px]">
              © {year} González Girón &amp; Suárez Dolores · UTM
            </p>
            <div className="flex items-center gap-1.5 text-[#484f58] text-[11px]">
              <span>Construido con</span>
              <span className="text-[#f5a623] font-bold font-mono">C</span>
              <span>·</span>
              <span className="text-white/80 font-bold">Next.js 15</span>
              <span>·</span>
              <span className="text-[#d2a8ff] font-bold">Motion</span>
              <span>🐧</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
