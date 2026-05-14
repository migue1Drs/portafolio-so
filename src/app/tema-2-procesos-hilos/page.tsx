import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ProcessStateDiagram } from "@/components/ui/ProcessStateDiagram";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
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
          
          <ProcessStateDiagram />

          <p className="mt-6 mb-4 font-mono text-sm">
            Diagrama de estados en UNIX:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
            <li>Ejecutándose en modo usuario / modo kernel.</li>
            <li>Listo para ejecutarse.</li>
            <li>Dormido en memoria.</li>
            <li><strong className="text-[#ff5f56]">Zombi:</strong> proceso terminado pero con entrada en la tabla de procesos.</li>
          </ul>
        </section>

        {/* 2.2 */}
        <section>
          <SectionHeading id="2-2-creacion" number="2.2" title="Sistema de llamado para crear procesos" />
          <p className="mb-4">
            El sistema operativo actúa como el controlador central. La creación de procesos se realiza principalmente a través de <code className="text-[#f5a623]">fork()</code>. El hijo recibe una copia del espacio de direcciones del padre (Copy-on-write).
          </p>
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
    x = 5;
    printf("Hijo: PID=%ld, x=%d\\n", (long)getpid(), x);
  } else {
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
            Llamadas esenciales para identificación:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-2 font-mono text-sm">
            <li><code className="text-[#3fb950]">getpid()</code>: Retorna el PID del proceso actual.</li>
            <li><code className="text-[#3fb950]">getppid()</code>: Retorna el PID del proceso padre.</li>
          </ul>
        </section>

        {/* 2.5 */}
        <section>
          <SectionHeading id="2-5-wait" number="2.5" title="Sistema de llamada wait ()" />
          <p className="mb-4">
            Permite que un padre suspenda su ejecución hasta que uno de sus hijos termine.
          </p>
          <CopyCodeBlock 
            filename="wait_simple.c" 
            language="C" 
            code={`#include <sys/wait.h>
#include <stdio.h>
#include <unistd.h>

int main() {
  if (fork() == 0) {
    printf("Hijo trabajando...\\n");
    sleep(2);
  } else {
    wait(NULL);
    printf("Padre detectó fin del hijo.\\n");
  }
  return 0;
}`} 
            compileCommand="gcc wait_simple.c -o wait_ex"
            runCommand="./wait_ex"
            output={`Hijo trabajando...
Padre detectó fin del hijo.`}
          />
        </section>

        {/* 2.5.1 */}
        <section>
          <SectionHeading id="2-5-1-waitpid" number="2.5.1" title="Uso de waitpid()" />
          <p className="mb-4">
            A diferencia de <code className="text-[#f5a623]">wait()</code>, <code className="text-[#f5a623]">waitpid()</code> permite esperar a un hijo específico y tiene opciones como <code className="text-[#58a6ff]">WNOHANG</code> para no bloquear el proceso padre.
          </p>
        </section>

        {/* 2.6 */}
        <section>
          <SectionHeading id="2-6-exit" number="2.6" title="Sistema de llamada _exit () y exit ()" />
          <p>
            Finalizan el proceso. <code className="text-[#f5a623]">exit()</code> realiza limpieza de buffers antes de llamar al sistema <code className="text-[#f5a623]">_exit()</code>.
          </p>
        </section>

        {/* 2.7 */}
        <section>
          <SectionHeading id="2-7-zombi" number="2.7" title="Estado Zombi" />
          <p className="mb-4">
            Un proceso se vuelve zombi cuando termina pero su padre aún no llama a <code className="text-[#f5a623]">wait()</code>. Permanece en la tabla de procesos como <code className="text-[#ff5f56]">&lt;defunct&gt;</code>.
          </p>
        </section>

        {/* 2.8 */}
        <section>
          <SectionHeading id="2-8-hilos" number="2.8" title="Hilos" />
          <p className="mb-4">
            Los hilos comparten el espacio de memoria del proceso, lo que los hace más ligeros que los procesos para tareas concurrentes.
          </p>
        </section>

        {/* 2.8.2 */}
        <section>
          <SectionHeading id="2-8-2-creacion-hilos" number="2.8.2" title="Creación de hilos" />
          <CopyCodeBlock 
            filename="hilo_basico.c" 
            language="C" 
            code={`#include <pthread.h>
#include <stdio.h>

void* tarea(void* arg) {
  printf("Hola desde el hilo!\\n");
  return NULL;
}

int main() {
  pthread_t h;
  pthread_create(&h, NULL, tarea, NULL);
  pthread_join(h, NULL);
  return 0;
}`} 
            compileCommand="gcc hilo_basico.c -lpthread -o hilo"
            runCommand="./hilo"
            output={`Hola desde el hilo!`}
          />
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Aprendí la importancia de la sincronización y el ciclo de vida de los procesos. Comprendí cómo <code className="text-[#f5a623]">fork()</code> duplica el espacio de memoria y cómo procesos huérfanos pueden convertirse en zombis si el padre no realiza un <code className="text-[#f5a623]">wait()</code>. Además, observé que los hilos permiten paralelismo de forma mucho más ligera.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorarla?</strong> Podría mejorar escribiendo un programa concurrente más complejo que combine la creación de múltiples hilos manejando recursos y comparando su tiempo de ejecución con procesos independientes.
          </p>
        </ReflectionBox>

        <TopicQuiz topicId="tema-2" title="Test - Procesos e Hilos" questions={TEMA2_QUIZ} />
        <ReadMarker topicId="tema-2" />
      </article>
    </div>
  );
}
