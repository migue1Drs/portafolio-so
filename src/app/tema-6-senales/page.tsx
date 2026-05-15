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
        number="Tema 6"
        title="Señales"
        description="Interrupciones de software, manejo asíncrono, rutinas de tratamiento, y control del flujo de ejecución en sistemas UNIX/Linux."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* Intro */}
        <section>
          <p className="mb-4">
            Las señales son <strong>interrupciones de software</strong> que pueden ser enviadas a un proceso para informarle de algún evento asíncrono o situación especial. El sistema operativo las identifica con un número entero positivo asociado a un nombre que generalmente inicia con <code className="text-[#58a6ff]">SIG</code>.
          </p>

          <SectionHeading id="7-1-intro" number="6.1" title="Introducción" />
          <p className="mb-4">
            Los procesos pueden enviarse señales usando llamadas al sistema como <code className="text-[#f5a623]">kill()</code>. Cuando un proceso recibe una señal, puede proceder de tres diferentes formas:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4 ml-2 text-[#b0b8c4]">
            <li><strong className="text-white">Ignorar la señal:</strong> Será inmune a la misma, siempre que tenga mayor prioridad. (Algunas como <code className="text-[#ff7b72]">SIGKILL</code> y <code className="text-[#ff7b72]">SIGSTOP</code> no pueden ser ignoradas).</li>
            <li><strong className="text-white">Invocar rutina por defecto:</strong> Aportada por el kernel. Suele terminar el proceso y, en algunos casos (como error de bus o violación de segmento), generar un archivo <code className="text-[#58a6ff]">core</code> con un volcado de memoria para depuración.</li>
            <li><strong className="text-white">Invocar a una rutina propia:</strong> El programador escribe su propio manejador (handler) para ejecutar acciones específicas al recibirla.</li>
          </ol>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Comprendí que las <a href="#7-1-intro" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">señales</a> son interrupciones de software que permiten la comunicación asíncrona entre procesos y el kernel. Un proceso puede ignorarlas, usar la acción por defecto, o definir su propio manejador.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Experimentando con la recepción de señales en un proceso multihilo para entender cómo el kernel decide a cuál hilo entregar la señal.
            </p>
          </ReflectionBox>
        </section>

        {/* 7.2 Tipos de señales */}
        <section>
          <SectionHeading id="7-2-tipos" number="6.2" title="Tipos de señales" />
          <p className="mb-4">
            Las señales se clasifican en grupos: terminación de procesos, excepciones inducidas (accesos inválidos, coma flotante), originadas en modo usuario, interacción con la terminal y trazado de programas. En Linux, están definidas en <code className="text-[#a5d6ff]">&lt;signal.h&gt;</code>.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden my-6 shadow-lg shadow-[#1f6feb]/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-[#161b22] border-b border-[#30363d]">
                  <tr>
                    <th className="p-3 text-[#58a6ff] font-bold">Número</th>
                    <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">Nombre</th>
                    <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">01</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGHUP</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Termina el proceso líder.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">02</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGINT</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Tecla Ctrl+c pulsada.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">03</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGQUIT</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Tecla Ctrl+\ pulsada termina terminal.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">04</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGILL</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Instrucción Ilegal.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">05</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGTRAP</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Trazado de los programas.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">06</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGABRT / SIGIOT</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Terminación anormal.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">07</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGBUS</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Error de bus.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">08</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGFPE</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Error aritmético, coma flotante.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">09</td><td className="p-3 font-mono text-[#ff7b72] border-l border-[#30363d] font-bold">SIGKILL</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Eliminar procesos incondicionalmente. (No se ignora)</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">10</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGUSR1</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Señal definida por el usuario.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">11</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGSEGV</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Violación de segmento.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">12</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGUSR2</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Señal definida por el usuario.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">13</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGPIPE</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Escritura de pipe sin lectores.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">14</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGALRM</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Señal enviada por el kernel cuándo es fin del reloj ITIMER_REAL.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">15</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGTERM</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Señal de terminación del software.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">16</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGTKFLT</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Desbordamiento de coprocesador matemático.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">17</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGCHLD</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Señal enviada por el núcleo a un padre para avisarle que un hijo ha terminado.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">18</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGCONT</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Señal cuando el proceso se lleva a segundo o primer plano.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">19</td><td className="p-3 font-mono text-[#ff7b72] border-l border-[#30363d] font-bold">SIGSTOP</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Suspensión de un proceso. (No se ignora)</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">20</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGTSTP</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Suspensión debido a Ctrl+Z.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">21</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGTTIN</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Suspensión de proceso en background que trata de leer en terminal.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">22</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGTTOU</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Suspensión de proceso en background que trata de escribir en terminal.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">23</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGURG</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Datos urgentes para los sockets.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">24</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGXCPU</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Sobrepasado el límite de tiempo en el CPU.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">25</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGXFSZ</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Sobrepasado el tamaño del archivo.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">26</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGVTALARM</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Fin del temporizador ITIMER_VIRTUAL.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">27</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGPROF</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Fin del temporizador ITIMER_PROF.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">28</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGWINCH</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Cambio de tamaño de una ventana usado por X11.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">29</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGIO</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Datos disponibles para una entrada/salida.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">30</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGPWR</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Fallo de alimentación.</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">31</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGSYS</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Error de argumento en una llamada (SIGUNUSED).</td></tr>
                  <tr className="hover:bg-[#161b22]/50"><td className="p-3 font-mono text-[#e6edf3]">32</td><td className="p-3 font-mono text-[#d2a8ff] border-l border-[#30363d]">SIGRTMIN</td><td className="p-3 text-[#b0b8c4] border-l border-[#30363d]">Marca el límite de señales en tiempo real.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">kill (Enviar Señal)</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;signal.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">kill</span>(<span className="text-[#ff7b72]">pid_t</span> pid, <span className="text-[#ff7b72]">int</span> sig);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">raise (Autoenvío)</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;signal.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">raise</span>(<span className="text-[#ff7b72]">int</span> sig);
              </code>
            </div>
          </div>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí a identificar cada señal por su número y nombre (SIGINT, SIGKILL, SIGSEGV, etc.), y que <a href="#7-2-tipos" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">SIGKILL y SIGSTOP</a> son las únicas que no pueden ser capturadas ni ignoradas, porque el kernel necesita mantener el control absoluto.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Creando un programa que registre un handler para cada señal capturable y observe cuáles se reciben en situaciones reales de uso del sistema.
            </p>
          </ReflectionBox>
        </section>

        {/* 7.3 Tratamiento de señales */}
        <section>
          <SectionHeading id="7-3-tratamiento" number="6.3" title="Tratamiento de señales" />
          <p className="mb-4">
            La llamada <code className="text-[#f5a623]">signal()</code> permite especificar el comportamiento ante la recepción de una señal: puede ser <code className="text-[#58a6ff]">SIG_DFL</code> (defecto), <code className="text-[#58a6ff]">SIG_IGN</code> (ignorar), o un puntero a una función (handler).
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO signal</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;signal.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">typedef void</span> (*sighandler_t)(<span className="text-[#ff7b72]">int</span>);<br />
              <span className="text-[#ff7b72]">sighandler_t</span> <span className="text-[#d2a8ff]">signal</span>(<span className="text-[#ff7b72]">int</span> signum, <span className="text-[#ff7b72]">sighandler_t</span> handler);
            </code>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Capturar Ctrl+C (SIGINT)</h3>
          <CopyCodeBlock 
            filename="controlC.c" 
            language="C" 
            code={`#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void sigint_handler(int sig) {
    static int cont = 0;
    printf("\\nSeñal número %d recibida\\n", sig);
    
    if (cont < 3) {
        printf("Has intentado interrumpirme. Faltan %d intentos más.\\n", 3 - cont);
        cont++;
    } else {
        printf("Me rindo. Saliendo...\\n");
        exit(EXIT_SUCCESS);
    }
    
    // Reestablecer la señal para el próximo intento (requerido en algunos UNIX viejos)
    if (signal(SIGINT, sigint_handler) == SIG_ERR) {
        perror("Señal"); exit(EXIT_FAILURE);
    }
}

int main() {
    if (signal(SIGINT, sigint_handler) == SIG_ERR) {
        perror("señal"); exit(EXIT_FAILURE);
    }
    
    printf("En espera de Ctrl+c... (Intenta 4 veces)\\n");
    while(1) {
        sleep(99);
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc controlC.c -o controlC"
            runCommand="./controlC"
            output={`En espera de Ctrl+c... (Intenta 4 veces)
^C
Señal número 2 recibida
Has intentado interrumpirme. Faltan 3 intentos más.
^C
Señal número 2 recibida
Has intentado interrumpirme. Faltan 2 intentos más.
^C
Señal número 2 recibida
Has intentado interrumpirme. Faltan 1 intentos más.
^C
Señal número 2 recibida
Me rindo. Saliendo...`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí a interceptar señales con <a href="#7-3-tratamiento" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">signal()</code></a> y a definir manejadores personalizados que alteran el comportamiento por defecto del proceso, como contar cuántas veces se presiona Ctrl+C antes de terminar.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Migrando de <code className="text-[#f5a623]">signal()</code> a <code className="text-[#f5a623]">sigaction()</code>, que es la versión moderna y portable que permite un control más preciso sobre las máscaras de señales.
            </p>
          </ReflectionBox>
        </section>
        <section>
          <SectionHeading id="7-3-setjmp" number="6.3.1" title="Funciones setjmp y longjmp" />
          <p className="mb-4">
            Permiten a un proceso realizar saltos no locales hacia un contexto anterior, algo muy útil al gestionar señales. <code className="text-[#f5a623]">setjmp()</code> guarda el estado (registros, pila) en un buffer, retornando 0 inicialmente. Cuando el handler llama a <code className="text-[#f5a623]">longjmp()</code>, la ejecución salta de regreso a donde estaba <code className="text-[#f5a623]">setjmp()</code>, pero ahora retornando un valor diferente (generalmente 1), rompiendo el flujo secuencial asíncronamente.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Salto no local desde un Handler (SIGUSR1)</h3>
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
    printf("\\n>>> Recibí SIGUSR1. Ejecutando longjmp...\\n");
    signal(SIGUSR1, sigusr1_handler);
    longjmp(env, 1);
}

int main() {
    int i;
    signal(SIGUSR1, sigusr1_handler);
    
    for (i = 0; i < 3; i++) {
        if (setjmp(env) == 0) {
            printf("Punto de guardado (estado %d). Envíame SIGUSR1 (kill -10 %d)\\n", i, getpid());
        } else {
            // Esta parte se ejecuta cuando se retorna del longjmp
            printf("He regresado asíncronamente al punto del estado %d\\n", i);
        }
        sleep(5); // Simulamos procesamiento
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc retorno.c -o retorno"
            runCommand="./retorno & sleep 1 && kill -10 $!"
            output={`Punto de guardado (estado 0). Envíame SIGUSR1 (kill -10 24891)

>>> Recibí SIGUSR1. Ejecutando longjmp...
He regresado asíncronamente al punto del estado 0
Punto de guardado (estado 1). Envíame SIGUSR1 (kill -10 24891)`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Descubrí que <a href="#7-3-setjmp" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">setjmp()</code></a> y <a href="#7-3-setjmp" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">longjmp()</code></a> permiten implementar saltos no locales, funcionando como un mecanismo de recuperación similar a try/catch pero a nivel de sistema operativo.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Implementando un mini-framework de manejo de errores en C que use setjmp/longjmp para proteger secciones críticas de código contra señales inesperadas.
            </p>
          </ReflectionBox>
        </section>

        {/* 7.4 Alarma y Pausa */}
        <section>
          <SectionHeading id="7-4-alarma" number="6.4" title="Función alarma y pausa" />
          <p className="mb-4">
            La función <code className="text-[#f5a623]">alarm()</code> configura un temporizador en el sistema. Cuando transcurren los segundos solicitados, el kernel envía la señal <code className="text-[#58a6ff]">SIGALRM</code>. Por otro lado, la función <code className="text-[#f5a623]">pause()</code> suspende incondicionalmente al proceso hasta que reciba una señal capturable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">alarm</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">unsigned int</span> <span className="text-[#d2a8ff]">alarm</span>(<span className="text-[#ff7b72]">unsigned int</span> seconds);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">pause</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">pause</span>(<span className="text-[#ff7b72]">void</span>);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Temporizador con SIGALRM</h3>
          <CopyCodeBlock 
            filename="alarma.c" 
            language="C" 
            code={`#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define SEG 3

int salir = 1; // TRUE

void accion(int signum) {
    printf("\\nRecibí señal: %d (SIGALRM)\\n", signum);
    salir = 0; // FALSE
}

int main(int argc, char *argv[]) {
    int i = 0;
    
    printf("En %d segundos recibirás una alarma...\\n", SEG);
    signal(SIGALRM, accion);
    
    alarm(SEG); // Iniciar temporizador del kernel
    
    while(salir) {
        printf("Procesando: %d\\n", i++);
        sleep(1);
    }
    
    printf("Programa terminado correctamente.\\n");
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc alarma.c -o alarma"
            runCommand="./alarma"
            output={`En 3 segundos recibirás una alarma...
Procesando: 0
Procesando: 1
Procesando: 2

Recibí señal: 14 (SIGALRM)
Programa terminado correctamente.`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que <a href="#7-4-alarma" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">alarm()</code></a> programa un temporizador que envía SIGALRM al expirar, y que <a href="#7-4-alarma" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">pause()</code></a> suspende el proceso hasta recibir cualquier señal. Juntas permiten implementar timeouts y temporizadores sin consumir CPU.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Programando un servidor en C que use alarm() para detectar conexiones inactivas y cerrarlas automáticamente, liberando recursos del sistema de forma elegante.
            </p>
          </ReflectionBox>
        </section>



        <TopicQuiz topicId="tema-7" title="Test - Señales" questions={TEMA7_QUIZ} />
        <ReadMarker topicId="tema-7" />
      </article>
    </div>
  );
}
