"use client";

import { useState } from "react";

interface StateInfo {
  name: string;
  color: string;
  borderColor: string;
  description: string;
  trigger: string;
}

const STATES: StateInfo[] = [
  { name: "Nuevo", color: "bg-[#484f58]", borderColor: "border-[#6e7681]", description: "El proceso ha sido creado pero aún no ha sido admitido al pool de procesos listos.", trigger: "Se ejecuta fork()" },
  { name: "Listo", color: "bg-[#1f6feb]", borderColor: "border-[#58a6ff]", description: "El proceso está en memoria y esperando a que el planificador (scheduler) le asigne la CPU.", trigger: "Admitido por el SO" },
  { name: "Ejecución", color: "bg-[#238636]", borderColor: "border-[#3fb950]", description: "El proceso tiene la CPU y está ejecutando instrucciones activamente.", trigger: "Seleccionado por scheduler" },
  { name: "Bloqueado", color: "bg-[#9b6a00]", borderColor: "border-[#f5a623]", description: "El proceso espera un evento externo (I/O, señal, recurso) y no puede continuar hasta que ocurra.", trigger: "Solicita I/O o recurso" },
  { name: "Terminado", color: "bg-[#da3633]", borderColor: "border-[#f85149]", description: "El proceso ha finalizado su ejecución. Sus recursos serán liberados por el kernel.", trigger: "exit() o señal fatal" },
];

export function ProcessStateDiagram() {
  const [activeState, setActiveState] = useState<number | null>(null);

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 my-8">
      <h4 className="text-[#f5a623] font-bold text-sm uppercase tracking-widest mb-6">
        🔄 Diagrama de Estados de un Proceso
      </h4>
      <p className="text-[#8b949e] text-xs mb-6">
        Pasa el cursor sobre cada estado para ver su descripción.
      </p>

      {/* State diagram */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2 mb-6">
        {STATES.map((state, i) => (
          <div key={state.name} className="flex items-center">
            <button
              onMouseEnter={() => setActiveState(i)}
              onMouseLeave={() => setActiveState(null)}
              onClick={() => setActiveState(activeState === i ? null : i)}
              className={`${state.color} border-2 ${state.borderColor} rounded-lg px-4 py-2.5 text-center transition-all duration-300 cursor-pointer ${
                activeState === i
                  ? "scale-110 shadow-lg ring-2 ring-white/20"
                  : "hover:scale-105"
              }`}
            >
              <div className="text-white font-bold text-xs md:text-sm whitespace-nowrap">{state.name}</div>
            </button>
            {i < STATES.length - 1 && (
              <div className="flex items-center mx-1 text-[#484f58]">
                <div className="w-4 md:w-6 h-0.5 bg-[#30363d]"></div>
                <span className="text-[#484f58] text-xs">→</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Transition arrows for blocked state */}
      <div className="flex justify-center mb-4">
        <div className="text-[#8b949e] text-[10px] font-mono flex items-center gap-2">
          <span className="text-[#3fb950]">Ejecución</span>
          <span>→ I/O →</span>
          <span className="text-[#f5a623]">Bloqueado</span>
          <span>→ evento →</span>
          <span className="text-[#58a6ff]">Listo</span>
        </div>
      </div>

      {/* Info panel */}
      <div className={`bg-[#161b22] border border-[#30363d] rounded-lg p-4 transition-all duration-300 min-h-[80px] ${
        activeState !== null ? "opacity-100" : "opacity-50"
      }`}>
        {activeState !== null ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${STATES[activeState].color}`}></div>
              <span className="text-white font-bold text-sm">{STATES[activeState].name}</span>
              <span className="text-[10px] text-[#484f58] font-mono bg-[#0d1117] px-2 py-0.5 rounded">
                {STATES[activeState].trigger}
              </span>
            </div>
            <p className="text-[#8b949e] text-sm leading-relaxed">{STATES[activeState].description}</p>
          </>
        ) : (
          <p className="text-[#484f58] text-sm italic text-center">
            Selecciona un estado para ver su descripción...
          </p>
        )}
      </div>
    </div>
  );
}
