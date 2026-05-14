import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA5_QUIZ } from "@/lib/quiz-data";

export default function Tema5Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 5"
        title="Administración de Memoria"
        description="Gestión de la memoria principal, modelos de multiprogramación, memoria virtual y herramientas de diagnóstico en sistemas Linux."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* 5.1 */}
        <section>
          <SectionHeading id="5-1-introduccion" number="5.1" title="Introducción" />
          <p className="mb-4">
            Una de las tareas más importantes y complejas de un sistema operativo es la administración de memoria. Esto implica tratar la memoria principal como un recurso para asignarlo y compartirlo entre varios procesos activos, manteniendo en ella la mayor cantidad posible.
          </p>
          <p className="mb-4">
            Las herramientas básicas son la <strong className="text-white">paginación</strong> (división en páginas de tamaño constante) y la <strong className="text-white">segmentación</strong> (partes de tamaño variable).
          </p>
          <p className="mb-6">
            En la mayoría de las arquitecturas x86-64, el tamaño de página predeterminado es de <strong className="text-[#f5a623]">4KB (4096 bytes)</strong>. Puedes verificar esto en tu terminal con:
          </p>
          
          <div className="bg-[#090c10] border border-[#30363d] p-4 rounded-xl font-mono text-sm text-[#8b949e] mb-8">
            <span className="text-[#3fb950]">$</span> getconf PAGESIZE
            <br />
            4096
          </div>

          <h3 className="text-white font-bold mb-4 italic">Ejemplo: Obtener tamaño de página en C</h3>
          <CopyCodeBlock 
            filename="get_pagesize.c" 
            language="C" 
            code={`#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

int main()
{
 printf("Tamaño de página (sysconf): %d bytes\\n", (int)sysconf(_SC_PAGESIZE));
 printf("Tamaño de página (getpagesize): %d bytes\\n", (int)getpagesize());
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc get_pagesize.c -o pagesize"
            runCommand="./pagesize"
            output={`Tamaño de página (sysconf): 4096 bytes
Tamaño de página (getpagesize): 4096 bytes`}
          />
        </section>

        {/* 5.3 */}
        <section>
          <SectionHeading id="5-3-modelos" number="5.3" title="Modelos de multiprogramación" />
          <p className="mb-4">
            El uso de la CPU se puede mejorar mediante la multiprogramación. Un modelo probabilístico útil para analizar esto considera que un proceso ocupa una fracción <code className="text-[#f5a623]">p</code> de su tiempo esperando E/S. Si hay <code className="text-[#f5a623]">n</code> procesos en memoria, la utilización de la CPU es:
          </p>
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl text-center my-6">
            <code className="text-2xl text-white font-serif">Utilización CPU = 1 − p<sup>n</sup></code>
          </div>
        </section>

        {/* 5.5 */}
        <section>
          <SectionHeading id="5-5-reasignacion" number="5.5" title="Reasignación y Protección" />
          <p className="mb-4">
            La multiprogramación presenta dos problemas esenciales:
          </p>
          <ul className="list-disc list-inside space-y-4 mb-6 ml-2">
            <li>
              <strong className="text-white">Reasignación:</strong> El cargador debe ajustar las direcciones de salto dependiendo de en qué partición de memoria se cargue el programa.
            </li>
            <li>
              <strong className="text-white">Protección:</strong> Evitar que un proceso acceda o modifique la memoria de otro proceso o del sistema operativo.
            </li>
          </ul>
          <p>
            Hardware como los <strong className="text-[#58a6ff]">registros base y límite</strong> resuelven esto sumando el valor base a cada dirección generada y verificando que no exceda el límite establecido.
          </p>
        </section>

        {/* 5.6 */}
        <section>
          <SectionHeading id="5-6-intercambio" number="5.6" title="Intercambio (Swap)" />
          <p className="mb-4">
            Cuando hay más procesos de los que la RAM puede albergar, el sistema mueve los procesos inactivos al disco. Esto se conoce como <strong className="text-white">intercambio</strong> o <strong className="text-white">swap</strong>.
          </p>
          <div className="bg-[#090c10] border border-[#30363d] p-4 rounded-xl font-mono text-xs text-[#8b949e] mb-6">
            <span className="text-[#3fb950]">$</span> swapon
            <br />
            NAME      TYPE      SIZE   USED  PRIO
            /dev/dm-1 partition 976M   50M   -2
          </div>
          <p>
            En C, se pueden usar las funciones <code className="text-[#f5a623]">swapon()</code> y <code className="text-[#f5a623]">swapoff()</code> para administrar estas áreas desde el código (requiere privilegios de root).
          </p>
        </section>

        {/* 5.7 & 5.8 */}
        <section>
          <SectionHeading id="5-8-registro-uso" number="5.8" title="Registro del uso de memoria" />
          <p className="mb-6">
            Existen dos formas principales de llevar el registro de qué partes de la memoria están libres u ocupadas:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-xl">
              <h4 className="text-white font-bold mb-3">Mapas de Bits</h4>
              <p className="text-sm mb-4">La memoria se divide en unidades; a cada una le corresponde un bit (0=libre, 1=ocupado). La búsqueda de huecos grandes es lenta.</p>
              <div className="flex gap-1 justify-center font-mono text-[10px]">
                {[1,1,1,0,0,1,1,0].map((v, i) => (
                  <div key={i} className={`w-6 h-6 flex items-center justify-center border ${v ? 'bg-[#ff5f5620] border-[#ff5f56] text-[#ff5f56]' : 'bg-[#23863620] border-[#238636] text-[#3fb950]'}`}>{v}</div>
                ))}
              </div>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-xl">
              <h4 className="text-white font-bold mb-3">Listas Ligadas</h4>
              <p className="text-sm mb-4">Mantiene una lista de segmentos (Proceso o Hueco) ordenada por direcciones. Permite algoritmos como:</p>
              <ul className="text-[11px] space-y-1 text-[#8b949e]">
                <li>• <strong className="text-white">Primer ajuste:</strong> El primero que sirva (rápido).</li>
                <li>• <strong className="text-white">Mejor ajuste:</strong> El más cercano al tamaño (lento).</li>
                <li>• <strong className="text-white">Peor ajuste:</strong> El hueco más grande.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5.9 */}
        <section>
          <SectionHeading id="5-9-memoria-virtual" number="5.9" title="Memoria Virtual" />
          <p className="mb-4">
            Permite que el tamaño combinado de los programas exceda la memoria física. El sistema operativo mantiene solo las partes necesarias en RAM y el resto en disco.
          </p>
          <p className="mb-6">
            La <strong className="text-white">MMU</strong> (Memory Management Unit) mapea direcciones virtuales a marcos de página físicos de forma transparente para el proceso.
          </p>
          
          <div className="bg-[#161b22] border-l-4 border-[#f5a623] p-4 rounded-r-xl">
            <h4 className="text-white font-bold mb-2">Configuración: Swappiness</h4>
            <p className="text-sm mb-2">
              Controla qué tan agresivo es el sistema para mover páginas al swap (valor 0-100). En Ubuntu el default es 60.
            </p>
            <code className="text-xs bg-black/30 p-1 rounded text-[#f5a623]">cat /proc/sys/vm/swappiness</code>
          </div>
        </section>

        {/* 5.10 */}
        <section>
          <SectionHeading id="5-10-funciones" number="5.10" title="Funciones del Sistema" />
          
          <h3 className="text-white font-bold mt-8 mb-4 italic">Estadísticas con sysinfo()</h3>
          <p className="mb-6">
            La función <code className="text-[#f5a623]">sysinfo()</code> permite obtener datos sobre el uptime, carga promedio, RAM total/libre y espacio de swap.
          </p>

          <CopyCodeBlock 
            filename="info_memoria.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/sysinfo.h>

#define KB 1024

int main ()
{
 struct sysinfo si;
 if (sysinfo(&si) == -1) {
  perror("sysinfo");
  return EXIT_FAILURE;
 }
 
 printf("Uptime: %ld segundos\\n", si.uptime);
 printf("RAM Total: %ld MB\\n", si.totalram / (KB * KB));
 printf("RAM Libre: %ld MB\\n", si.freeram / (KB * KB));
 printf("Swap Total: %ld MB\\n", si.totalswap / (KB * KB));
 printf("Procesos activos: %d\\n", si.procs);
 
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc info_memoria.c -o info_mem"
            runCommand="./info_mem"
            output={`Uptime: 15420 segundos
RAM Total: 16384 MB
RAM Libre: 4120 MB
Swap Total: 2048 MB
Procesos activos: 124`}
          />
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Comprendí que la memoria no es solo un espacio físico, sino un recurso gestionado mediante abstracciones. La diferencia entre memoria física y virtual es clave: la MMU permite que cada proceso tenga su propio "universo" de direcciones. También aprendí a monitorizar la salud de la memoria usando <code className="text-[#f5a623]">sysinfo</code> y a entender cómo el kernel decide cuándo usar el swap mediante el parámetro <code className="text-[#f5a623]">swappiness</code>.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorar?</strong> Podría experimentar cambiando el valor de swappiness en un entorno controlado para observar cómo impacta en el rendimiento de aplicaciones pesadas. También me interesaría investigar el uso de <code className="text-[#f5a623]">mmap</code> para proyectar archivos directamente en memoria, optimizando la E/S de archivos grandes.
          </p>
        </ReflectionBox>

        <TopicQuiz
          topicId="tema-5"
          title="Test — Administración de Memoria"
          questions={TEMA5_QUIZ}
        />

        <ReadMarker topicId="tema-5" />

      </article>
    </div>
  );
}
