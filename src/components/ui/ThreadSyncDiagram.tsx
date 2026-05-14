export function ThreadSyncDiagram() {
  return (
    <div className="flex flex-col items-center my-10 p-6 bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden">
      <div className="relative w-full max-w-3xl flex items-center justify-between text-sm font-bold text-white text-center">
        
        {/* Hilo Origen 1 */}
        <div className="relative z-10 w-28 bg-[#0a3069] border border-[#1f6feb] py-4 rounded-md shadow-lg shadow-blue-900/20">
          Hilo<br/>Origen
        </div>

        {/* Arrow 1 */}
        <div className="flex-1 h-[2px] bg-[#30363d] relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 border-t-2 border-r-2 border-[#30363d] rotate-45"></div>
        </div>

        {/* Center Top Flow */}
        <div className="relative z-10 flex flex-col gap-16 w-48">
          <div className="bg-[#0a3069] border border-[#1f6feb] py-4 rounded-md">
            <span className="text-xs font-normal">Creando hilo</span><br/>
            pthread_create()
          </div>
          <div className="bg-[#b35900] border border-[#f88125] py-4 rounded-md relative">
            <span className="text-xs font-normal">Hilo Creado</span><br/>
            (en ejecución)
            {/* Arrow from Create to Execution */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[2px] h-16 bg-[#30363d]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 border-b-2 border-r-2 border-[#30363d] rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Arrow 2 (Top) */}
        <div className="flex-1 h-[2px] bg-[#30363d] relative -mt-32">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 border-t-2 border-r-2 border-[#30363d] rotate-45"></div>
        </div>

        {/* Arrow 3 (Bottom) */}
        <div className="flex-1 h-[2px] bg-[#30363d] relative mt-32">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 border-t-2 border-r-2 border-[#30363d] rotate-45"></div>
        </div>

        {/* Center Bottom Flow */}
        <div className="relative z-10 flex flex-col gap-16 w-48">
          <div className="bg-[#4d4d00] border border-[#d29922] py-4 rounded-md">
            <span className="text-xs font-normal">Esperando</span><br/>
            pthread_join()
          </div>
          <div className="bg-[#b35900] border border-[#f88125] py-4 rounded-md relative">
            <span className="text-xs font-normal">Hilo Terminando</span><br/>
            pthread_exit()
            {/* Arrow from Exit to Join */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[2px] h-16 bg-[#30363d]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-l-2 border-[#30363d] rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Arrow 4 */}
        <div className="flex-1 h-[2px] bg-[#30363d] relative -mt-32">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 border-t-2 border-r-2 border-[#30363d] rotate-45"></div>
        </div>

        {/* Hilo Origen 2 */}
        <div className="relative z-10 w-28 bg-[#0a3069] border border-[#1f6feb] py-4 rounded-md shadow-lg shadow-blue-900/20 -mt-32">
          Hilo<br/>Origen
        </div>

      </div>
      <p className="mt-8 text-sm text-[#8b949e]">Figura 2-2. Sincronización de hilos.</p>
    </div>
  );
}
