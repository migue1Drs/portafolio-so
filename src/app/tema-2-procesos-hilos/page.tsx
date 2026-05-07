import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { InteractiveTerminal } from "@/components/ui/InteractiveTerminal";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ForkTreeVisualization } from "@/components/ui/ForkTreeVisualization";
import { ProcessStateDiagram } from "@/components/ui/ProcessStateDiagram";

export default function Tema2Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 2"
        title="Procesos e Hilos"
        description="Gestión de procesos en Linux: creación con fork(), sincronización con wait()/waitpid(), estados zombie, la familia exec y programación de hilos POSIX (pthreads)."
      />

      <article className="space-y-6 text-[#b0b8c4] leading-relaxed">

        <SectionHeading id="2-1-introduccion" number="2.1" title="Introducción a procesos" />
        <p>
          Un <strong className="text-white">proceso</strong> es un programa en ejecución. Cada proceso posee su propio
          espacio de direcciones, registros y un identificador único (<strong className="text-white">PID</strong>).
          Linux maneja procesos con un modelo de 5 estados: <em>Nuevo, Listo, Ejecución, Bloqueado y Terminado</em>.
          El primer proceso es <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">init</code> (PID 1),
          del cual descienden todos los demás formando un árbol jerárquico.
        </p>

        <ProcessStateDiagram />

        <InteractiveTerminal
          command="ps aux | head -8"
          output={`USER       PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root         1  0.0  0.1 169512 13300 ?     Ss   08:00   0:02 /sbin/init
root         2  0.0  0.0      0     0 ?     S    08:00   0:00 [kthreadd]
migue1    1284  0.1  0.5 412800 42300 ?     Sl   08:01   0:15 /usr/bin/bash
migue1    2045  0.0  0.0  10584  3400 pts/1 R+   12:00   0:00 ps aux`}
          title="bash — listado de procesos"
        />

        {/* 2.2 fork() — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="2-2-fork" number="2.2" title="Sistema de llamado para crear procesos — fork()" />
        <p>
          La llamada <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">fork()</code> crea una
          <strong className="text-white"> copia del proceso</strong> actual. Retorna <code className="text-[#f5a623]">0</code> en
          el hijo, el PID del hijo en el padre, y <code className="text-[#f5a623]">-1</code> en caso de error.
        </p>
        <CopyCodeBlock filename="fork_basico.c" language="C" code={`#include <sys/types.h>
#include <stdlib.h>
#include <unistd.h>
int main(void) {
    int x = 0;
    fork();
    x = 1;
    return EXIT_SUCCESS;
}`} />

        <ForkTreeVisualization />
        <InteractiveTerminal
          command="gcc -o fork_basico fork_basico.c && ./fork_basico"
          output={`(El programa se ejecuta sin salida visible, pero internamente
se crean dos procesos: padre e hijo, ambos asignan x = 1.
Se puede verificar con strace o con un printf adicional.)`}
          title="bash — fork() básico"
        />
        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> La llamada <code className="text-[#f5a623]">fork()</code> duplica
            el proceso completo en el punto exacto de la invocación. Ambos procesos continúan desde la misma línea
            pero con valores de retorno distintos. Aunque este ejemplo no imprime nada, internamente se generan
            dos procesos independientes que ejecutan <code className="text-[#f5a623]">x = 1</code>.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Agregar <code className="text-[#f5a623]">printf()</code> para
            visualizar los PIDs de padre e hijo y verificar la bifurcación. También experimentar con múltiples
            llamadas a fork() para ver el crecimiento exponencial de procesos.
          </p>
        </ReflectionBox>

        {/* 2.4 Identificar procesos */}
        <SectionHeading id="2-4-identificar" number="2.4" title="Sistema de llamado para identificar procesos" />
        <p>
          Linux provee <code className="text-[#f5a623]">getpid()</code> para el PID actual,
          <code className="text-[#f5a623]"> getppid()</code> para el PID del padre,
          <code className="text-[#f5a623]"> getuid()</code> y <code className="text-[#f5a623]">getgid()</code> para
          usuario y grupo.
        </p>
        <CopyCodeBlock filename="identify.c" language="C" code={`#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
int main() {
    printf("=== Identificación del Proceso ===\\n");
    printf("PID  (Process ID):  %d\\n", getpid());
    printf("PPID (Parent PID):  %d\\n", getppid());
    printf("UID  (User ID):     %d\\n", getuid());
    printf("GID  (Group ID):    %d\\n", getgid());
    return 0;
}`} />
        <InteractiveTerminal command="gcc -o identify identify.c && ./identify"
          output={`=== Identificación del Proceso ===
PID  (Process ID):  13201
PPID (Parent PID):  12980
UID  (User ID):     1000
GID  (Group ID):    1000`}
          title="bash — identificación de proceso" />

        {/* 2.5 wait() — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="2-5-wait" number="2.5" title="Sistema de llamada wait()" />
        <p>
          La llamada <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">wait()</code> permite
          al padre <strong className="text-white">esperar a que un hijo termine</strong>. Sin ella, pueden generarse
          procesos huérfanos o zombies.
        </p>
        <CopyCodeBlock filename="wait_ejemplo.c" language="C" code={`#include <sys/types.h>
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
}`} />
        <LinuxTerminal command="gcc -o wait_ej wait_ejemplo.c && ./wait_ej"
          output={`soy el hijo con pid = 14501 
soy el padre con pid = 14500 e hijo con pid = 14501`}
          title="bash — ejemplo de wait()" />

        {/* 2.5.1 waitpid() — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="2-5-1-waitpid" number="2.5.1" title="Uso de waitpid()" />
        <p>
          <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">waitpid()</code> ofrece mayor
          control: permite esperar un hijo específico o usar <code className="text-[#f5a623]">WNOHANG</code> para
          verificar sin bloquear. Este ejemplo calcula factoriales en procesos hijos.
        </p>
        <CopyCodeBlock filename="waitpid_factorial.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
int main(int argc, char *argv[]) {
    pid_t hijo[5];
    int estado, i, j;
    long factorial = 1;
    for (j = 0; j < argc - 1; j++) {
        if ((hijo[j] = fork()) == -1) {
            perror("fallo el fork");
            exit(1);
        } else if (hijo[j] == 0) {
            fprintf(stdout, "soy el hijo con pid = %ld \\n", (long) getpid());
            for (i = atol(argv[j+1]); i > 0; i--)
                factorial = factorial * i;
            fprintf(stdout, "El factorial es:%ld\\n", factorial);
            sleep(2);
            exit(EXIT_SUCCESS);
        }
    }
    for (j = 0; j < argc - 1; j++) {
        if ((waitpid(-1, &estado, 0) == -1))
            fprintf(stderr, "una señal debio interrumpir la espera \\n");
        else
            fprintf(stdout, "el hijo:%d con pid %ld termino\\n", j, (long)hijo[j]);
    }
    exit(EXIT_SUCCESS);
}`} />
        <InteractiveTerminal command="gcc -o waitpid_fact waitpid_factorial.c && ./waitpid_fact 5 3 4"
          output={`soy el hijo con pid = 15001 
El factorial es:120
soy el hijo con pid = 15002 
El factorial es:6
soy el hijo con pid = 15003 
El factorial es:24
el hijo:0 con pid 15001 termino
el hijo:1 con pid 15002 termino
el hijo:2 con pid 15003 termino`}
          title="bash — waitpid con factoriales" />
        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Con <code className="text-[#f5a623]">waitpid(-1, ...)</code> el
            padre espera a cualquier hijo. Este ejemplo muestra la creación de múltiples hijos que trabajan en
            paralelo calculando factoriales. El padre espera a todos con un segundo ciclo <code className="text-[#f5a623]">for</code>.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Verificar el <code className="text-[#f5a623]">WEXITSTATUS</code> para
            obtener el código de salida de cada hijo y manejar desbordamientos en factoriales grandes.
          </p>
        </ReflectionBox>

        {/* 2.6 exit / _exit */}
        <SectionHeading id="2-6-exit" number="2.6" title="Sistema de llamada _exit() y exit()" />
        <p>
          <code className="text-[#f5a623]">exit()</code> limpia buffers y ejecuta handlers de <code className="text-[#f5a623]">atexit()</code>.
          <code className="text-[#f5a623]"> _exit()</code> termina inmediatamente sin limpieza — preferible en procesos hijo
          para evitar flush duplicado de buffers.
        </p>
        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm overflow-hidden my-6">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#333333] bg-[#252525]">
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Función</th>
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Comportamiento</th>
            </tr></thead>
            <tbody>
              <tr className="border-b border-[#333333]"><td className="p-4 font-mono text-white">exit()</td><td className="p-4 text-[#a0a0a0]">Limpia buffers, ejecuta atexit(), cierra streams, llama a _exit()</td></tr>
              <tr><td className="p-4 font-mono text-white">_exit()</td><td className="p-4 text-[#a0a0a0]">Termina inmediatamente. Llamada directa al kernel, sin limpieza.</td></tr>
            </tbody>
          </table>
        </div>

        {/* 2.7 Estado Zombi — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="2-7-zombi" number="2.7" title="Estado Zombi" />
        <p>
          Un <strong className="text-white">proceso zombie</strong> ocurre cuando el hijo termina pero el padre
          <strong className="text-white"> NO llama a wait()</strong>. El kernel mantiene su entrada en la tabla de
          procesos hasta que el padre recoja el estado.
        </p>
        <CopyCodeBlock filename="zombie.c" language="C" code={`#include <stdio.h>
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
        printf("Padre en ejecución. PID=%ld\\n", (long)getpid());
        sleep(30); /* El padre NO llama a wait(), generando un Zombi */
    }
    return EXIT_SUCCESS;
}`} />
        <LinuxTerminal command="gcc -o zombie zombie.c && ./zombie &"
          output={`[1] 16800
