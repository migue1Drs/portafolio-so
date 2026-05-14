import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA7_QUIZ } from "@/lib/quiz-data";

export default function Tema7Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 7"
        title="Señales"
        description="Comunicación asíncrona entre procesos: envío, captura y tratamiento de señales en sistemas UNIX/Linux."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* 7.1 Introducción */}
        <section>
          <SectionHeading id="7-1-intro" number="7.1" title="Introducción" />
          <p className="mb-4">
            Las <strong className="text-white">señales</strong> son interrupciones de software enviadas a un proceso para informarle de eventos asíncronos o situaciones especiales. El sistema operativo las identifica con números enteros positivos asociados a nombres que inician con <code className="text-[#f5a623]">SIG</code>.
          </p>
          <p className="mb-4">
            Cuando un proceso recibe una señal, puede reaccionar de tres formas:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-2">
            <li><strong className="text-white">Ignorar la señal:</strong> El proceso es inmune a ella.</li>
            <li><strong className="text-white">Acción por defecto:</strong> El kernel ejecuta una rutina predefinida (usualmente termina el proceso y puede generar un archivo <code className="text-[#58a6ff]">core</code>).</li>
            <li><strong className="text-white">Rutina propia:</strong> El programador define un manejador (handler) para realizar acciones específicas.</li>
          </ul>
        </section>

        {/* 7.2 Tipos de señales */}
        <section>
          <SectionHeading id="7-2-tipos" number="7.2" title="Tipos de señales" />
          <p className="mb-6">
            Las señales se clasifican según su origen (terminación de procesos, excepciones de hardware, errores de syscalls, interacción con la terminal, etc.). A continuación se resumen las principales señales definidas en <code className="text-[#58a6ff]">&lt;signal.h&gt;</code>:
          </p>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363d] bg-[#0d1117]">
                  <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Señal</th>
                  <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">#</th>
                  <th className="text-left p-4 text-[#f5a623] font-bold uppercase text-xs">Acción / Genera Core</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[11px]">
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGHUP</td><td className="p-3">1</td><td className="p-3 text-[#8b949e]">Terminar / No</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGINT</td><td className="p-3">2</td><td className="p-3 text-[#8b949e]">Terminar (Ctrl+C) / No</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGQUIT</td><td className="p-3">3</td><td className="p-3 text-[#8b949e]">Terminar (Ctrl+\\) / Sí</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGILL</td><td className="p-3">4</td><td className="p-3 text-[#8b949e]">Instrucción ilegal / Sí</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGFPE</td><td className="p-3">8</td><td className="p-3 text-[#8b949e]">Error coma flotante / Sí</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGKILL</td><td className="p-3">9</td><td className="p-3 text-[#8b949e]">Terminar (Forzado) / Sí</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGSEGV</td><td className="p-3">11</td><td className="p-3 text-[#8b949e]">Violación de segmento / Sí</td></tr>
                <tr className="border-b border-[#30363d]"><td className="p-3 text-white font-bold">SIGALRM</td><td className="p-3">14</td><td className="p-3 text-[#8b949e]">Alarma de reloj / No</td></tr>
                <tr><td className="p-3 text-white font-bold">SIGUSR1/2</td><td className="p-3">16/17</td><td className="p-3 text-[#8b949e]">Uso de usuario / No</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Envío de señales: kill()</h3>
          <p className="mb-4">
            Para enviar una señal se utiliza la llamada <code className="text-[#f5a623]">kill(pid, sig)</code>. El valor de <code className="text-[#f5a623]">pid</code> determina el destinatario:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 ml-2 text-sm">
            <li><code className="text-white">pid &gt; 0</code>: Proceso específico.</li>
            <li><code className="text-white">pid = 0</code>: Todo el grupo de procesos del emisor.</li>
            <li><code className="text-white">pid = -1</code>: Todos los procesos con el mismo ID real (excepto init).</li>
          </ul>
        </section>

        {/* 7.3 Tratamiento */}
        <section>
          <SectionHeading id="7-2-signal" number="7.3" title="Tratamiento de señales" />
          <p className="mb-4">
            La función <code className="text-[#f5a623]">signal()</code> permite definir el comportamiento ante una señal usando: <code className="text-[#58a6ff]">SIG_DFL</code> (defecto), <code className="text-[#58a6ff]">SIG_IGN</code> (ignorar) o una dirección de función (handler).
          </p>
          
          <CopyCodeBlock 
            filename="controlC.c" 
            language="C" 
            code={`#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void sigint_handler(int sig) {
    static int cont = 0;
    printf("señal número %d recibida\\n", sig);
    if (cont < 20)
        printf("Contador = %d\\n", cont++);
    else
        exit(EXIT_SUCCESS);
        
    // Reestablecer manejador (depende de la versión de UNIX)
    signal(SIGINT, sigint_handler);
}

int main() {
    if (signal(SIGINT, sigint_handler) == SIG_ERR) {
        perror("señal");
        exit(EXIT_FAILURE);
    }
    while (1) {
        printf("En espera de Ctrl+c\\n");
        sleep(5);
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc controlC.c -o controlC"
            runCommand="./controlC"
            output={`En espera de Ctrl+c
^Cseñal número 2 recibida
Contador = 0
En espera de Ctrl+c`}
          />
        </section>

        {/* 7.3.1 */}
        <section>
          <SectionHeading id="7-3-setjmp" number="7.3.1" title="Funciones setjmp y longjmp" />
          <p className="mb-4">
            <code className="text-[#f5a623]">setjmp()</code> guarda el contexto de ejecución (punteros, pila, registros) en un buffer <code className="text-[#58a6ff]">jmp_buf</code>. <code className="text-[#f5a623]">longjmp()</code> restaura este entorno, devolviendo el flujo al punto del <code className="text-[#f5a623]">setjmp</code>.
          </p>
          <CopyCodeBlock 
            filename="retorno.c" 
            language="C" 
            code={`#include <stdio.h>
#include <signal.h>
#include <setjmp.h>
#include <stdlib.h>
#include <unistd.h>

jmp_buf env;

void sigusr1_handler(int sig) {
    printf("\\nRecibí SIGUSR1, regresando...\\n");
    longjmp(env, 1);
}

int main() {
    signal(SIGUSR1, sigusr1_handler);
    for (int i=0; i < 5; i++) {
        if (setjmp(env) == 0)
            printf("Punto de regreso en estado %d\\n", i);
        else
            printf("Regreso al punto del estado %d\\n", i);
        sleep(10);
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc retorno.c -o retorno"
            runCommand="./retorno & sleep 1 && kill -10 $!"
            output={`Punto de regreso en estado 0
Recibí SIGUSR1, regresando...
Regreso al punto del estado 0`}
          />
        </section>

        {/* 7.4 */}
        <section>
          <SectionHeading id="7-4-alarm" number="7.4" title="Función alarma y pausa" />
          <p className="mb-6">
            <code className="text-[#f5a623]">alarm(seconds)</code> programa una señal SIGALRM. Solo puede haber una alarma por proceso. <code className="text-[#f5a623]">pause()</code> suspende el proceso hasta recibir cualquier señal.
          </p>
          <CopyCodeBlock 
            filename="alarma_cont.c" 
            language="C" 
            code={`#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int salir = 1;

void accion(int signum) {
    printf("\\nRecibí señal:%d SIGALRM\\n", signum);
    salir = 0;
}

int main() {
    int i=0;
    printf("Alarma en 2 segundos...\\n");
    signal(SIGALRM, accion);
    alarm(2);
    while(salir) {
        i++; // Contando...
    }
    printf("Contador final: %d\\n", i);
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc alarma_cont.c -o alarma_cont"
            runCommand="./alarma_cont"
            output={`Alarma en 2 segundos...
Recibí señal:14 SIGALRM
Contador final: 1548231`}
          />
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Comprendí que las señales permiten una comunicación asíncrona fundamental. El uso de <code className="text-[#f5a623]">setjmp/longjmp</code> es una herramienta poderosa pero peligrosa para manejar flujos de error, y aprendí cómo el kernel usa temporizadores para interrumpir procesos pesados.
          </p>
        </ReflectionBox>

        <TopicQuiz
          topicId="tema-7"
          title="Test — Señales"
          questions={TEMA7_QUIZ}
        />

        <ReadMarker topicId="tema-7" />

      </article>
    </div>
  );
}
