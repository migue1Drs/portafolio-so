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

const cardVariants = {
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
                <Link href="/prologo" className="inline-block bg-[#f5a623] hover:bg-[#d48810] text-[#111111] font-bold py-2.5 px-6 rounded-sm transition-colors text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(245,166,35,0.4)]">
                  Comenzar Lectura
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-10">
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
              {PORTFOLIO_TOPICS.filter(t => t.id !== 'prologo').map((topic) => (
                <motion.div key={topic.id} variants={cardVariants} className="h-full">
                  <TiltCard>
                    <Link href={topic.href} className="group block h-full">
                      <SpotlightCard className="bg-[#1c1c1c] border border-[#333333] hover:border-[#f5a623] transition-all duration-300 flex flex-col h-full h-full min-h-[250px]">
                        <div className="relative z-20 flex flex-col h-full w-full">
                          <div className="h-2 w-full bg-gradient-to-r from-[#f5a623] to-[#d48810] group-hover:h-3 transition-all shrink-0"></div>
                          <div className="p-5 flex flex-col flex-1">
                            <span className="text-[10px] text-[#f5a623] font-bold uppercase tracking-widest mb-2">
                              {topic.id.replace('tema-', 'TEMA ')}
                            </span>
                            <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#f5a623] transition-colors">
                              {topic.title}
                            </h3>
                            {topic.subtopics && (
                              <div className="text-[#888888] text-xs space-y-1 mt-auto border-t border-[#333333] pt-3">
                                {topic.subtopics.slice(0, 3).map(sub => (
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