Padre en ejecución. PID=16800
Hijo terminado. PID=16801`}
          title="bash — creando un zombie" />
        <LinuxTerminal command="ps aux | grep -E 'Z|zombie'"
          output={`migue1  16801  0.0  0.0      0     0 pts/1  Z+   12:10   0:00 [zombie] <defunct>`}
          title="bash — verificando zombie con ps" />

        {/* 2.8 exec — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="2-8-exec" number="2.8" title="Sistema de llamada exec (Familia execl)" />
        <p>
          La familia <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">exec</code> reemplaza
          la imagen del proceso actual con un nuevo programa. A diferencia de <code className="text-[#f5a623]">fork()</code>,
          <strong className="text-white"> no crea un nuevo proceso</strong>: reemplaza el código, datos y stack del proceso actual.
        </p>
        <CopyCodeBlock filename="exec_ejemplo.c" language="C" code={`#include <sys/types.h>
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
        if (execl("/usr/bin/ls", "ls", "-l", NULL) < 0) {
            perror("Falla en la ejecución de ls");
            exit(EXIT_FAILURE);
        }
    } else if (hijo != wait(&estado)) {
        perror("Se presentó una señal antes de la terminación del hijo");
    }
    exit(EXIT_SUCCESS);
}`} />
        <LinuxTerminal command="gcc -o exec_ej exec_ejemplo.c && ./exec_ej"
          output={`total 48
