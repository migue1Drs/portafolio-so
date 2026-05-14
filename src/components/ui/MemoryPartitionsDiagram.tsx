import React from 'react';

export function MemoryPartitionsDiagram() {
  return (
    <div className="flex flex-col items-center my-10 p-6 bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden">
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl justify-center items-center">
        
        {/* Figure A: Multiple Queues */}
        <div className="flex flex-col items-center">
          <div className="flex items-start gap-4">
            
            {/* Queues */}
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#8b949e] -mt-6 absolute">Varias colas de<br/>entrada</span>
                <div className="w-5 h-5 border border-[#8b949e]"></div>
                <div className="w-5 h-5 border border-[#8b949e]"></div>
                <div className="w-4 h-[1px] bg-[#8b949e]"></div>
              </div>
              <div className="h-6"></div> {/* Spacer for Particion 3 */}
              <div className="flex items-center gap-1 ml-4 mt-2">
                <div className="w-5 h-5 border border-[#8b949e]"></div>
                <div className="w-4 h-[1px] bg-[#8b949e]"></div>
              </div>
              <div className="flex items-center gap-1 -ml-4 mt-4">
                <div className="w-5 h-5 border border-[#8b949e]"></div>
                <div className="w-5 h-5 border border-[#8b949e]"></div>
                <div className="w-5 h-5 border border-[#8b949e]"></div>
                <div className="w-4 h-[1px] bg-[#8b949e]"></div>
              </div>
            </div>

            {/* Memory Layout */}
            <div className="relative border-l border-r border-t border-[#58a6ff] w-40 flex flex-col text-sm text-center">
              <div className="border-b border-[#58a6ff] h-12 flex items-center justify-center relative bg-[#1f6feb]/10">
                Partición 4
                <span className="absolute -right-10 text-xs text-[#8b949e]">8 GB</span>
              </div>
              <div className="border-b border-[#58a6ff] h-16 flex items-center justify-center relative bg-[#1f6feb]/10">
                Partición 3
                <span className="absolute -right-10 text-xs text-[#8b949e]">5 GB</span>
              </div>
              <div className="border-b border-[#58a6ff] h-12 flex items-center justify-center relative bg-[#1f6feb]/10">
                Partición 2
                <span className="absolute -right-10 text-xs text-[#8b949e]">3 GB</span>
              </div>
              <div className="border-b border-[#58a6ff] h-10 flex items-center justify-center relative bg-[#1f6feb]/10">
                Partición 1
                <span className="absolute -right-10 text-xs text-[#8b949e]">2 GB</span>
              </div>
              <div className="border-b border-[#58a6ff] h-16 flex flex-col items-center justify-center relative bg-[#238636]/20">
                <span>Sistema</span>
                <span>Operativo</span>
                <span className="absolute -right-10 text-xs text-[#8b949e]">0 GB</span>
              </div>
            </div>

          </div>
          <p className="mt-4 text-sm text-[#8b949e] font-bold">(a)</p>
        </div>

        {/* Figure B: Single Queue */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            
            {/* Single Queue */}
            <div className="flex items-center gap-1 relative">
              <span className="text-xs text-[#8b949e] -mt-10 absolute left-0 w-24">Una cola de<br/>entrada</span>
              <div className="w-5 h-5 border border-[#8b949e]"></div>
              <div className="w-5 h-5 border border-[#8b949e]"></div>
              <div className="w-5 h-5 border border-[#8b949e]"></div>
              <div className="w-5 h-5 border border-[#8b949e]"></div>
              {/* Fan-out lines to partitions */}
              <div className="absolute right-0 top-1/2 w-8 h-[1px] bg-[#8b949e] translate-x-full"></div>
              <svg className="absolute right-[-4rem] top-[-3rem] w-16 h-28 pointer-events-none" style={{stroke: '#8b949e', fill: 'none'}}>
                 <path d="M 0,60 L 64,10" />
                 <path d="M 0,60 L 64,40" />
                 <path d="M 0,60 L 64,75" />
                 <path d="M 0,60 L 64,100" />
              </svg>
            </div>
            
            <div className="w-8"></div> {/* Spacing for SVG */}

            {/* Memory Layout */}
            <div className="relative border-l border-r border-t border-[#58a6ff] w-40 flex flex-col text-sm text-center">
              <div className="border-b border-[#58a6ff] h-12 flex items-center justify-center bg-[#1f6feb]/10">Partición 4</div>
              <div className="border-b border-[#58a6ff] h-16 flex items-center justify-center bg-[#1f6feb]/10">Partición 3</div>
              <div className="border-b border-[#58a6ff] h-12 flex items-center justify-center bg-[#1f6feb]/10">Partición 2</div>
              <div className="border-b border-[#58a6ff] h-10 flex items-center justify-center bg-[#1f6feb]/10">Partición 1</div>
              <div className="border-b border-[#58a6ff] h-16 flex flex-col items-center justify-center bg-[#238636]/20">
                <span>Sistema</span>
                <span>Operativo</span>
              </div>
            </div>

          </div>
          <p className="mt-4 text-sm text-[#8b949e] font-bold">(b)</p>
        </div>

      </div>
      <p className="mt-8 text-sm text-[#8b949e] text-center">Figura 5-1. (a) Colas de entradas independientes, (b) Ordenamiento en una cola.</p>
    </div>
  );
}
