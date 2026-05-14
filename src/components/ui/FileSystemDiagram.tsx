import React from 'react';

export function FileSystemDiagram() {
  return (
    <div className="flex flex-col items-center my-8 p-6 bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden w-full max-w-4xl mx-auto">
      
      <div className="flex flex-col md:flex-row w-full justify-between border border-[#58a6ff] rounded-md overflow-hidden text-center text-sm md:text-base font-bold shadow-lg shadow-[#1f6feb]/10">
        <div className="flex-1 bg-[#1f6feb]/20 p-4 border-b md:border-b-0 md:border-r border-[#58a6ff] hover:bg-[#1f6feb]/30 transition-colors">
          Boot
          <span className="block mt-2 text-xs font-normal text-[#8b949e]">Arranque del SO</span>
        </div>
        <div className="flex-1 bg-[#1f6feb]/20 p-4 border-b md:border-b-0 md:border-r border-[#58a6ff] hover:bg-[#1f6feb]/30 transition-colors">
          Superbloque
          <span className="block mt-2 text-xs font-normal text-[#8b949e]">Estado y metadatos</span>
        </div>
        <div className="flex-1 bg-[#238636]/20 p-4 border-b md:border-b-0 md:border-r border-[#58a6ff] hover:bg-[#238636]/30 transition-colors">
          Lista de Inodos
          <span className="block mt-2 text-xs font-normal text-[#8b949e]">Permisos, tamaño</span>
        </div>
        <div className="flex-[2] bg-[#a371f7]/20 p-4 hover:bg-[#a371f7]/30 transition-colors">
          Bloque de Datos
          <span className="block mt-2 text-xs font-normal text-[#8b949e]">Contenido de archivos reales</span>
        </div>
      </div>
      
      <p className="mt-6 text-sm text-[#8b949e] font-mono text-center">Figura 6.1 Secciones lógicas del sistema de archivos.</p>
    </div>
  );
}
