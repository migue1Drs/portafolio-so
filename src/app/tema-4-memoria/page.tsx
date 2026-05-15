import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA5_QUIZ } from "@/lib/quiz-data";
import { MemoryPartitionsDiagram } from "@/components/ui/MemoryPartitionsDiagram";
import { MemoryBitmapDiagram } from "@/components/ui/MemoryBitmapDiagram";

export default function Tema5Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 4"
        title="Administración de memoria"
        description="Gestión eficiente de la memoria principal, paginación, segmentación, reasignación, protección, y memoria virtual mediante el sistema operativo."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* Intro */}
        <section>
          <p className="mb-4">
            La memoria principal es un recurso limitado que debe administrar de forma eficiente el sistema operativo. Se debe tener presente que sólo los procesos activos de mayor prioridad deberían estar en memoria para un mayor desempeño.
          </p>
          <p className="mb-4">
            Una de las tareas más importantes y complejas de un sistema operativo es la administración de memoria, lo cual implica asignarlo y compartirlo entre varios procesos activos, así como administrar el intercambio entre la memoria principal y el disco (swap).
          </p>
        </section>

        {/* 5.1 */}
        <section>
          <SectionHeading id="5-1-introduccion" number="4.1" title="Introducción" />
          <p className="mb-4">
            Las herramientas básicas de la administración de memoria son la <strong className="text-white">paginación</strong> (tamaño constante) y la <strong className="text-white">segmentación</strong> (tamaño variable). En la paginación, cada proceso se divide en páginas de tamaño constante y relativamente pequeña. 
          </p>
          <p className="mb-4">
            Para visualizar el tamaño de la página de memoria en su sistema, puede ejecutar <code className="text-[#58a6ff]">getconf PAGESIZE</code>, que comúnmente retorna 4KB (4096 bytes) en arquitecturas x86. En C, se utilizan las funciones <code className="text-[#f5a623]">sysconf()</code> y <code className="text-[#f5a623]">getpagesize()</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO sysconf</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">long</span> <span className="text-[#d2a8ff]">sysconf</span>(<span className="text-[#ff7b72]">int</span> name);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO getpagesize</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">getpagesize</span>(<span className="text-[#ff7b72]">void</span>);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Obtener el tamaño de página</h3>
          <CopyCodeBlock 
            filename="pagesize.c" 
            language="C" 
            code={`#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

int main() {
    printf("Tamaño de página: %d \\n\\n", (int)sysconf(_SC_PAGESIZE));
    printf("Tamaño de página: %d \\n\\n", (int)getpagesize());
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc pagesize.c -o pagesize"
            runCommand="./pagesize"
            output={`Tamaño de página: 4096 

Tamaño de página: 4096 `} 
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Comprendí que la <a href="#5-1-introduccion" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">paginación</a> divide la memoria en bloques de tamaño fijo (generalmente 4KB) y que funciones como <a href="#5-1-introduccion" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">sysconf()</code></a> y <a href="#5-1-introduccion" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">getpagesize()</code></a> permiten consultar este parámetro desde un programa en C.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Experimentando con páginas de tamaño grande (Huge Pages) en Linux y midiendo el impacto en el rendimiento de aplicaciones con gran consumo de memoria.
            </p>
          </ReflectionBox>
        </section>
        <section>
          <SectionHeading id="5-3-modelos" number="4.2" title="Modelos de multiprogramación" />
          <p className="mb-4">
            El uso de la CPU se puede mejorar mediante la multiprogramación. Desde un punto de vista probabilístico, si un proceso ocupa una fracción <code className="text-[#58a6ff]">p</code> de su tiempo en el estado de espera de E/S, y hay <code className="text-[#58a6ff]">n</code> procesos, el uso de la CPU está dado por: <code className="text-white font-mono">CPU = 1 - p^n</code>.
          </p>
          <p className="mb-4">
            Para organizar la memoria, la forma más sencilla es dividirla en partes (particiones fijas). Se puede utilizar colas independientes o una sola cola general, aunque cada una presenta desventajas en el uso del espacio o el favoritismo por trabajos más grandes.
          </p>

          <MemoryPartitionsDiagram />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que la <a href="#5-3-modelos" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">multiprogramación</a> mejora el uso de la CPU y que las particiones fijas dividen la memoria en bloques estáticos, aunque generan fragmentación interna.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Simulando visualmente cómo el algoritmo de particiones dinámicas (best-fit vs first-fit) selecciona huecos de memoria para diferentes procesos.
            </p>
          </ReflectionBox>
        </section>

        {/* 5.5 */}
        <section>
          <SectionHeading id="5-5-reasignacion" number="4.3" title="Reasignación y protección" />
          <p className="mb-4">
            La multiprogramación presenta dos problemas: <strong>la reasignación</strong> y <strong>la protección</strong>. Cuando un programa se carga en una partición, debe adaptar sus direcciones lógicas. Esto se soluciona con hardware usando el <strong className="text-white">registro base</strong> (indica el inicio de la partición) y el <strong className="text-white">registro límite</strong> (indica la longitud, para no invadir áreas externas).
          </p>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Entendí que el <a href="#5-5-reasignacion" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">registro base y el registro límite</a> son mecanismos de hardware que permiten reasignar direcciones lógicas a físicas y proteger la memoria de cada proceso contra accesos indebidos.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Analizando con <code className="text-[#58a6ff]">pmap</code> el mapa de memoria de un proceso real para observar cómo el kernel asigna las regiones de texto, datos, heap y pila.
            </p>
          </ReflectionBox>
        </section>
        <section>
          <SectionHeading id="5-6-intercambio" number="4.4" title="Intercambio (Swap)" />
          <p className="mb-4">
            El traslado de procesos de la memoria principal al disco y viceversa se llama intercambio (swap). En GNU/Linux, se puede verificar con el comando <code className="text-[#58a6ff]">swapon -s</code>. En C se usan las funciones <code className="text-[#f5a623]">swapon()</code> y <code className="text-[#f5a623]">swapoff()</code>.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPOS SWAP</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br />
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/swap.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">swapon</span>(<span className="text-[#ff7b72]">const char</span> *path, <span className="text-[#ff7b72]">int</span> swapflags);<br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">swapoff</span>(<span className="text-[#ff7b72]">const char</span> *path);
            </code>
          </div>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Comprendí que el <a href="#5-6-intercambio" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">intercambio (swap)</a> permite al sistema operativo mover procesos inactivos al disco para liberar RAM, y que las funciones <a href="#5-6-intercambio" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">swapon()</code></a> / <a href="#5-6-intercambio" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">swapoff()</code></a> controlan este mecanismo.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Monitorizando el parámetro <code className="text-[#58a6ff]">vm.swappiness</code> en tiempo real mientras ejecuto múltiples programas, para observar cuándo el kernel decide empezar a paginar.
            </p>
          </ReflectionBox>
        </section>
        <section>
          <SectionHeading id="5-8-registro-uso" number="4.5" title="Registro de uso (Listas)" />
          <p className="mb-4">
            Existen formas utilizadas para llevar un registro del uso de la memoria:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2 text-[#b0b8c4]">
            <li><strong className="text-white">Mapas de bits:</strong> La memoria se divide en unidades de asignación, marcadas con 1 (ocupado) o 0 (libre).</li>
            <li><strong className="text-white">Listas ligadas:</strong> Cada entrada especifica un hueco (H) o proceso (P). Algoritmos de asignación comunes son: <span className="text-[#58a6ff]">Primer ajuste</span> (usado por UNIX), <span className="text-[#58a6ff]">Siguiente ajuste</span>, <span className="text-[#58a6ff]">Mejor ajuste</span> y <span className="text-[#58a6ff]">Peor ajuste</span>.</li>
          </ul>

          <MemoryBitmapDiagram />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que los <a href="#5-8-registro-uso" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">mapas de bits y las listas enlazadas</a> son las dos estructuras de datos fundamentales para rastrear qué regiones de la memoria están ocupadas y cuáles están libres.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Implementando en C un simulador de asignación de memoria que compare los algoritmos Primer Ajuste, Mejor Ajuste y Peor Ajuste para medir la fragmentación resultante.
            </p>
          </ReflectionBox>
        </section>

        {/* 5.9 */}
        <section>
          <SectionHeading id="5-9-memoria-virtual" number="4.6" title="Memoria virtual" />
          <p className="mb-4">
            Permite que el tamaño combinado de los programas exceda la memoria física, mediante la Unidad de Administración de la Memoria (MMU) que traduce direcciones virtuales a físicas usando páginas. En Linux, el parámetro <code className="text-[#58a6ff]">vm.swappiness</code> (default: 60 en Ubuntu) controla qué tan agresivo es el paginado a disco.
          </p>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Entendí que la <a href="#5-9-memoria-virtual" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">memoria virtual</a> permite ejecutar programas más grandes que la RAM física disponible, gracias a la MMU que traduce direcciones virtuales a físicas de forma transparente.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Estudiando los algoritmos de reemplazo de páginas (LRU, FIFO, Clock) y simulando su comportamiento con diferentes patrones de acceso a memoria.
            </p>
          </ReflectionBox>
        </section>
        <section>
          <SectionHeading id="5-10-funciones" number="4.7" title="Funciones del sistema" />
          <p className="mb-4">
            La función <code className="text-[#f5a623]">sysinfo()</code> retorna estadísticas globales. Además, el mapeo de archivos a memoria se hace con <code className="text-[#f5a623]">mmap()</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">sysinfo</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/sysinfo.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">sysinfo</span>(<span className="text-[#ff7b72]">struct sysinfo</span> *info);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">mmap / munmap</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/mman.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">void*</span> <span className="text-[#d2a8ff]">mmap</span>(<span className="text-[#ff7b72]">void</span> *addr, ...);<br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">munmap</span>(<span className="text-[#ff7b72]">void</span> *addr, <span className="text-[#ff7b72]">size_t</span> length);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Estadísticas del sistema (RAM y Swap)</h3>
          <CopyCodeBlock 
            filename="info_memoria.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/sysinfo.h>

#define minuto 60
#define hora (minuto*60)
#define dia (hora*24)
#define KB 1024

int main() {
    struct sysinfo si;
    sysinfo(&si);
    
    printf("Tiempo del sistema : %ld dias, %ld:%02ld:%02ld\\n", 
           si.uptime/dia, (si.uptime%dia)/hora, (si.uptime%hora)/minuto, si.uptime%minuto);
    printf("Total RAM: %ld KB\\n", si.totalram / KB);
    printf("Libre RAM: %ld KB\\n", si.freeram / KB);
    printf("Swap: %ld KB\\n", si.totalswap / KB);
    printf("Cantidad de procesos: %d\\n", si.procs);
    
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc info_memoria.c -o info_memoria"
            runCommand="./info_memoria"
            output={`Tiempo del sistema : 2 dias, 4:15:32
Total RAM: 16384000 KB
Libre RAM: 4200000 KB
Swap: 2048000 KB
Cantidad de procesos: 342`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí a usar <a href="#5-10-funciones" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">sysinfo()</code></a> para obtener estadísticas globales del sistema (RAM total, libre, swap, procesos) y <a href="#5-10-funciones" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">mmap()</code></a> para mapear archivos directamente a memoria, evitando copias intermedias.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Escribiendo un programa que use <code className="text-[#f5a623]">mmap()</code> para leer un archivo grande y comparar su rendimiento contra la lectura tradicional con <code className="text-[#f5a623]">read()</code>.
            </p>
          </ReflectionBox>
        </section>

        {/* Ejercicios */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 my-8">
          <h3 className="text-[#58a6ff] font-bold text-lg mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            Ejercicios Propuestos
          </h3>
          <ol className="list-decimal list-inside space-y-4 text-sm">
            <li>
              <strong className="text-white">Comandos para visualizar la memoria:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><code className="text-[#58a6ff]">free -m / -h</code> (Muestra la memoria libre/ocupada en formato megabytes o humano).</li>
                <li><code className="text-[#58a6ff]">top</code> (Monitor en tiempo real que incluye el uso de la RAM).</li>
                <li><code className="text-[#58a6ff]">vmstat -s -S M</code> (Estadísticas de la memoria virtual).</li>
                <li><code className="text-[#58a6ff]">swapon -s</code> (Muestra las particiones o archivos swap activos).</li>
                <li><code className="text-[#58a6ff]">pmap -x [PID]</code> (Muestra el mapa de memoria detallado del proceso).</li>
              </ul>
            </li>
            <li>
              <strong className="text-white">Información en el directorio /proc:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><code className="text-[#58a6ff]">/proc/meminfo</code> (Detalles del uso general de la RAM).</li>
                <li><code className="text-[#58a6ff]">/proc/slabinfo</code> (Cachés del kernel).</li>
                <li><code className="text-[#58a6ff]">/proc/swaps</code> (Información del área de intercambio activa).</li>
              </ul>
            </li>
            <li>
              <strong className="text-white">Herramientas adicionales:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><code className="text-[#58a6ff]">htop / nmon / monit</code> (Herramientas avanzadas e interactivas de monitorización de recursos).</li>
                <li><code className="text-[#58a6ff]">valgrind</code> (Herramienta para detectar fugas de memoria, memory leaks, en binarios C/C++).</li>
              </ul>
            </li>
          </ol>
        </section>



        <TopicQuiz topicId="tema-5" title="Test - Administración de memoria" questions={TEMA5_QUIZ} />
        <ReadMarker topicId="tema-5" />
      </article>
    </div>
  );
}