-rwxr-xr-x 1 migue1drs migue1drs 16696 mayo  7 12:00 exec_ej
-rw-r--r-- 1 migue1drs migue1drs   452 mayo  7 12:00 exec_ejemplo.c
-rw-r--r-- 1 migue1drs migue1drs   312 mayo  7 12:00 fork_basico.c
-rwxr-xr-x 1 migue1drs migue1drs 16800 mayo  7 12:00 zombie`}
          title="bash — execl reemplaza proceso hijo con ls -l" />
        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> La combinación <code className="text-[#f5a623]">fork() + exec()</code> es
            el patrón fundamental de Unix: el padre crea un hijo con <code className="text-[#f5a623]">fork()</code> y el hijo
            reemplaza su imagen con <code className="text-[#f5a623]">execl()</code> para ejecutar otro programa. Así es como
            la shell ejecuta comandos. Si exec tiene éxito, el código después de exec nunca se ejecuta.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Probar otras variantes como <code className="text-[#f5a623]">execvp()</code>,
            <code className="text-[#f5a623]"> execlp()</code> y <code className="text-[#f5a623]">execve()</code> que permiten pasar
            variables de entorno y buscar en el PATH del sistema.
          </p>
        </ReflectionBox>

        {/* 2.9 Hilos */}
        <SectionHeading id="2-9-hilos" number="2.9" title="Hilos (pthreads)" />
        <p>
          Los <strong className="text-white">hilos</strong> son unidades de ejecución ligeras que comparten el espacio
          de direcciones del proceso. En Linux se crean con la biblioteca <strong className="text-white">POSIX Threads</strong> (pthreads).
        </p>
        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm overflow-hidden my-6">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#333333] bg-[#252525]">
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Característica</th>
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Proceso</th>
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Hilo</th>
            </tr></thead>
            <tbody>
              <tr className="border-b border-[#333333]"><td className="p-4 text-white">Memoria</td><td className="p-4 text-[#a0a0a0]">Espacio propio</td><td className="p-4 text-[#a0a0a0]">Compartida</td></tr>
              <tr className="border-b border-[#333333]"><td className="p-4 text-white">Creación</td><td className="p-4 text-[#a0a0a0]">fork() — costoso</td><td className="p-4 text-[#a0a0a0]">pthread_create() — ligero</td></tr>
              <tr><td className="p-4 text-white">Comunicación</td><td className="p-4 text-[#a0a0a0]">IPC (pipes, shmem)</td><td className="p-4 text-[#a0a0a0]">Variables compartidas</td></tr>
            </tbody>
          </table>
        </div>

        <SectionHeading id="2-9-2-creacion-hilos" number="2.9.2" title="Creación de hilos" />
        <CopyCodeBlock filename="hilos_ejemplo.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

void *tarea_hilo(void *arg) {
    int id = *(int *)arg;
    printf("Hilo %d (TID: %lu): Iniciando tarea...\\n",
           id, pthread_self());
    sleep(1);
    printf("Hilo %d (TID: %lu): Tarea completada\\n",
           id, pthread_self());
    return NULL;
}

int main() {
    pthread_t hilos[3];
    int ids[3];

    printf("Proceso principal (PID: %d)\\n", getpid());
    for (int i = 0; i < 3; i++) {
        ids[i] = i + 1;
        if (pthread_create(&hilos[i], NULL, tarea_hilo, &ids[i]) != 0) {
            perror("Error al crear hilo");
            exit(1);
        }
    }
    for (int i = 0; i < 3; i++) {
        pthread_join(hilos[i], NULL);
        printf("Main: Hilo %d ha terminado\\n", i + 1);
    }
    printf("Todos los hilos completados.\\n");
    return 0;
}`} />
        <InteractiveTerminal command="gcc -pthread -o hilos hilos_ejemplo.c && ./hilos"
          output={`Proceso principal (PID: 17800)
Hilo 1 (TID: 140234567890432): Iniciando tarea...
Hilo 2 (TID: 140234559497728): Iniciando tarea...
Hilo 3 (TID: 140234551105024): Iniciando tarea...
Hilo 1 (TID: 140234567890432): Tarea completada
Main: Hilo 1 ha terminado
Hilo 2 (TID: 140234559497728): Tarea completada
Main: Hilo 2 ha terminado
Hilo 3 (TID: 140234551105024): Tarea completada
Main: Hilo 3 ha terminado
Todos los hilos completados.`}
          title="bash — creación de hilos POSIX" />
        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Los hilos POSIX comparten memoria, lo cual es
            eficiente pero requiere cuidado con las condiciones de carrera. Es fundamental usar
            <code className="text-[#f5a623]"> pthread_join()</code> y compilar con <code className="text-[#f5a623]">-pthread</code>.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Implementar sincronización con
            <code className="text-[#f5a623]"> pthread_mutex_lock()</code> para proteger secciones críticas y explorar
            variables de condición.
          </p>
        </ReflectionBox>

      </article>
    </div>
  );
}
