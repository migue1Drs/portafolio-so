import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";

export default function Tema5Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 5"
        title="Administración de memoria"
        description="Cómo el sistema operativo Linux administra la memoria: paginación, tamaño de página, asignación dinámica, mapeo con mmap/munmap e información del sistema con sysinfo."
      />

      <article className="space-y-6 text-[#b0b8c4] leading-relaxed">

        {/* 5.1 Tamaño de página — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="5-1-pagina" number="5.1" title="Tamaño de página del sistema" />
        <p>
          El sistema operativo divide la memoria en <strong className="text-white">páginas</strong> de tamaño fijo.
          En Linux podemos obtener el tamaño de página usando <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">sysconf(_SC_PAGESIZE)</code> o
          <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm"> getpagesize()</code>. Este dato es fundamental para la administración
          de memoria virtual y para el uso correcto de <code className="text-[#f5a623]">mmap()</code>.
        </p>

        <CopyCodeBlock filename="pagesize.c" language="C" code={`#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
int main() {
    printf("Tamaño de página:%d \\n\\n", (int)sysconf(_SC_PAGESIZE));
    printf("Tamaño de página:%d \\n\\n", (int)getpagesize());
    return EXIT_SUCCESS;
}`} />

        <LinuxTerminal command="gcc -o pagesize pagesize.c && ./pagesize"
          output={`Tamaño de página:4096 

Tamaño de página:4096 
`}
          title="bash — tamaño de página del sistema" />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> El tamaño de página estándar en Linux es de
            4096 bytes (4 KB). La MMU (Memory Management Unit) del hardware traduce direcciones virtuales a
            físicas en unidades de páginas. Ambas funciones retornan el mismo valor, pero
            <code className="text-[#f5a623]"> sysconf()</code> es la forma POSIX estándar.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Investigar las <em>Huge Pages</em> (2 MB o 1 GB)
            que mejoran el rendimiento en aplicaciones con grandes consumos de memoria como bases de datos.
          </p>
        </ReflectionBox>

        {/* Modelo de memoria */}
        <SectionHeading id="5-2-malloc" number="5.2" title="Modelo de memoria y malloc() / free()" />
        <p>
          Cada proceso tiene un <strong className="text-white">espacio de direcciones virtuales</strong> independiente
          dividido en segmentos:
        </p>
        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm p-6 my-6">
          <div className="space-y-2 text-sm font-mono">
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-[#a0a0a0]">
              <span className="text-white font-bold">Stack</span> — Variables locales, argumentos (crece ↓)
            </div>
            <div className="text-center text-[#555]">↕ Espacio libre</div>
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-[#a0a0a0]">
              <span className="text-white font-bold">Heap</span> — malloc(), calloc(), realloc() (crece ↑)
            </div>
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-[#a0a0a0]">
              <span className="text-white font-bold">BSS</span> — Variables globales no inicializadas
            </div>
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-[#a0a0a0]">
              <span className="text-white font-bold">Data</span> — Variables globales inicializadas
            </div>
            <div className="bg-[#1a1a2e] border border-[#f5a623] rounded p-3 text-center text-[#f5a623]">
              <span className="font-bold">Text</span> — Código ejecutable (solo lectura)
            </div>
          </div>
        </div>

        <CopyCodeBlock filename="malloc_ejemplo.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
int main() {
    int *arreglo = (int *)malloc(5 * sizeof(int));
    if (arreglo == NULL) {
        perror("Error en malloc");
        return 1;
    }
    for (int i = 0; i < 5; i++)
        arreglo[i] = (i + 1) * 10;

    printf("Arreglo dinámico: ");
    for (int i = 0; i < 5; i++)
        printf("%d ", arreglo[i]);
    printf("\\nDirección base: %p\\n", (void *)arreglo);

    free(arreglo);
    printf("Memoria liberada.\\n");
    return 0;
}`} />
        <LinuxTerminal command="gcc -o malloc_ej malloc_ejemplo.c && ./malloc_ej"
          output={`Arreglo dinámico: 10 20 30 40 50 
Dirección base: 0x55a3f2c012a0
Memoria liberada.`}
          title="bash — malloc y free" />

        {/* mmap */}
        <SectionHeading id="5-3-mmap" number="5.3" title="Mapeo de memoria con mmap() / munmap()" />
        <p>
          <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">mmap()</code> mapea archivos o
          regiones anónimas en el espacio de direcciones. <code className="text-[#f5a623]">munmap()</code> libera
          el mapeo. Es más eficiente que <code className="text-[#f5a623]">malloc()</code> para grandes bloques.
        </p>
        <CopyCodeBlock filename="mmap_ejemplo.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <unistd.h>
int main() {
    size_t size = 4096;  // 1 página
    char *region = mmap(NULL, size,
                        PROT_READ | PROT_WRITE,
                        MAP_PRIVATE | MAP_ANONYMOUS,
                        -1, 0);
    if (region == MAP_FAILED) {
        perror("mmap"); exit(1);
    }
    printf("Región mapeada en: %p\\n", region);
    strcpy(region, "Datos en memoria mapeada con mmap()");
    printf("Contenido: \\"%s\\"\\n", region);
    if (munmap(region, size) == 0)
        printf("Memoria desmapeada correctamente.\\n");
    return 0;
}`} />
        <LinuxTerminal command="gcc -o mmap_ej mmap_ejemplo.c && ./mmap_ej"
          output={`Región mapeada en: 0x7f4a3c000000
Contenido: "Datos en memoria mapeada con mmap()"
Memoria desmapeada correctamente.`}
          title="bash — mmap / munmap" />

        {/* sysinfo */}
        <SectionHeading id="5-4-sysinfo" number="5.4" title="Información del sistema con sysinfo" />
        <LinuxTerminal command="cat /proc/meminfo | head -8"
          output={`MemTotal:        8052416 kB
MemFree:         1153024 kB
MemAvailable:    3981312 kB
Buffers:          310272 kB
Cached:          2817024 kB
SwapCached:       15360 kB
SwapTotal:       2097148 kB
SwapFree:        1835008 kB`}
          title="bash — /proc/meminfo" />
        <LinuxTerminal command="free -h"
          output={`               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       3.2Gi       1.1Gi       412Mi       3.4Gi       3.8Gi
Swap:          2.0Gi       256Mi       1.7Gi`}
          title="bash — free -h" />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> La administración de memoria en Linux utiliza
            memoria virtual y paginación para aislar procesos. Las funciones <code className="text-[#f5a623]">malloc()</code> operan
            sobre el heap, mientras que <code className="text-[#f5a623]">mmap()</code> crea mapeos directos más eficientes.
            El archivo <code className="text-[#f5a623]">/proc/meminfo</code> expone toda la información de memoria del kernel.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Usar <code className="text-[#f5a623]">valgrind</code> para
            detectar fugas de memoria y estudiar los algoritmos de reemplazo de páginas (LRU) del kernel.
          </p>
        </ReflectionBox>

      </article>
    </div>
  );
}
