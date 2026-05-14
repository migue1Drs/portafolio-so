import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ProcessStateDiagram } from "@/components/ui/ProcessStateDiagram";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { ThreadSyncDiagram } from "@/components/ui/ThreadSyncDiagram";
import { TEMA2_QUIZ } from "@/lib/quiz-data";

export default function Tema2Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 2"
        title="Procesos e Hilos"
        description="Conceptos de procesos e hilos, características y mecanismos de administración como fork(), wait() e identificación de procesos en sistemas UNIX/Linux."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* Intro */}
        <section>
          <p className="mb-4">
            Un proceso es una entidad en ejecución a la que el sistema operativo le asigna un identificador único, permitiendo así su gestión y referencia. Cada proceso es tratado como una entidad independiente y puede comunicarse con otros procesos mediante mecanismos específicos de intercomunicación. Por otra parte, un hilo es una unidad de ejecución que existe dentro de un proceso. Los hilos que pertenecen a un mismo proceso comparten el mismo espacio de memoria y recursos, aunque mantienen estados de ejecución independientes, lo que permite una ejecución concurrente más eficiente.
          </p>
          <p>
            En el presente capítulo se analizarán en detalle los conceptos de procesos e hilos, así como sus características y mecanismos de administración.
          </p>
        </section>

        {/* 2.1 */}
        <section>
          <SectionHeading id="2-1-introduccion" number="2.1" title="Introducción a procesos" />
          <p className="mb-4">
            Todos los sistemas de multiprogramación están construidos en torno al concepto de proceso. De manera simplificada, en un instante determinado un proceso puede encontrarse ejecutándose en el procesador o fuera de él a la espera de ser ejecutado. Bajo esta visión básica, un proceso puede estar en uno de dos estados: Ejecución o No ejecución.
          </p>
          <p className="mb-4">
            Para poder administrar los procesos, el sistema operativo debe identificar a cada uno de ellos y mantener información asociada. Al dividir el estado de "No ejecución", se obtiene el modelo de 5 estados:
          </p>
          
          <ProcessStateDiagram />

          <ul className="list-disc list-inside space-y-2 mb-4 mt-6 ml-2 text-sm text-[#b0b8c4]">
            <li><strong className="text-white">Nuevo:</strong> Proceso recién creado, aún no admitido.</li>
            <li><strong className="text-white">Listo:</strong> Preparado para ejecutar, esperando CPU.</li>
            <li><strong className="text-white">Ejecución:</strong> Siendo ejecutado actualmente.</li>
            <li><strong className="text-white">Bloqueado:</strong> Esperando que ocurra un evento (ej. E/S o <code className="text-[#f5a623]">sleep</code>).</li>
            <li><strong className="text-white">Terminado:</strong> Finalizó su ejecución o fue abortado.</li>
          </ul>

          <p className="mt-6 mb-4 text-[#b0b8c4]">
            En sistemas UNIX, el diagrama es más complejo, incluyendo estados como "Ejecutándose en modo kernel/usuario", "Dormido en memoria", o el estado <strong className="text-[#ff5f56]">Zombi</strong> (terminado pero conservando una entrada en la tabla para que el padre recupere su código de salida).
          </p>
        </section>

        {/* 2.2 */}
        <section>
          <SectionHeading id="2-2-control" number="2.2" title="Control de procesos" />
          <p className="mb-4">
            El sistema operativo actúa como el controlador central. La creación de un proceso implica: asignarle un identificador único, insertarlo en la lista, determinar prioridad, crear su PCB y asignarle memoria.
          </p>
          <p className="mb-4">
            En GNU/Linux, el kernel representa a cada proceso mediante un descriptor definido por <code className="text-[#58a6ff]">task_struct</code>. El campo de estado (<code className="text-[#58a6ff]">p-&gt;state</code>) puede tomar valores como:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2 font-mono text-sm">
            <li><span className="text-[#3fb950]">TASK_RUNNING</span>: ejecutándose o listo.</li>
            <li><span className="text-[#3fb950]">TASK_INTERRUPTIBLE</span>: dormido, despertable por señal.</li>
            <li><span className="text-[#3fb950]">TASK_UNINTERRUPTIBLE</span>: dormido, no despertable.</li>
            <li><span className="text-[#3fb950]">TASK_STOPPED</span>: detenido.</li>
            <li><span className="text-[#ff5f56]">EXIT_ZOMBIE</span>: terminado, padre aún no recoge el estado.</li>
          </ul>
        </section>

        {/* 2.3 */}
        <section>
          <SectionHeading id="2-3-creacion" number="2.3" title="Sistema de llamado para crear procesos" />
          <p className="mb-4">
            En los sistemas GNU/Linux, la creación de procesos se realiza principalmente a través de la llamada <code className="text-[#f5a623]">fork()</code>. El proceso hijo recibe una copia del espacio de direcciones del padre (utilizando <strong className="text-white">copy-on-write</strong>, de modo que no se duplica la memoria hasta que hay escritura).
          </p>
          
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <span className="ml-2 text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO DE LA FUNCIÓN</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/types.h&gt;</span><br />
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">fork</span>(<span className="text-[#ff7b72]">void</span>);
            </code>
          </div>

          <p className="mb-4">
            La llamada <code className="text-[#f5a623]">fork()</code> devuelve dos valores diferentes: <strong>0</strong> en el proceso hijo y el <strong>PID</strong> del hijo en el proceso padre (y -1 en caso de error).
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Creación y modificación de variables</h3>
          <CopyCodeBlock 
            filename="fork_cow.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
  int x = 0;
  pid_t pid = fork();
  
  if (pid == 0) {
    /* Código ejecutado por el proceso hijo */
    x = 5;
    printf("Hijo: PID=%ld, x=%d\\n", (long)getpid(), x);
  } else {
    /* Código ejecutado por el proceso padre */
    x = 10;
    printf("Padre: PID=%ld, x=%d\\n", (long)getpid(), x);
  }
  return EXIT_SUCCESS;
}`} 
            compileCommand="gcc fork_cow.c -o fork_cow"
            runCommand="./fork_cow"
            output={`Padre: PID=14500, x=10
