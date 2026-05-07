import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";

export default function Tema7Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 7"
        title="Señales"
        description="Comunicación asíncrona entre procesos: envío, captura y tratamiento de señales con signal(), setjmp/longjmp, y temporizadores con alarm() y pause()."
      />

      <article className="space-y-6 text-[#b0b8c4] leading-relaxed">

        {/* 7.1 Introducción */}
        <SectionHeading id="7-1-intro" number="7.1" title="Introducción a señales" />
        <p>
          Las <strong className="text-white">señales</strong> son eventos asíncronos que el kernel envía a un proceso.
          Un proceso puede <em>ignorar</em>, <em>capturar</em> (con un handler) o dejar la <em>acción por defecto</em>.
          Las señales <code className="text-[#f5a623]">SIGKILL</code> (9) y <code className="text-[#f5a623]">SIGSTOP</code> (19)
          no pueden ser capturadas ni ignoradas.
        </p>

        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm overflow-hidden my-6">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#333333] bg-[#252525]">
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Señal</th>
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">#</th>
              <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Descripción</th>
            </tr></thead>
            <tbody>
              <tr className="border-b border-[#333333]"><td className="p-3 font-mono text-white">SIGINT</td><td className="p-3 text-[#a0a0a0]">2</td><td className="p-3 text-[#a0a0a0]">Interrupción (Ctrl+C)</td></tr>
              <tr className="border-b border-[#333333]"><td className="p-3 font-mono text-white">SIGKILL</td><td className="p-3 text-[#a0a0a0]">9</td><td className="p-3 text-[#a0a0a0]">Matar (no capturable)</td></tr>
              <tr className="border-b border-[#333333]"><td className="p-3 font-mono text-white">SIGSEGV</td><td className="p-3 text-[#a0a0a0]">11</td><td className="p-3 text-[#a0a0a0]">Violación de segmento</td></tr>
              <tr className="border-b border-[#333333]"><td className="p-3 font-mono text-white">SIGALRM</td><td className="p-3 text-[#a0a0a0]">14</td><td className="p-3 text-[#a0a0a0]">Alarma de temporizador</td></tr>
              <tr className="border-b border-[#333333]"><td className="p-3 font-mono text-white">SIGTERM</td><td className="p-3 text-[#a0a0a0]">15</td><td className="p-3 text-[#a0a0a0]">Terminación suave</td></tr>
              <tr className="border-b border-[#333333]"><td className="p-3 font-mono text-white">SIGCHLD</td><td className="p-3 text-[#a0a0a0]">17</td><td className="p-3 text-[#a0a0a0]">Hijo terminado</td></tr>
              <tr><td className="p-3 font-mono text-white">SIGUSR1</td><td className="p-3 text-[#a0a0a0]">10</td><td className="p-3 text-[#a0a0a0]">Definida por usuario</td></tr>
            </tbody>
          </table>
        </div>

        <LinuxTerminal command="kill -l | head -5"
          output={` 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ`}
          title="bash — lista de señales" />

        {/* 7.2 signal() — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="7-2-signal" number="7.2" title="Tratamiento de señales con signal()" />
        <p>
          La función <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">signal()</code> registra
          un manejador personalizado para capturar una señal en lugar de ejecutar la acción por defecto.
        </p>
        <CopyCodeBlock filename="signal_handler.c" language="C" code={`#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void sigint_handler(int sig) {
    printf("\\nSeñal %d capturada (Control+C)\\n", sig);
}

int main() {
    if (signal(SIGINT, sigint_handler) == SIG_ERR) {
        perror("señal");
        exit(EXIT_FAILURE);
    }
    while (1) {
        printf("Esperando una señal...\\n");
        sleep(1);
    }
    return 0;
}`} />
        <LinuxTerminal command="gcc -o signal_ej signal_handler.c && ./signal_ej"
          output={`Esperando una señal...
Esperando una señal...
Esperando una señal...
^C
Señal 2 capturada (Control+C)
Esperando una señal...
Esperando una señal...
^C
Señal 2 capturada (Control+C)
Esperando una señal...`}
          title="bash — captura de SIGINT con signal()" />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Con <code className="text-[#f5a623]">signal(SIGINT, handler)</code> el
            proceso ya no termina al presionar Ctrl+C, sino que ejecuta nuestra función <code className="text-[#f5a623]">sigint_handler</code>.
            El programa continúa ejecutándose después de capturar la señal. Para salir realmente se necesita
            <code className="text-[#f5a623]"> SIGKILL</code> (kill -9) que no puede ser capturada.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Usar <code className="text-[#f5a623]">sigaction()</code> en
            lugar de <code className="text-[#f5a623]">signal()</code> para un comportamiento más predecible y portable.
            También agregar un contador para salir después de N capturas.
          </p>
        </ReflectionBox>

        {/* 7.3 setjmp / longjmp */}
        <SectionHeading id="7-3-setjmp" number="7.3" title="Funciones setjmp / longjmp" />
        <p>
          <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">setjmp()</code> guarda el contexto
          de ejecución y <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">longjmp()</code> permite
          saltar de vuelta a ese punto. Es útil para implementar manejo de errores tipo &quot;try-catch&quot; en C, o para
          retornar a un punto seguro después de recibir una señal.
        </p>
        <CopyCodeBlock filename="setjmp_ejemplo.c" language="C" code={`#include <stdio.h>
#include <setjmp.h>
#include <signal.h>

jmp_buf env;

void handler(int sig) {
    printf("\\nSeñal %d capturada, saltando con longjmp...\\n", sig);
    longjmp(env, 1);
}

int main() {
    signal(SIGINT, handler);

    if (setjmp(env) == 0) {
        printf("Punto de retorno establecido.\\n");
        printf("Esperando señal (Ctrl+C)...\\n");
        while(1) pause();
    } else {
        printf("Regresé desde longjmp después de la señal.\\n");
        printf("Programa continúa de forma segura.\\n");
    }
    return 0;
}`} />
        <LinuxTerminal command="gcc -o setjmp_ej setjmp_ejemplo.c && ./setjmp_ej"
          output={`Punto de retorno establecido.
Esperando señal (Ctrl+C)...
^C
Señal 2 capturada, saltando con longjmp...
Regresé desde longjmp después de la señal.
Programa continúa de forma segura.`}
          title="bash — setjmp / longjmp con señales" />

        {/* 7.4 alarm() y pause() — CÓDIGO EXACTO DEL PDF */}
        <SectionHeading id="7-4-alarm" number="7.4" title="Función alarm() y pause()" />
        <p>
          <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">alarm(segundos)</code> programa una
          señal <code className="text-[#f5a623]">SIGALRM</code> que será enviada al proceso después de los segundos
          indicados. <code className="text-[#f5a623]">pause()</code> suspende el proceso hasta recibir cualquier señal.
        </p>
        <CopyCodeBlock filename="alarm_ejemplo.c" language="C" code={`#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define SEG 2
#define TRUE 1
#define FALSE 0

int salir = TRUE;

void accion(int signum) {
    printf("\\nRecibí señal:%d SIGALRM\\n", signum);
    salir = FALSE;
}

int main(int argc, char *argv[]) {
    int i = 0;
    printf("En %d recibiras una alarma\\n", SEG);
    signal(SIGALRM, accion);
    alarm(SEG);

    while(salir) {
        printf("contemos:%d\\n", i++);
    }
    return EXIT_SUCCESS;
}`} />
        <LinuxTerminal command="gcc -o alarm_ej alarm_ejemplo.c && ./alarm_ej"
          output={`En 2 recibiras una alarma
contemos:0
contemos:1
contemos:2
contemos:3
...
contemos:847532
contemos:847533

Recibí señal:14 SIGALRM`}
          title="bash — alarm() y SIGALRM" />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> La función <code className="text-[#f5a623]">alarm()</code> es un
            temporizador que envía <code className="text-[#f5a623]">SIGALRM</code> (señal 14) al proceso después de N segundos.
            El while se ejecuta rápidamente contando hasta que llega la alarma. La combinación de
            <code className="text-[#f5a623]"> signal() + alarm()</code> es útil para implementar timeouts en operaciones
            bloqueantes como lecturas de red o entrada de usuario.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Combinar <code className="text-[#f5a623]">alarm()</code> con
            <code className="text-[#f5a623]"> pause()</code> para implementar un <code className="text-[#f5a623]">sleep()</code> personalizado.
            También explorar <code className="text-[#f5a623]">setitimer()</code> que ofrece temporizadores con mayor
            precisión (microsegundos).
          </p>
        </ReflectionBox>

      </article>
    </div>
  );
}
