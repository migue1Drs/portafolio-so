"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type IPCMode = "pipe" | "fifo" | "sharedmem";

interface PipeAnimationProps {
 mode?: IPCMode;
 /** Allow user to switch modes */
 showModeSelector?: boolean;
}

interface Particle {
 id: number;
 x: number;
 opacity: number;
}

const MODE_CONFIG: Record<
 IPCMode,
 {
 label: string;
 icon: string;
 color: string;
 processA: string;
 processB: string;
 channelLabel: string;
 description: string;
 }
> = {
 pipe: {
 label: "Pipe",
 icon: "",
 color: "#58a6ff",
 processA: "Padre (write)",
 processB: "Hijo (read)",
 channelLabel: "fd[0] ← fd[1]",
 description:
 "Comunicación unidireccional padre→hijo. Los datos fluyen por un buffer del kernel.",
 },
 fifo: {
 label: "FIFO",
 icon: "",
 color: "#f5a623",
 processA: "Escritor",
 processB: "Lector",
 channelLabel: "/tmp/mi_fifo",
 description:
 "FIFO con nombre en el filesystem. Permite comunicación entre procesos sin parentesco.",
 },
 sharedmem: {
 label: "Shared Memory",
 icon: "",
 color: "#3fb950",
 processA: "Proceso A",
 processB: "Proceso B",
 channelLabel: "shmget() → shmat()",
 description:
 "Ambos procesos acceden a la misma región de memoria. El mecanismo IPC más rápido.",
 },
};

