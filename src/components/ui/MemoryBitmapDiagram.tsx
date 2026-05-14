import React from 'react';

export function MemoryBitmapDiagram() {
  return (
    <div className="flex flex-col items-center my-10 p-6 bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden w-full max-w-4xl mx-auto font-mono text-xs md:text-sm">
      
      {/* (a) Memory layout */}
      <div className="w-full mb-8">
        <div className="flex w-full h-10 border border-[#8b949e] relative">
          <div className="w-[15%] h-full border-r border-[#8b949e] flex items-center justify-center bg-[#238636]/20">A</div>
          <div className="w-[10%] h-full border-r border-[#8b949e] flex items-center justify-center bg-transparent relative overflow-hidden">
             {/* Diagonal stripes pattern for empty space */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8b949e 25%, transparent 25%, transparent 50%, #8b949e 50%, #8b949e 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
          </div>
          <div className="w-[20%] h-full border-r border-[#8b949e] flex items-center justify-center bg-[#238636]/20">B</div>
          <div className="w-[10%] h-full border-r border-[#8b949e] flex items-center justify-center bg-[#238636]/20">C</div>
          <div className="w-[10%] h-full border-r border-[#8b949e] flex items-center justify-center bg-transparent relative overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8b949e 25%, transparent 25%, transparent 50%, #8b949e 50%, #8b949e 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
          </div>
          <div className="w-[15%] h-full border-r border-[#8b949e] flex items-center justify-center bg-[#238636]/20">D</div>
          <div className="w-[10%] h-full border-r border-[#8b949e] flex items-center justify-center bg-[#238636]/20">E</div>
          <div className="w-[10%] h-full border-r border-[#8b949e] flex items-center justify-center bg-transparent relative overflow-hidden">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8b949e 25%, transparent 25%, transparent 50%, #8b949e 50%, #8b949e 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
          </div>
        </div>
        <div className="flex w-full mt-1 relative text-[#8b949e]">
            <span className="absolute left-[15%] -translate-x-1/2">8</span>
            <span className="absolute left-[45%] -translate-x-1/2">16</span>
            <span className="absolute left-[70%] -translate-x-1/2">24</span>
        </div>
        <p className="text-center mt-6 text-[#8b949e] font-bold">(a)</p>
      </div>

      <div className="flex flex-col md:flex-row w-full justify-between items-start gap-8">
        {/* (b) Bitmap */}
        <div className="flex flex-col items-center">
           <div className="border border-[#8b949e] bg-[#0d1117] p-2 flex flex-col items-center tracking-widest text-white">
             <div>11111000</div>
             <div>11111111</div>
             <div>11001111</div>
             <div>11111000</div>
           </div>
           <p className="mt-4 text-[#8b949e] font-bold">(b)</p>
        </div>

        {/* (c) Linked list */}
        <div className="flex flex-col flex-1 items-center gap-4">
           {/* Top row */}
           <div className="flex flex-wrap items-center justify-center gap-2">
             <div className="flex border border-[#8b949e] divide-x divide-[#8b949e] bg-[#0d1117] text-white">
                <span className="px-2 py-1">P</span>
                <span className="px-2 py-1">0</span>
                <span className="px-2 py-1">5</span>
                <span className="px-2 py-1">→</span>
             </div>
             <div className="flex border border-[#8b949e] divide-x divide-[#8b949e] bg-[#0d1117] text-[#8b949e]">
                <span className="px-2 py-1">H</span>
                <span className="px-2 py-1">5</span>
                <span className="px-2 py-1">3</span>
                <span className="px-2 py-1">→</span>
             </div>
             <div className="flex border border-[#8b949e] divide-x divide-[#8b949e] bg-[#0d1117] text-white">
                <span className="px-2 py-1">P</span>
                <span className="px-2 py-1">8</span>
                <span className="px-2 py-1">8</span>
                <span className="px-2 py-1">→</span>
             </div>
           </div>
           
           {/* Bottom row */}
           <div className="flex flex-wrap items-center justify-center gap-2 mt-4 relative">
             <div className="flex border border-[#8b949e] divide-x divide-[#8b949e] bg-[#0d1117] text-[#8b949e]">
                <span className="px-2 py-1">H</span>
                <span className="px-2 py-1">16</span>
                <span className="px-2 py-1">2</span>
                <span className="px-2 py-1">→</span>
             </div>
             <div className="flex border border-[#8b949e] divide-x divide-[#8b949e] bg-[#0d1117] text-white">
                <span className="px-2 py-1">P</span>
                <span className="px-2 py-1">18</span>
                <span className="px-2 py-1">6</span>
                <span className="px-2 py-1">→</span>
             </div>
             <div className="flex border border-[#8b949e] divide-x divide-[#8b949e] bg-[#0d1117] text-[#8b949e]">
                <span className="px-2 py-1">H</span>
                <span className="px-2 py-1">24</span>
                <span className="px-2 py-1">3</span>
                <span className="px-2 py-1">x</span>
             </div>
           </div>
           <p className="mt-4 text-[#8b949e] font-bold">(c)</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-[#8b949e] text-center">Figura 5-2. Mapa de bits y Listas Ligadas.</p>
    </div>
  );
}
