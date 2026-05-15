"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { PORTFOLIO_TOPICS } from "@/lib/constants";

// Variantes para la animación de letras del título
const titleVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Velocidad de "tipeo"
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, display: "none" },
  visible: {
    opacity: 1,
    display: "inline-block",
    transition: { duration: 0.01 }, // Aparece instantáneamente (como si se escribiera)
  },
};

// Variantes para el Grid de Tarjetas (Stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 12 },
  },
};

export default function Home() {
  const titleText = "Sistemas Operativos";
  const [showCursor, setShowCursor] = useState(true);

  // Ocultar el cursor después de que termine de "escribir" (aprox 2 segundos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCursor(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-14"
      >
        <div className="relative h-[360px] w-full overflow-hidden bg-[#1c1c1c] group rounded-xl border border-[#333333]">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"></div>
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
          
          <div className="absolute bottom-10 left-8 z-20 max-w-2xl">
            <motion.h1 
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight leading-tight"
            >
              Portafolio de Evidencias: <br />
              <span className="text-[#f5a623] font-bold inline-flex items-center">
                {titleText.split("").map((char, index) => (
                  <motion.span key={index} variants={letterVariants}>
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                {/* Cursor parpadeante estilo terminal (desaparece al terminar) */}
                {showCursor && (
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="inline-block w-4 h-[32px] md:h-[40px] bg-[#f5a623] ml-1"
                  />
                )}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-[#a0a0a0] text-base mb-6 leading-relaxed max-w-xl"
            >
              Un viaje profundo a las entrañas de Linux. Explorando la arquitectura, gestión de procesos, 
              hilos, y mecanismos de comunicación IPC desde una perspectiva de bajo nivel.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <MagneticButton>
                <Link href="/tema-1-introduccion" className="inline-block bg-[#f5a623] hover:bg-[#d48810] text-[#111111] font-bold py-2.5 px-6 rounded-sm transition-colors text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(245,166,35,0.4)]">
                  Comenzar Lectura
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10">
        
        {/* Intro */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#f5a623]"></div>
            <div className="relative z-10 space-y-4 text-[#b0b8c4] leading-relaxed text-sm md:text-base">
              <p>
                El presente portafolio de evidencias tiene como finalidad recopilar, documentar y reflexionar sobre cada una de las prácticas realizadas durante el curso de Sistemas Operativos. A lo largo de estas páginas se presenta el trabajo desarrollado en los principales temas del curso, basados en las notas <strong className="text-white">"Un Vistazo a los Sistemas Operativos"</strong>.
              </p>
              <p>
                Cada sección incluye una explicación teórica del tema, el código fuente de las prácticas desarrolladas en lenguaje C sobre el sistema operativo Linux, las capturas de la salida en terminal que evidencian la ejecución correcta de los programas, y una reflexión personal sobre lo aprendido y las posibles mejoras.
              </p>
              <p>
                Los temas abordados comprenden desde la introducción al sistema operativo Linux, pasando por la gestión de procesos e hilos, los mecanismos de comunicación entre procesos (IPC), la administración de memoria, la arquitectura del sistema de archivos, hasta el manejo de señales. Estos representan los pilares fundamentales para entender cómo un sistema operativo moderno administra los recursos del hardware.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Authors */}
        <section>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center mb-6 border-b border-[#333333] pb-3"
          >
            <h2 className="text-xl text-white font-bold tracking-wider uppercase">
              Desarrolladores <span className="text-[#f5a623]">& Autores</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#0d1117] border border-[#30363d] hover:border-[#f5a623]/50 transition-colors rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#f5a623] flex items-center justify-center shrink-0 overflow-hidden">
                <svg className="w-8 h-8 text-[#f5a623]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Luis Eduardo Gonzalez Giron</h3>
                <div className="text-[#8b949e] text-sm space-y-1">
                  <a href="mailto:gogl030101@gs.utm.mx" className="flex items-center gap-2 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    gogl030101@gs.utm.mx
                  </a>
                  <a href="https://github.com/LGxnzalez" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#58a6ff] hover:text-[#f5a623] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    LGxnzalez
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d1117] border border-[#30363d] hover:border-[#f5a623]/50 transition-colors rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#161b22] border border-[#f5a623] flex items-center justify-center shrink-0 overflow-hidden">
                <svg className="w-8 h-8 text-[#f5a623]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Miguel Suárez Dolores</h3>
                <div className="text-[#8b949e] text-sm space-y-1">
                  <a href="mailto:sudm030713@gs.utm.mx" className="flex items-center gap-2 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    sudm030713@gs.utm.mx
                  </a>
                  <a href="https://github.com/migue1Drs" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#58a6ff] hover:text-[#f5a623] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    migue1Drs
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="w-full space-y-14">
          
          <section>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center mb-8 border-b border-[#333333] pb-3"
            >
              <h2 className="text-xl text-white font-bold tracking-wider uppercase">
                Temas <span className="text-[#f5a623]">Principales</span>
              </h2>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
            >
              {PORTFOLIO_TOPICS.map((topic) => (
                <motion.div key={topic.id} variants={cardVariants} className="h-full">
                  <TiltCard>
                    <Link href={topic.href} className="group block h-full">
                      <SpotlightCard className="bg-[#1c1c1c] border border-[#333333] hover:border-[#f5a623] transition-all duration-300 flex flex-col h-full h-full min-h-[250px]">
                        <div className="relative z-20 flex flex-col h-full w-full">
                          <div className="h-2 w-full bg-gradient-to-r from-[#f5a623] to-[#d48810] group-hover:h-3 transition-all shrink-0"></div>
                          <div className="p-5 flex flex-col flex-1">
                            <span className="text-[10px] text-[#f5a623] font-bold uppercase tracking-widest mb-2">
                              TEMA {topic.title.split('.')[0]}
                            </span>
                            <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#f5a623] transition-colors">
                              {topic.title}
                            </h3>
                            {topic.subtopics && (
                              <div className="text-[#888888] text-xs space-y-1 mt-auto border-t border-[#333333] pt-3">
                                {topic.subtopics.slice(0, 3).map((sub: any) => (
                                  <div key={sub.id} className="flex items-center gap-1">
                                    <span className="text-[#f5a623]">▸</span>
                                    <span className="truncate">{sub.title}</span>
                                  </div>
                                ))}
                                {topic.subtopics.length > 3 && (
                                  <div className="text-[#555555]">
                                    + {topic.subtopics.length - 3} subtemas más...
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="mt-4 self-start bg-[#333333] group-hover:bg-[#f5a623] group-hover:text-[#111111] text-white text-[10px] font-bold py-2 px-5 rounded-sm transition-all duration-300 uppercase tracking-widest z-30">
                              Leer más
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="flex items-center mb-8 border-b border-[#333333] pb-3"
             >
              <h2 className="text-xl text-white font-bold tracking-wider uppercase">
                Entorno de <span className="text-[#f5a623]">Ejecución</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LinuxTerminal 
                command="./compilar_portafolio.sh"
                output={`[INFO] Compilando módulos de Sistema Operativo...
[OK] gcc -o fork_example fork_example.c
[OK] gcc -o wait_example waitpid.c
[OK] gcc -o pipe_example pipe_fifo.c
[OK] gcc -o shmem_example shared_memory.c
[OK] gcc -o signal_handler signal_handler.c
[OK] gcc -pthread -o threads threads_example.c

✓ Compilación exitosa. 6 binarios listos.`}
                title="gcc compiler"
              />
            </motion.div>
          </section>

        </div>
      </div>
    </div>
  );
}