export function PipeAnimation({
 mode: initialMode = "pipe",
 showModeSelector = true,
}: PipeAnimationProps) {
 const [mode, setMode] = useState<IPCMode>(initialMode);
 const [isPlaying, setIsPlaying] = useState(false);
 const [particles, setParticles] = useState<Particle[]>([]);
 const [messageText, setMessageText] = useState("Hola mundo!");
 const [sent, setSent] = useState(false);
 const [received, setReceived] = useState(false);
 const animRef = useRef<number | null>(null);
 const particleId = useRef(0);

 const config = MODE_CONFIG[mode];

 // Reset on mode change
 useEffect(() => {
 setParticles([]);
 setSent(false);
 setReceived(false);
 setIsPlaying(false);
 if (animRef.current) cancelAnimationFrame(animRef.current);
 }, [mode]);

 const startAnimation = useCallback(() => {
 if (isPlaying) return;
 setIsPlaying(true);
 setSent(true);
 setReceived(false);
 setParticles([]);

 let frame = 0;
 const totalFrames = 120;
 const particleCount = messageText.length;
 const spawnInterval = Math.floor(totalFrames * 0.4 / particleCount);

 const animate = () => {
 frame++;

 setParticles((prev) => {
 let next = [...prev];

 // Spawn new particles
 if (frame % spawnInterval === 0 && next.length < particleCount) {
 next.push({
 id: particleId.current++,
 x: 0,
 opacity: 1,
 });
 }

 // Move particles
 next = next.map((p) => ({
 ...p,
 x: Math.min(p.x + 2.5, 100),
 opacity: p.x > 90 ? Math.max(0, 1 - (p.x - 90) / 10) : 1,
 }));

 return next;
 });

 if (frame >= totalFrames) {
 setReceived(true);
 setIsPlaying(false);
 return;
 }

 animRef.current = requestAnimationFrame(animate);
 };

 animRef.current = requestAnimationFrame(animate);
 }, [isPlaying, messageText]);

 const handleReset = useCallback(() => {
 if (animRef.current) cancelAnimationFrame(animRef.current);
 setParticles([]);
 setSent(false);
 setReceived(false);
 setIsPlaying(false);
 }, []);

 // Cleanup
 useEffect(() => {
 return () => {
 if (animRef.current) cancelAnimationFrame(animRef.current);
 };
 }, []);

 return (
 <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden my-8">
 {/* Header */}
 <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-3 flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-lg">{config.icon}</span>
 <h4 className="text-white font-bold text-sm uppercase tracking-widest">
 Simulación IPC — {config.label}
 </h4>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={isPlaying ? handleReset : startAnimation}
 className={`text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded transition-all ${
 isPlaying
 ? "bg-[#da3633] text-white hover:bg-[#f85149]"
 : "bg-[#f5a623] text-[#0d1117] hover:bg-[#d48810]"
 }`}
 >
 {isPlaying ? "■ Detener" : sent ? "↺ Reiniciar" : "▶ Enviar"}
 </button>
 </div>
 </div>

 <div className="p-6">
 {/* Mode selector */}
 {showModeSelector && (
 <div className="flex gap-2 mb-6">
 {(Object.keys(MODE_CONFIG) as IPCMode[]).map((m) => (
 <button
 key={m}
 onClick={() => setMode(m)}
 className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all ${
 mode === m
 ? "bg-[#f5a62320] text-[#f5a623] border border-[#f5a623]"
 : "bg-[#161b22] text-[#8b949e] border border-[#30363d] hover:border-[#484f58]"
 }`}
 >
 {MODE_CONFIG[m].icon} {MODE_CONFIG[m].label}
 </button>
 ))}
 </div>
 )}

 {/* Visualization */}
 <div className="relative flex items-center justify-between gap-4 min-h-[160px]">
 {/* Process A */}
 <div
 className={`w-36 border-2 rounded-lg p-4 text-center transition-all duration-300 shrink-0 ${
 sent
 ? `bg-[${config.color}15] border-[${config.color}]`
 : "bg-[#161b22] border-[#30363d]"
 }`}
 style={{
 borderColor: sent ? config.color : "#30363d",
 backgroundColor: sent ? config.color + "10" : "#161b22",
 }}
 >
 <div className="text-white font-bold text-xs mb-1">
 {config.processA}
 </div>
 <div
 className="font-mono text-[10px] mb-2"
 style={{ color: config.color }}
 >
 PID: 1000
 </div>
 {sent && (
 <div className="text-[10px] text-[#3fb950] font-mono animate-in fade-in duration-300">
 write(&quot;{messageText}&quot;)
 </div>
 )}
 </div>

 {/* Channel (pipe/fifo/shmem) */}
 <div className="flex-1 relative mx-2">
 {/* Channel label */}
 <div className="text-center mb-2">
 <span
 className="font-mono text-[10px] px-2 py-0.5 rounded"
 style={{
 color: config.color,
 backgroundColor: config.color + "15",
 }}
 >
 {config.channelLabel}
 </span>
 </div>

 {/* The pipe visual */}
 <div className="relative h-10 rounded-full overflow-hidden border border-[#30363d] bg-[#161b22]">
 {/* Direction arrow background */}
 <div
 className="absolute inset-0 opacity-10"
 style={{
 background: `linear-gradient(90deg, transparent, ${config.color}40, transparent)`,
 }}
 />

 {/* Particles (data flowing) */}
 {particles.map((p) => (
 <div
 key={p.id}
 className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-none"
 style={{
 left: `${p.x}%`,
 backgroundColor: config.color,
 opacity: p.opacity,
 boxShadow: `0 0 8px ${config.color}80`,
 }}
 />
 ))}

 {/* Direction indicators */}
 {!isPlaying && !sent && (
 <div className="absolute inset-0 flex items-center justify-center gap-2 text-[#484f58] text-xs">
 <span>→ → →</span>
 </div>
 )}
 </div>

 {/* Kernel buffer label */}
 {mode !== "sharedmem" && (
 <div className="text-center mt-2">
 <span className="text-[#484f58] text-[10px] font-mono">
 kernel buffer
 </span>
 </div>
 )}
 {mode === "sharedmem" && (
 <div className="text-center mt-2">
 <span className="text-[#484f58] text-[10px] font-mono">
 memoria mapeada
 </span>
 </div>
 )}
 </div>

 {/* Process B */}
 <div
 className="w-36 border-2 rounded-lg p-4 text-center transition-all duration-500 shrink-0"
 style={{
 borderColor: received ? config.color : "#30363d",
 backgroundColor: received ? config.color + "10" : "#161b22",
 }}
 >
 <div className="text-white font-bold text-xs mb-1">
 {config.processB}
 </div>
 <div
 className="font-mono text-[10px] mb-2"
 style={{ color: config.color }}
 >
 PID: 1001
 </div>
 {received && (
 <div className="text-[10px] text-[#3fb950] font-mono animate-in fade-in duration-500">
 read() → &quot;{messageText}&quot;
 </div>
 )}
 {isPlaying && !received && (
 <div className="text-[10px] text-[#f5a623] font-mono animate-pulse">
 esperando...
 </div>
 )}
 </div>
 </div>

 {/* Description */}
 <div className="mt-6 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
 <p className="text-[#8b949e] text-sm leading-relaxed">
 {config.description}
 </p>
 </div>
 </div>
 </div>
 );
}