Hijo: PID=14501, x=5`} 
          />
        </section>

        {/* 2.4 */}
        <section>
          <SectionHeading id="2-4-identificar" number="2.4" title="Sistema de llamado para identificar procesos" />
          <p className="mb-4">
            Todo proceso en UNIX tiene asociado un PID y un PPID (identificador del padre). Para obtener estos valores se utilizan:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">getpid</span>(<span className="text-[#ff7b72]">void</span>);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">getppid</span>(<span className="text-[#ff7b72]">void</span>);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">getpgrp</span>(<span className="text-[#ff7b72]">void</span>);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">setpgrp</span>(<span className="text-[#ff7b72]">void</span>);
              </code>
            </div>
          </div>

          <p className="mt-6 mb-4">
            Al ejecutar <code className="text-[#f5a623]">fork()</code>, el proceso hijo hereda los descriptores de archivo abiertos del padre (0: stdin, 1: stdout, 2: stderr).
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Cadena lineal de procesos (P0 → P1 → P2...)</h3>
          <CopyCodeBlock 
            filename="cadena.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
  pid_t hijo;
  int n = 5;
  for (int i = 0; i < n; i++) {
    hijo = fork();
    if (hijo > 0) {
      /* El padre deja de crear más procesos */
      break;
    }
    fprintf(stderr,"Proceso PID=%ld, PPID=%ld\\n",(long)getpid(), (long)getppid());
  }
  return EXIT_SUCCESS;
}`} 
            compileCommand="gcc cadena.c -o cadena"
            runCommand="./cadena"
            output={`Proceso PID=15001, PPID=15000
Proceso PID=15002, PPID=15001
Proceso PID=15003, PPID=15002
Proceso PID=15004, PPID=15003
Proceso PID=15005, PPID=15004`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Abanico de procesos (estrella)</h3>
          <CopyCodeBlock 
            filename="abanico.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
  pid_t hijo;
  int n = 5;
  for (int i = 0; i < n; i++) {
    hijo = fork();
    if (hijo == 0) {
      /* El hijo no crea más procesos */
      break;
    }
  }
  fprintf(stderr, "Proceso PID=%ld, PPID=%ld\\n", (long)getpid(), (long)getppid());
  return EXIT_SUCCESS;
}`} 
            compileCommand="gcc abanico.c -o abanico"
            runCommand="./abanico"
            output={`Proceso PID=15001, PPID=15000
