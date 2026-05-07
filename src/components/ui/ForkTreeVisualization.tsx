"use client";

import { useState } from "react";

interface ProcessNode {
  pid: number;
  label: string;
  children: ProcessNode[];
}

export function ForkTreeVisualization() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    { description: "Proceso padre inicia con PID 1000", nodes: 1 },
    { description: "fork() crea un proceso hijo — se duplica el espacio de direcciones", nodes: 2 },
    { description: "Padre (retorno > 0) e hijo (retorno = 0) continúan ejecutándose", nodes: 2 },
  ];

  const handleStep = () => {
    if (isAnimating) return;
    if (step >= steps.length - 1) {
      setIsAnimating(true);
      setStep(0);
      setTimeout(() => setIsAnimating(false), 300);
      return;
    }
    setIsAnimating(true);
    setStep((s) => s + 1);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 my-8 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[#f5a623] font-bold text-sm uppercase tracking-widest">
          🌳 Visualización de fork()
        </h4>
        <button
          onClick={handleStep}
          className="text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded bg-[#f5a623] text-[#0d1117] hover:bg-[#d48810] transition-colors"
        >
          {step >= steps.length - 1 ? "↺ Reiniciar" : step === 0 ? "▶ Iniciar" : "→ Siguiente"}
        </button>
      </div>

      {/* Visualization area */}
      <div className="flex flex-col items-center min-h-[200px] relative">
        {/* Parent process */}
        <div className={`transition-all duration-500 ${step >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
          <div className="bg-[#1f6feb] border-2 border-[#58a6ff] rounded-lg px-6 py-3 text-center shadow-lg shadow-[#1f6feb20]">
            <div className="text-white font-bold text-sm">Proceso Padre</div>
            <div className="text-[#58a6ff] font-mono text-xs mt-1">PID: 1000</div>
            {step >= 2 && (
              <div className="text-[#7ee787] font-mono text-[10px] mt-1 animate-pulse">
                fork() → retorna 1001
              </div>
            )}
          </div>
        </div>

        {/* Fork arrow */}
        {step >= 1 && (
          <div className="flex flex-col items-center my-2 animate-in fade-in duration-500">
            <div className="w-0.5 h-6 bg-gradient-to-b from-[#58a6ff] to-[#f5a623]"></div>
            <div className="bg-[#161b22] border border-[#30363d] rounded px-3 py-1 text-[10px] font-mono text-[#f5a623] font-bold">
              fork()
            </div>
            <div className="flex items-start mt-2">
              <div className="w-20 h-0.5 bg-[#58a6ff]"></div>
              <div className="w-0.5 h-4 bg-[#58a6ff] -mt-0.5"></div>
              <div className="w-0.5 h-4 bg-[#f5a623] -mt-0.5 ml-[158px]"></div>
              <div className="w-20 h-0.5 bg-[#f5a623] -ml-20"></div>
            </div>
          </div>
        )}

        {/* Child processes */}
        {step >= 1 && (
          <div className="flex gap-8 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Parent continues */}
            <div className="bg-[#1f6feb] border-2 border-[#58a6ff] rounded-lg px-5 py-3 text-center shadow-lg shadow-[#1f6feb20] transition-all duration-500">
              <div className="text-white font-bold text-sm">Padre</div>
              <div className="text-[#58a6ff] font-mono text-xs mt-1">PID: 1000</div>
              {step >= 2 && (
                <div className="text-[#7ee787] font-mono text-[10px] mt-1">
                  pid &gt; 0 ✓
                </div>
              )}
            </div>

            {/* Child created */}
            <div className={`bg-[#9b6a00] border-2 border-[#f5a623] rounded-lg px-5 py-3 text-center shadow-lg shadow-[#f5a62320] transition-all duration-700 ${
              step >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}>
              <div className="text-white font-bold text-sm">Hijo</div>
              <div className="text-[#f5a623] font-mono text-xs mt-1">PID: 1001</div>
              {step >= 2 && (
                <div className="text-[#7ee787] font-mono text-[10px] mt-1">
                  pid == 0 ✓
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step description */}
      <div className="mt-6 bg-[#161b22] border border-[#30363d] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-[#f5a623] font-mono text-xs font-bold bg-[#f5a62320] px-2 py-0.5 rounded">
            Paso {step + 1}/{steps.length}
          </span>
          <p className="text-[#c9d1d9] text-sm">{steps[step].description}</p>
        </div>
      </div>
    </div>
  );
}
