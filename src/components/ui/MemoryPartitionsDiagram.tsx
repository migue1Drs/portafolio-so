import React from 'react';

export function MemoryPartitionsDiagram() {
  return (
    <div className="flex flex-col items-center my-10 p-6 bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden font-sans">
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 w-full max-w-4xl justify-center items-end md:items-stretch pt-8">
        
        {/* Figure A: Multiple Queues */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="flex items-start">
            
            {/* Queues Column - Exact same height segments as Memory */}
            <div className="flex flex-col w-32 relative">
              {/* Text Label */}
              <div className="absolute -top-8 left-0 right-0 text-center">
                <span className="text-xs text-[#c9d1d9] font-medium leading-tight inline-block">
                  Varias colas de<br/>entrada
                </span>
              </div>
              
              {/* Partición 4 Queue */}
              <div className="h-12 flex items-center justify-end pr-0">
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                  <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                  <div className="w-4 h-[2px] bg-[#8b949e]"></div>
                </div>
              </div>
              
              {/* Partición 3 Queue (Empty) */}
              <div className="h-16 flex items-center justify-end pr-0">
              </div>
              
              {/* Partición 2 Queue */}
              <div className="h-12 flex items-center justify-end pr-0">
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                  <div className="w-4 h-[2px] bg-[#8b949e]"></div>
                </div>
              </div>
              
              {/* Partición 1 Queue */}
              <div className="h-10 flex items-center justify-end pr-0">
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                  <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                  <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                  <div className="w-4 h-[2px] bg-[#8b949e]"></div>
                </div>
              </div>
              
              {/* SO Queue (Empty) */}
              <div className="h-16 flex items-center justify-end pr-0">
              </div>
            </div>

            {/* Memory Layout */}
            <div className="relative border-2 border-b-0 border-[#58a6ff] w-32 md:w-40 flex flex-col text-sm text-center text-[#c9d1d9] bg-[#0d1117]">
              <div className="border-b-2 border-[#58a6ff] h-12 flex items-center justify-center relative hover:bg-[#1f6feb]/10 transition-colors">
                Partición 4
                <span className="absolute -right-12 text-xs text-[#8b949e] font-mono">8 GB</span>
              </div>
              <div className="border-b-2 border-[#58a6ff] h-16 flex items-center justify-center relative hover:bg-[#1f6feb]/10 transition-colors">
                Partición 3
                <span className="absolute -right-12 text-xs text-[#8b949e] font-mono">5 GB</span>
              </div>
              <div className="border-b-2 border-[#58a6ff] h-12 flex items-center justify-center relative hover:bg-[#1f6feb]/10 transition-colors">
                Partición 2
                <span className="absolute -right-12 text-xs text-[#8b949e] font-mono">3 GB</span>
              </div>
              <div className="border-b-2 border-[#58a6ff] h-10 flex items-center justify-center relative hover:bg-[#1f6feb]/10 transition-colors">
                Partición 1
                <span className="absolute -right-12 text-xs text-[#8b949e] font-mono">2 GB</span>
              </div>
              <div className="border-b-2 border-[#58a6ff] h-16 flex flex-col items-center justify-center relative bg-[#238636]/10 hover:bg-[#238636]/20 transition-colors">
                <span>Sistema</span>
                <span>Operativo</span>
                <span className="absolute -right-12 text-xs text-[#8b949e] font-mono">0 GB</span>
              </div>
            </div>

          </div>
          <p className="mt-8 text-sm text-[#8b949e] font-bold tracking-widest">(a)</p>
        </div>

        {/* Figure B: Single Queue */}
        <div className="flex flex-col items-center w-full md:w-auto mt-12 md:mt-0">
          <div className="flex items-start">
            
            {/* Single Queue Container */}
            <div className="flex flex-col w-40 relative h-[264px] justify-center pr-4">
              {/* Text Label */}
              <div className="absolute top-[80px] left-0 right-4 text-center">
                <span className="text-xs text-[#c9d1d9] font-medium leading-tight inline-block">
                  Una cola de<br/>entrada
                </span>
              </div>
              
              <div className="flex items-center justify-center w-full relative z-10">
                <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                <div className="w-5 h-5 border-2 border-[#8b949e] bg-[#161b22] ml-1"></div>
                {/* Horizontal line out */}
                <div className="w-4 h-[2px] bg-[#8b949e]"></div>
              </div>
              
              {/* SVG Fan-out lines perfectly positioned */}
              {/* Total height is 264px. Center is at 132px. */}
              {/* P4 center: 24px */}
              {/* P3 center: 48 + 32 = 80px */}
              {/* P2 center: 48 + 64 + 24 = 136px */}
              {/* P1 center: 48 + 64 + 48 + 20 = 180px */}
              <svg className="absolute right-0 top-0 w-8 h-full pointer-events-none" style={{stroke: '#8b949e', strokeWidth: 2, fill: 'none'}}>
                {/* To P4 (y=24) */}
                <line x1="0" y1="132" x2="32" y2="24" />
                {/* To P3 (y=80) */}
                <line x1="0" y1="132" x2="32" y2="80" />
                {/* To P2 (y=136) */}
                <line x1="0" y1="132" x2="32" y2="136" />
                {/* To P1 (y=180) */}
                <line x1="0" y1="132" x2="32" y2="180" />
              </svg>
            </div>
            
            {/* Memory Layout */}
            <div className="relative border-2 border-b-0 border-[#58a6ff] w-32 md:w-40 flex flex-col text-sm text-center text-[#c9d1d9] bg-[#0d1117]">
              <div className="border-b-2 border-[#58a6ff] h-12 flex items-center justify-center hover:bg-[#1f6feb]/10 transition-colors">Partición 4</div>
              <div className="border-b-2 border-[#58a6ff] h-16 flex items-center justify-center hover:bg-[#1f6feb]/10 transition-colors">Partición 3</div>
              <div className="border-b-2 border-[#58a6ff] h-12 flex items-center justify-center hover:bg-[#1f6feb]/10 transition-colors">Partición 2</div>
              <div className="border-b-2 border-[#58a6ff] h-10 flex items-center justify-center hover:bg-[#1f6feb]/10 transition-colors">Partición 1</div>
              <div className="border-b-2 border-[#58a6ff] h-16 flex flex-col items-center justify-center bg-[#238636]/10 hover:bg-[#238636]/20 transition-colors">
                <span>Sistema</span>
                <span>Operativo</span>
              </div>
            </div>

          </div>
          <p className="mt-8 text-sm text-[#8b949e] font-bold tracking-widest">(b)</p>
        </div>

      </div>
      <p className="mt-10 text-sm text-[#c9d1d9] text-center font-medium">Figura 5-1. (a) Colas de entradas independientes, (b) Ordenamiento en una cola.</p>
    </div>
  );
}