Proceso PID=15002, PPID=15000
Proceso PID=15003, PPID=15000
Proceso PID=15004, PPID=15000
Proceso PID=15005, PPID=15000
Proceso PID=15000, PPID=12345`}
          />
        </section>

        {/* 2.5 */}
        <section>
          <SectionHeading id="2-5-wait" number="2.5" title="Sistema de llamada wait()" />
          <p className="mb-4">
            Tras la ejecución de <code className="text-[#f5a623]">fork()</code>, el padre puede esperar a que termine el hijo usando <code className="text-[#f5a623]">wait()</code> o <code className="text-[#f5a623]">waitpid()</code> para evitar procesos zombis.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <span className="ml-2 text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPOS</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/types.h&gt;</span><br />
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/wait.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">wait</span>(<span className="text-[#ff7b72]">int</span> *<span className="text-[#a5d6ff]">stat_loc</span>);<br />
              <span className="text-[#ff7b72]">pid_t</span> <span className="text-[#d2a8ff]">waitpid</span>(<span className="text-[#ff7b72]">pid_t</span> <span className="text-[#a5d6ff]">pid</span>, <span className="text-[#ff7b72]">int</span> *<span className="text-[#a5d6ff]">wstatus</span>, <span className="text-[#ff7b72]">int</span> <span className="text-[#a5d6ff]">options</span>);
            </code>
          </div>

          <p className="mb-4">
            El parámetro <code className="text-[#58a6ff]">stat_loc</code> se analiza con macros como <code className="text-[#3fb950]">WIFEXITED</code> (terminó normalmente), <code className="text-[#3fb950]">WEXITSTATUS</code> (código de salida) o <code className="text-[#3fb950]">WIFSIGNALED</code>.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Uso de wait()</h3>
          <CopyCodeBlock 
            filename="wait_ejemplo.c" 
            language="C" 
            code={`#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
  pid_t hijo;
  int estado;
  
  if ((hijo = fork()) == -1) {
    perror("fallo el fork");
    exit(EXIT_FAILURE);
  } else if (hijo == 0) {
    fprintf(stderr, "soy el hijo con pid = %ld \\n", (long) getpid());
  } else if (wait(&estado) != hijo) {
    fprintf(stderr, "una señal debio interrumpir la espera \\n");
  } else {
    fprintf(stderr, "soy el padre con pid = %ld e hijo con pid = %ld\\n",
      (long)getpid(), (long)hijo);
  }
  exit(EXIT_SUCCESS);
}`} 
            compileCommand="gcc wait_ejemplo.c -o wait_ejemplo"
            runCommand="./wait_ejemplo"
            output={`soy el hijo con pid = 15001 
soy el padre con pid = 15000 e hijo con pid = 15001`}
          />
        </section>

        {/* 2.5.1 */}
        <section>
          <SectionHeading id="2-5-1-waitpid" number="2.5.1" title="Uso de waitpid()" />
          <p className="mb-4">
            Permite un control más fino. El parámetro <code className="text-[#58a6ff]">pid</code> puede ser <code className="text-[#f5a623]">-1</code> (cualquier hijo) o el PID exacto. Soporta banderas como:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-2 font-mono text-sm text-[#b0b8c4]">
            <li><span className="text-[#3fb950]">WNOHANG</span>: Retorna inmediatamente si ningún hijo ha terminado (no bloquea).</li>
            <li><span className="text-[#3fb950]">WUNTRACED</span>: Retorna si un hijo se ha detenido.</li>
          </ul>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Uso de waitpid() para esperar a varios hijos</h3>
          <CopyCodeBlock 
            filename="waitpid_ejemplo.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(int argc, char*argv[]) {
  pid_t hijo[5];
  int estado, i, j;
  long factorial = 1;

  for (j = 0; j < argc - 1; j++) {
    if ((hijo[j] = fork()) == -1) {
      perror("fallo el fork");
      exit(EXIT_FAILURE);
    } else if (hijo[j] == 0) {
      fprintf(stdout, "soy el hijo con pid = %ld \\n", (long) getpid());
      for (i = atol(argv[j+1]); i > 0; i--) factorial = factorial * i;
      fprintf(stdout, "El factorial de %s es: %ld\\n", argv[j+1], factorial);
      sleep(2);
      exit(EXIT_SUCCESS);
    }
  } //fin for

  for (j = 0; j < argc - 1; j++) {
    if ((waitpid(-1, &estado, 0) == -1)) {
      fprintf(stderr, "una señal debio interrumpir la espera \\n");
    } else {
      fprintf(stdout, "el hijo:%d con pid %ld termino\\n", j, (long)hijo[j]);
    }
  }
  exit(EXIT_SUCCESS);
}`} 
            compileCommand="gcc waitpid_ejemplo.c -o waitpid_ejemplo"
            runCommand="./waitpid_ejemplo 5 3"
            output={`soy el hijo con pid = 15001 
El factorial de 5 es: 120
soy el hijo con pid = 15002 
El factorial de 3 es: 6
el hijo:0 con pid 15001 termino
el hijo:1 con pid 15002 termino`}
          />
        </section>

        {/* 2.6 */}
        <section>
          <SectionHeading id="2-6-exit" number="2.6" title="Sistema de llamada _exit() y exit()" />
          <p className="mb-4">
            Para que un proceso termine de forma normal, invoca <code className="text-[#f5a623]">exit()</code> o <code className="text-[#f5a623]">_exit()</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">_exit</span>(<span className="text-[#ff7b72]">int</span> <span className="text-[#a5d6ff]">status</span>);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;stdlib.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">exit</span>(<span className="text-[#ff7b72]">int</span> <span className="text-[#a5d6ff]">status</span>);
              </code>
            </div>
          </div>

          <p className="mt-4">
            <code className="text-[#f5a623]">exit()</code> realiza limpieza de buffers y recursos antes de llamar al sistema <code className="text-[#f5a623]">_exit()</code>. El valor de retorno (0 por convención para éxito) está disponible para el padre a través de <code className="text-[#f5a623]">wait()</code>.
          </p>
        </section>

        {/* 2.7 */}
        <section>
          <SectionHeading id="2-7-zombi" number="2.7" title="Estado Zombi" />
          <p className="mb-4">
            Un proceso zombi es un proceso que ya terminó su ejecución, pero su proceso padre no ha recogido su estado de salida mediante <code className="text-[#f5a623]">wait()</code> o <code className="text-[#f5a623]">waitpid()</code>. No consume CPU ni memoria, pero ocupa una entrada en la tabla de procesos.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Caso 1: Proceso zombi sin wait()</h3>
          <CopyCodeBlock 
            filename="zombi.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h> 

int main(void) {
  pid_t pid;
  pid = fork();
  if (pid == 0) { /* Proceso hijo */
    printf("Hijo terminado. PID=%ld\\n", (long)getpid());
    exit(EXIT_SUCCESS);
  } else { /* Proceso padre */
    printf("Padre en ejecución. PID=%ld\\n",(long)getpid());
    sleep(30); /* El padre NO llama a wait() */
  }
  return EXIT_SUCCESS;
}`} 
            compileCommand="gcc zombi.c -o zombi"
            runCommand="./zombi & sleep 1; ps -el | grep Z"
            output={`Padre en ejecución. PID=15000
Hijo terminado. PID=15001
1 Z  1000 15001 15000  0  80   0 -     0 -      ?        00:00:00 zombi <defunct>`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Caso 2: Proceso no zombi usando wait()</h3>
          <CopyCodeBlock 
            filename="no_zombi.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
  pid_t pid;
  int status;
  pid = fork();
  
  if (pid == 0) { /* Proceso hijo */
    printf("Hijo terminado. PID=%ld\\n", (long)getpid());
    exit(EXIT_SUCCESS);
  } else { /* Proceso padre */
    wait(&status); /* Recolecta al hijo */
    printf("Padre: hijo recolectado\\n");
  }
  return EXIT_SUCCESS;
}`} 
            compileCommand="gcc no_zombi.c -o no_zombi"
            runCommand="./no_zombi & sleep 1; ps -el | grep Z"
            output={`Hijo terminado. PID=15001
Padre: hijo recolectado`}
          />
        </section>

        {/* 2.8 */}
        <section>
          <SectionHeading id="2-8-exec" number="2.8" title="Sistema de llamada exec" />
          <p className="mb-4">
            La familia <code className="text-[#f5a623]">exec()</code> reemplaza la imagen del proceso actual por un nuevo programa. El PID permanece igual, pero el código, datos, heap y stack son reemplazados. Si tiene éxito, nunca regresa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">FAMILIA execl</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">execl</span>(<span className="text-[#ff7b72]">const char</span> *path, ...);<br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">execle</span>(<span className="text-[#ff7b72]">const char</span> *path, ...);<br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">execlp</span>(<span className="text-[#ff7b72]">const char</span> *file, ...);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">FAMILIA execv</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">execv</span>(<span className="text-[#ff7b72]">const char</span> *path, <span className="text-[#ff7b72]">const char</span> *argv[]);<br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">execvp</span>(<span className="text-[#ff7b72]">const char</span> *file, <span className="text-[#ff7b72]">const char</span> *argv[]);<br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">execve</span>(...);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Creación de proceso para ejecutar ls -l</h3>
          <CopyCodeBlock 
            filename="exec_ejemplo.c" 
            language="C" 
            code={`#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
  pid_t hijo;
  int estado;
  
  if ((hijo = fork()) == -1) {
    perror("Error al ejecutar fork");
    exit(EXIT_FAILURE);
  } else if (hijo == 0) {
    if (execl("/bin/ls", "ls", "-l", NULL) < 0) {
      perror("Falla en la ejecución de ls");
      exit(EXIT_FAILURE);
    }
  } else if (hijo != wait(&estado)) {
    perror("Se presentó una señal antes de la terminación del hijo");
  }
  
  exit(EXIT_SUCCESS);
}`} 
            compileCommand="gcc exec_ejemplo.c -o exec_ejemplo"
            runCommand="./exec_ejemplo"
            output={`total 24
-rwxr-xr-x 1 user user 16120 May 13 22:00 exec_ejemplo
-rw-r--r-- 1 user user   387 May 13 22:00 exec_ejemplo.c`}
          />
        </section>

        {/* 2.9 */}
        <section>
          <SectionHeading id="2-9-hilos" number="2.9" title="Hilos" />
          <p className="mb-4">
            Los hilos (threads) representan un mecanismo de ejecución concurrente dentro de un mismo proceso. A diferencia de los procesos que tienen memoria independiente, los hilos <strong className="text-white">comparten totalmente la memoria</strong> (mismo espacio de direcciones, archivos abiertos y recursos).
          </p>
          <p className="mb-4">
            El modelo 1:1 en GNU/Linux asigna una entidad del kernel a cada hilo de usuario. Para utilizar hilos se emplea la librería <code className="text-[#58a6ff]">pthreads</code> (POSIX Threads) y se compila con la bandera <code className="text-[#f5a623]">-lpthread</code>.
          </p>
          
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden my-6">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#161b22] border-b border-[#30363d]">
                <tr>
                  <th className="p-3 text-[#58a6ff] font-bold">Descripción</th>
                  <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">POSIX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                <tr>
                  <td className="p-3 text-[#e6edf3]">Administración de hilos</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">pthread_create, pthread_exit, pthread_join, pthread_self</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#e6edf3]">Exclusión mutua</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">pthread_mutex_init, pthread_mutex_lock, pthread_mutex_unlock</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#e6edf3]">Variables de condición</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">pthread_cond_init, pthread_cond_wait, pthread_cond_signal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 2.9.1 */}
        <section>
          <SectionHeading id="2-9-1-creacion-hilos" number="2.9.1" title="Creación y sincronización de hilos" />
          <p className="mb-4">
            La función <code className="text-[#f5a623]">pthread_create()</code> crea un hilo y ejecuta la subrutina especificada. <code className="text-[#f5a623]">pthread_join()</code> suspende la ejecución hasta que el hilo termina, similar a <code className="text-[#f5a623]">wait()</code> en los procesos.
          </p>

          <ThreadSyncDiagram />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">CREAR HILO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">pthread_create</span>(<span className="text-[#ff7b72]">pthread_t</span> *thread,<br/>
                &nbsp;&nbsp;<span className="text-[#ff7b72]">const pthread_attr_t</span> *attr,<br/>
                &nbsp;&nbsp;<span className="text-[#ff7b72]">void</span>* (*start_routine)(<span className="text-[#ff7b72]">void</span> *),<br/>
                &nbsp;&nbsp;<span className="text-[#ff7b72]">void</span> *arg);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">ESPERAR HILO</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">pthread_join</span>(<span className="text-[#ff7b72]">pthread_t</span> thread,<br/>
                &nbsp;&nbsp;<span className="text-[#ff7b72]">void</span> **value_ptr);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Creación de un hilo para calcular un factorial</h3>
          <CopyCodeBlock 
            filename="hilos.c" 
            language="C" 
            code={`#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

long prod=1;
void *factorial (void *valor);

int main (int argc, char *argv[]) {
  pthread_t tid;
  pthread_attr_t attr;
  
  if (argc != 2) {
    fprintf(stderr, "Uso: ./hilos <entero>\\n");
    return EXIT_FAILURE;
  }
  
  pthread_attr_init(&attr);
  pthread_create(&tid, &attr, factorial, argv[1]);
  pthread_join(tid, NULL);
  
  printf("Factorial: %ld\\n", prod);
  return EXIT_SUCCESS;
}

void *factorial (void *valor) {
  int i=1;
  while (i <= atol(valor)) prod *= (i++);
  pthread_exit(0);
}`} 
            compileCommand="gcc -Wall hilos.c -lpthread -o hilos"
            runCommand="./hilos 5"
            output={`Factorial: 120`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Creación de múltiples hilos</h3>
          <CopyCodeBlock 
            filename="chilos.c" 
            language="C" 
            code={`#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct dhilos {
  int id;
  long prod;
} DHILOS;

DHILOS pm_hilos[10];
void *factorial (void *valor);

int main (int argc, char *argv[]) {
  pthread_t tid[argc-1];
  pthread_attr_t attr;
  int i;
  
  if (argc < 2) {
    perror("Uso: ./chilos <entero1> <entero2> ... \\n");
    exit(EXIT_FAILURE);
  }
  
  for (i=0; i<argc-1; i++) {
    pthread_attr_init(&attr);
    pm_hilos[i].id = i+1;
    pm_hilos[i].prod = atol(argv[i+1]);
    pthread_create(&tid[i], &attr, factorial, &pm_hilos[i]);
  }
  
  for (i=0; i<argc-1; i++)
    pthread_join(tid[i], NULL);
    
  for (i=0; i<argc-1; i++)
    printf("Factorial de: %s = %ld\\n", argv[i+1], pm_hilos[i].prod);
    
  return EXIT_SUCCESS;
}

void *factorial (void *valor) {
  int i=1, prod=1;
  DHILOS *datos;
  datos = (DHILOS*)valor;
  while (i <= datos->prod)
    prod *= (i++);
  datos->prod = prod;
  pthread_exit(&(datos->prod));
}`} 
            compileCommand="gcc -Wall chilos.c -lpthread -o chilos"
            runCommand="./chilos 3 4 5"
            output={`Factorial de: 3 = 6
Factorial de: 4 = 24
Factorial de: 5 = 120`}
          />
        </section>

        {/* Ejercicios */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 my-8">
          <h3 className="text-[#58a6ff] font-bold text-lg mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            Ejercicios Propuestos
          </h3>
          <ol className="list-decimal list-inside space-y-4 text-sm">
            <li>
              <strong className="text-white">Investigue los procesos activos en su sistema.</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><strong className="text-[#c9d1d9]">a)</strong> ¿Qué instrucción le permite visualizarlos? (<code className="text-[#58a6ff]">ps</code>, <code className="text-[#58a6ff]">htop</code>)</li>
                <li><strong className="text-[#c9d1d9]">b)</strong> ¿Qué parámetros son utilizados con dicha instrucción? (ej. <code className="text-[#58a6ff]">-aux</code>, <code className="text-[#58a6ff]">-el</code>)</li>
              </ul>
            </li>
            <li>
              <strong className="text-white">En el sistema GNU/Linux, investigue el uso del comando ps, y del comando top.</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><strong className="text-[#c9d1d9]">a)</strong> ¿Cuál es la diferencia entre ellos? (<code className="text-[#58a6ff]">ps</code> es una instantánea estática, <code className="text-[#58a6ff]">top</code> es un monitor en tiempo real).</li>
                <li><strong className="text-[#c9d1d9]">b)</strong> ¿Cuál es el proceso 1? (<code className="text-[#58a6ff]">systemd</code> o <code className="text-[#58a6ff]">init</code>).</li>
                <li><strong className="text-[#c9d1d9]">c)</strong> ¿Quién es el padre del proceso 1? (El núcleo/kernel mismo, PID 0).</li>
              </ul>
            </li>
          </ol>
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Aprendí la importancia de la sincronización y el ciclo de vida de los procesos. Comprendí cómo <code className="text-[#f5a623]">fork()</code> duplica el espacio de memoria y cómo procesos huérfanos pueden convertirse en zombis si el padre no realiza un <code className="text-[#f5a623]">wait()</code>. Además, observé que los hilos permiten paralelismo de forma mucho más ligera compartiendo memoria (pthread).
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorarla?</strong> Podría mejorar escribiendo un programa concurrente más complejo que combine la creación de múltiples hilos manejando recursos y comparando su tiempo de ejecución con procesos independientes usando la familia de comandos <code className="text-[#f5a623]">exec()</code>.
          </p>
        </ReflectionBox>

        <TopicQuiz topicId="tema-2" title="Test - Procesos e Hilos" questions={TEMA2_QUIZ} />
        <ReadMarker topicId="tema-2" />
      </article>
    </div>
  );
}
