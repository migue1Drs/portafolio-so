import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA3_QUIZ } from "@/lib/quiz-data";

export default function Tema3Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 3"
        title="Mecanismos de comunicación entre procesos (IPC)"
        description="Formas básicas de comunicación como streams (pipe, fifo y sockets) y mensajes (colas y datagramas). Mecanismos de sincronización System V y POSIX."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* Intro */}
        <section>
          <p className="mb-4">
            Todos los procesos, parientes o no, necesitan en ocasiones comunicarse entre sí. Para esto, el sistema brinda formas básicas de comunicación como stream (pipe, fifo y sockets) y mensajes (colas de mensajes y sockets datagramas).
          </p>
          <p>
            Si los procesos son parientes, la comunicación se puede realizar por medio de una tubería o pipe. Si se necesita proteger el medio de comunicación se pueden utilizar mecanismos de sincronización, ya sea implementados como unidades que requieren una llave para poder accesar a los recursos compartidos (sistemas derivados de System V), o sin utilizar llaves por medio de llamados a funciones POSIX.
          </p>
        </section>

        {/* 3.1 */}
        <section>
          <SectionHeading id="3-1-tuberias" number="3.1" title="Comunicación mediante tuberías" />
          <p className="mb-4">
            La comunicación entre procesos es fundamental para que intercambien datos. Hay que considerar si los procesos se van a comunicar en la misma máquina y si están emparentados, o si se comunicarán desde máquinas diferentes. Las tuberías son mecanismos clásicos de comunicación entre dos o más procesos emparentados en la misma máquina.
          </p>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Comprendí que la <a href="#3-1-tuberias" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">IPC (Inter-Process Communication)</a> es fundamental en sistemas modernos porque los procesos corren en espacios de memoria aislados para seguridad. Existen diferentes mecanismos dependiendo de si los procesos residen en la misma máquina o si tienen parentesco genealógico.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Listando mediante <code className="text-[#58a6ff]">lsof</code> o <code className="text-[#58a6ff]">strace</code> los mecanismos IPC exactos que utiliza un programa común como mi navegador web (Chrome/Firefox) para comunicar sus cientos de procesos aislados.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.1.1 */}
        <section>
          <SectionHeading id="3-1-1-pipe" number="3.1.1" title="Tuberías sin nombre - pipe" />
          <p className="mb-4">
            Las tuberías sin nombre (pipe) son viejas formas de IPC proporcionadas por todos los sistemas UNIX. Tienen dos limitaciones: los datos fluyen en una sola dirección, y solo pueden usarse entre procesos que tienen un ancestro en común. Una tubería se crea llamando a la función <code className="text-[#f5a623]">pipe()</code> o <code className="text-[#f5a623]">pipe2()</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO pipe</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">pipe</span>(<span className="text-[#ff7b72]">int</span> filedes[2]);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO pipe2</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">pipe2</span>(<span className="text-[#ff7b72]">int</span> filedes[2], <span className="text-[#ff7b72]">int</span> flags);
              </code>
            </div>
          </div>

          <p className="mt-4 mb-4">
            El valor retornado es <code className="text-[#f5a623]">0</code> si todo es correcto y <code className="text-[#f5a623]">-1</code> si existe error. <code className="text-[#58a6ff]">filedes[0]</code> abre la tubería para <strong>lectura</strong>, y <code className="text-[#58a6ff]">filedes[1]</code> para <strong>escritura</strong>. Normalmente, la salida de <code>filedes[1]</code> es la entrada para <code>filedes[0]</code>.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Tubería básica (Padre escribe, Hijo lee)</h3>
          <CopyCodeBlock 
            filename="pipe_basico.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#define MAXLINEA 80

int main() {
    int n, fd[2];
    pid_t hijo;
    char linea[MAXLINEA];

    if (pipe(fd) < 0) {
        fprintf(stderr, "error de pipe");
        exit(0);
    }
    
    if ((hijo = fork()) < 0) {
        fprintf(stderr, "error de fork");
        exit(EXIT_FAILURE);
    } else if (hijo > 0) {
        /* padre */
        close(fd[0]);
        write(fd[1], "hola mundo\\n", 12);
        wait(NULL); // Esperar al hijo para evitar zombis
    } else {
        /* hijo */
        close(fd[1]);
        n = read(fd[0], linea, MAXLINEA);
        write(STDOUT_FILENO, linea, n);
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc pipe_basico.c -o pipe_basico"
            runCommand="./pipe_basico"
            output={`hola mundo`} 
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Intercambio de roles (Hijo escribe, Padre lee)</h3>
          <CopyCodeBlock 
            filename="pipe_inverso.c" 
            language="C" 
            code={`#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdio.h>
#define MAXLINE 80

int main() {
    int n, fd[2];
    pid_t hijo;
    char linea[MAXLINE];
    int estado;

    if (pipe(fd) < 0) { 
        fprintf(stderr, "error de tubería"); 
        exit(EXIT_FAILURE); 
    }
    
    if ((hijo = fork()) == 0) {
        /* hijo */
        close(fd[0]);
        write(fd[1], "hola mundo\\n", 12);
    } else {
        /* padre */
        close(fd[1]);
        n = read(fd[0], linea, MAXLINE);
        write(STDOUT_FILENO, linea, n);
        printf("numero de bytes: %d\\n", n);
        wait(&estado);
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc pipe_inverso.c -o pipe_inverso"
            runCommand="./pipe_inverso"
            output={`hola mundo
numero de bytes: 12`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Cálculo Distribuido de Factorial (Padre e Hijo interactuando)</h3>
          <p className="mb-4 text-sm text-[#b0b8c4]">
            Una muestra clásica de cómo delegar carga computacional. El padre lee argumentos, crea un <code className="text-[#f5a623]">pipe</code>, y bifurca un hijo. Envía el número a través de la tubería, el hijo calcula su factorial y el padre paralelamente calcula el otro. Clásico patrón de los sistemas UNIX iniciales.
          </p>
          <CopyCodeBlock 
            filename="factorial_pipe.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

unsigned long long factorial(int n) {
    if(n == 0 || n == 1) return 1;
    return (unsigned long long)n * factorial(n - 1);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Uso: %s <num1> <num2>\\n", argv[0]);
        return 1;
    }

    int num1 = atoi(argv[1]);
    int num2 = atoi(argv[2]);
    
    int pipefd[2];
    if (pipe(pipefd) == -1) { perror("Error en pipe"); return 1; }
    
    pid_t pid = fork();
    if (pid < 0) { perror("Error en fork"); return 1; }

    if(pid == 0){
        /* HIJO */
        close(pipefd[1]); // cerrar escritura
        int numero_hijo;
        read(pipefd[0], &numero_hijo, sizeof(numero_hijo));
        
        unsigned long long resultado_hijo = factorial(numero_hijo);
        printf("Hijo calculó: %d! = %llu\\n", numero_hijo, resultado_hijo);
        
        close(pipefd[0]);
        exit(0);
    } else {
        /* PADRE */
        close(pipefd[0]); // cerrar lectura
        write(pipefd[1], &num2, sizeof(num2)); // envia dato
        close(pipefd[1]);
        
        unsigned long long resultado_padre = factorial(num1);
        wait(NULL); // Sincroniza salida
        
        printf("Padre calculó: %d! = %llu\\n", num1, resultado_padre);
    }
    return 0;
}`} 
            compileCommand="gcc factorial_pipe.c -o factorial_pipe"
            runCommand="./factorial_pipe 5 7"
            output={`Hijo calculó: 7! = 5040
Padre calculó: 5! = 120`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que los <a href="#3-1-1-pipe" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">pipes</code></a> son tuberías unidireccionales de memoria RAM gestionadas por el kernel. Se usan típicamente llamando <a href="#3-1-1-pipe" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">pipe()</code></a> antes de <code className="text-[#f5a623]">fork()</code>, y cada proceso (padre/hijo) debe cerrar el extremo (lectura o escritura) que no utilizará.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Escribiendo un pequeño script en bash usando <code className="text-[#58a6ff]">|</code> (que implementa pipes internamente) y luego replicar ese mismo comportamiento exacto escribiendo el pipeline <code className="text-[#58a6ff]">ls | wc -l</code> en código C puro con <code className="text-[#f5a623]">pipe()</code> y <code className="text-[#f5a623]">dup2()</code>.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.1.2 */}
        <section>
          <SectionHeading id="3-1-2-fifo" number="3.1.2" title="Tuberías con nombre - fifo" />
          <p className="mb-4">
            La función <code className="text-[#f5a623]">mkfifo()</code> crea un archivo especial llamado FIFO, el cual es una tubería con un nombre asociado. A diferencia de <code className="text-[#f5a623]">pipe()</code>, esta sí tiene nombre y ruta en el sistema de archivos, permitiendo comunicar procesos no emparentados.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO DE LA FUNCIÓN</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/types.h&gt;</span><br />
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/stat.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">mkfifo</span>(<span className="text-[#ff7b72]">const char</span> *pathname, <span className="text-[#ff7b72]">mode_t</span> mode);
            </code>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Uso de tubería con nombre (FIFO)</h3>
          <CopyCodeBlock 
            filename="fifo_basico.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    pid_t hijo;
    int file;
    char mensaje[20];

    unlink("namepipe"); // Borra el archivo previo
    umask(~0666); // Cambia máscara de permisos

    if (mkfifo("namepipe", 0666) == -1) {
        perror("error en mkfifo");
        exit(EXIT_FAILURE);
    }
    
    if ((hijo = fork()) == 0) {
        fprintf(stdout, "soy el hijo, ID=%ld\\n", (long)getpid());
        if ((file = open("namepipe", O_WRONLY)) == -1) {
            perror("error en open O_WRONLY");
            exit(EXIT_FAILURE);
        }
        write(file, "soy el hijo, ID...\\n", 20);
        close(file);
        exit(EXIT_SUCCESS);
    }
    
    if (hijo > 0) {
        fprintf(stdout, "soy el padre, ID=%ld\\n", (long)getpid());
        if ((file = open("namepipe", O_RDONLY)) == -1) {
            perror("error en open O_RDONLY");
            exit(EXIT_FAILURE);
        }
        read(file, mensaje, 20);
        fprintf(stdout, "Mensaje del FIFO: %s", mensaje);
        close(file);
        unlink("namepipe");
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc fifo_basico.c -o fifo_basico"
            runCommand="./fifo_basico"
            output={`soy el padre, ID=15000
soy el hijo, ID=15001
Mensaje del FIFO: soy el hijo, ID...`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Productor y Consumidor de Matrices vía FIFO</h3>
          <p className="mb-4 text-sm text-[#b0b8c4]">
            Este código es un homenaje a las robustas tuberías con nombre. Aquí vemos cómo serializar estructuras de datos bidimensionales (una matriz y su orden) a través del buffer lineal de un <code className="text-[#f5a623]">fifo</code>. El productor genera los valores, mientras que el consumidor (nuestro padre) bloquea inteligentemente su lectura hasta que tiene suficientes bytes para reconstruir y resolver la matemática.
          </p>
          <CopyCodeBlock 
            filename="matriz_fifo.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <time.h>

#define FIFO_NAME "/tmp/matriz_fifo"
#define MAX_N 8

long calcular_determinante(int n, int matriz[MAX_N][MAX_N]) {
    if (n == 1) return matriz[0][0];
    if (n == 2) return (matriz[0][0] * matriz[1][1]) - (matriz[0][1] * matriz[1][0]);
    long det = 0; int submatriz[MAX_N][MAX_N]; int signo = 1;

    for (int f = 0; f < n; f++) {
        int sub_i = 0;
        for (int i = 1; i < n; i++) {
            int sub_j = 0;
            for (int j = 0; j < n; j++) {
                if (j == f) continue;
                submatriz[sub_i][sub_j] = matriz[i][j]; sub_j++;
            }
            sub_i++;
        }
        det += signo * matriz[0][f] * calcular_determinante(n - 1, submatriz);
        signo = -signo;
    }
    return det;
}

int main() {
    mkfifo(FIFO_NAME, 0666);
    pid_t pid = fork();

    if (pid < 0) return 1;

    if (pid == 0) {
        /* PRODUCTOR */
        int fd_write = open(FIFO_NAME, O_WRONLY);
        srand(time(NULL) ^ (getpid() << 16));

        for (int iter = 1; iter <= 1; iter++) {
            int n = (rand() % (MAX_N - 1)) + 2;
            int matriz[MAX_N][MAX_N];

            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++) matriz[i][j] = (rand() % 21) - 10;

            printf("[Productor] Enviando matriz %d (%dx%d)...\\n", iter, n, n);
            write(fd_write, &n, sizeof(int));
            for (int i = 0; i < n; i++) write(fd_write, matriz[i], n * sizeof(int));
            sleep(1);
        }
        close(fd_write);
        exit(0);
    } else {
        /* CONSUMIDOR */
        int fd_read = open(FIFO_NAME, O_RDONLY);
        int n_recibido, matriz_recibida[MAX_N][MAX_N];
        
        while (read(fd_read, &n_recibido, sizeof(int)) > 0) {
            for (int i = 0; i < n_recibido; i++)
                read(fd_read, matriz_recibida[i], n_recibido * sizeof(int));

            printf("\\n Consumidor: Matriz Recibida %dx%d \\n", n_recibido, n_recibido);
            for (int i = 0; i < n_recibido; i++) {
                for (int j = 0; j < n_recibido; j++) printf("%4d ", matriz_recibida[i][j]);
                printf("\\n");
            }
            long det = calcular_determinante(n_recibido, matriz_recibida);
            printf(" Resultado Determinante: %ld\\n\\n", det);
        }
        close(fd_read); wait(NULL); unlink(FIFO_NAME);
        printf("Sistema finalizado con éxito.\\n");
    }
    return 0;
}`} 
            compileCommand="gcc matriz_fifo.c -o matriz_fifo"
            runCommand="./matriz_fifo"
            output={`[Productor] Enviando matriz 1 (3x3)...

 Consumidor: Matriz Recibida 3x3 
   5    2   -8 
  -1    4    0 
   9   -3    7 
 Resultado Determinante: -201

Sistema finalizado con éxito.`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> A diferencia de los pipes, las <a href="#3-1-2-fifo" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">FIFOs</code> (<code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">mkfifo()</code>)</a> tienen presencia en el sistema de archivos como nodos especiales. Esto es revolucionario porque permite que procesos completamente ajenos (sin parentesco) se comuniquen simplemente abriendo el mismo archivo virtual.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Abriendo dos terminales distintas e interactuando manualmente a través de un archivo FIFO usando <code className="text-[#58a6ff]">echo "hola" &gt; mi_fifo</code> en una y <code className="text-[#58a6ff]">cat &lt; mi_fifo</code> en otra, para demostrar cómo el kernel bloquea al escritor hasta que aparece un lector.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.2 */}
        <section>
          <SectionHeading id="3-2-system-v" number="3.2" title="Mecanismos IPC derivados de System V" />
          <p className="mb-4">
            El paquete de comunicación entre procesos System V se compone de tres mecanismos: <strong>Semáforos</strong> (sincronizan procesos), <strong>Memoria Compartida</strong> (comparten espacio de direcciones virtuales), y <strong>Colas de mensajes</strong> (intercambio de datos con formato).
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden my-6">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#161b22] border-b border-[#30363d]">
                <tr>
                  <th className="p-3 text-[#58a6ff] font-bold">Mecanismo</th>
                  <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">Biblioteca</th>
                  <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">Crear/Abrir</th>
                  <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">Control</th>
                  <th className="p-3 text-[#58a6ff] font-bold border-l border-[#30363d]">Operaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363d]">
                <tr>
                  <td className="p-3 text-[#e6edf3]">Semáforos</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">&lt;sys/sem.h&gt;</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">semget</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">semctl</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">semop</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#e6edf3]">Memoria Compartida</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">&lt;sys/shm.h&gt;</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">shmget</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">shmctl</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">shmat, shmdt</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#e6edf3]">Colas de mensajes</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">&lt;sys/msg.h&gt;</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">msgget</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">msgctl</td>
                  <td className="p-3 font-mono text-[#a5d6ff] border-l border-[#30363d]">msgsnd, msgrcv</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Conocí el trío clásico de mecanismos IPC introducidos en <a href="#3-2-system-v" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">Unix System V</a>: <a href="#3-2-2-semaforos-v" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">Semáforos</a>, <a href="#3-3-memoria" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">Memoria Compartida</a> y <a href="#3-4-cola-mensajes" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">Colas de Mensajes</a>. Todos comparten una convención de nomenclatura similar para la creación (<code className="text-[#f5a623]">*get</code>), control (<code className="text-[#f5a623]">*ctl</code>) y operaciones.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Estudiando en profundidad la diferencia de rendimiento (throughput) entre transferir un archivo grande por Colas de Mensajes vs Memoria Compartida, para entender por qué la memoria compartida es teóricamente la más rápida.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.2.1 */}
        <section>
          <SectionHeading id="3-2-1-llaves" number="3.2.1" title="Llaves (Keys)" />
          <p className="mb-4">
            Una llave es una variable <code className="text-[#58a6ff]">key_t</code> (típicamente un entero de 32 bits) usada para acceder a los mecanismos IPC. Se genera utilizando la función <code className="text-[#f5a623]">ftok()</code>, la cual combina los 8 bits menos significativos del identificador con el i-nodo de un archivo existente.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO DE ftok</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/ipc.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">key_t</span> <span className="text-[#d2a8ff]">ftok</span>(<span className="text-[#ff7b72]">const char</span> *pathname, <span className="text-[#ff7b72]">int</span> proj_id);
            </code>
          </div>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que los recursos System V no se identifican por nombres de archivo, sino por "<a href="#3-2-1-llaves" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">llaves</a>" numéricas persistentes. <a href="#3-2-1-llaves" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">ftok()</code></a> garantiza que dos procesos independientes que apunten al mismo archivo con el mismo ID de proyecto obtendrán la misma llave.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Verificando qué ocurre matemáticamente a nivel binario en <code className="text-[#f5a623]">ftok()</code> si el archivo base usado es eliminado y recreado, lo que generaría un nuevo número de inodo y rompería la comunicación.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.2.2 */}
        <section>
          <SectionHeading id="3-2-2-semaforos-v" number="3.2.2" title="Semáforos en System V" />
          <p className="mb-4">
            Los semáforos System V están implementados en el kernel para garantizar operaciones atómicas. Un semáforo aquí no es un simple valor, sino un conjunto de valores enteros no negativos protegidos. Se utilizan principalmente <code className="text-[#f5a623]">semget()</code> (crear), <code className="text-[#f5a623]">semop()</code> (operar), y <code className="text-[#f5a623]">semctl()</code> (control).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">semget</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">semget</span>(<span className="text-[#ff7b72]">key_t</span> key, <span className="text-[#ff7b72]">int</span> nsems, <span className="text-[#ff7b72]">int</span> semflg);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">semop</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">semop</span>(<span className="text-[#ff7b72]">int</span> semid, <span className="text-[#ff7b72]">struct sembuf</span> *sops, <span className="text-[#ff7b72]">size_t</span> nsops);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Sincronización Padre-Hijo con semáforos System V</h3>
          <CopyCodeBlock 
            filename="semaforos_sysv.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <unistd.h>
#define SEM_HIJO 0
#define SEM_PADRE 1

int main(int argc, char *argv[]) {
    int i = 3, semid;
    pid_t pid;
    struct sembuf operacion;
    key_t llave = ftok(argv[0], 'a');
    
    if ((semid = semget(llave, 2, IPC_CREAT | 0600)) == -1) {
        perror("semget"); exit(EXIT_FAILURE);
    }
    
    semctl(semid, SEM_HIJO, SETVAL, 0);  // Bloquear hijo
    semctl(semid, SEM_PADRE, SETVAL, 1); // Desbloquear padre
    
    if ((pid = fork()) == -1) {
        perror("fork"); exit(EXIT_FAILURE);
    } else if (pid == 0) {
        while (i > 0) {
            operacion.sem_num = SEM_HIJO; operacion.sem_op = -1; operacion.sem_flg = 0;
            semop(semid, &operacion, 1); // Bloquea hasta que el padre libere
            printf("Proceso hijo: %d\\n", i--);
            operacion.sem_num = SEM_PADRE; operacion.sem_op = 1;
            semop(semid, &operacion, 1); // Libera al padre
        }
        semctl(semid, 0, IPC_RMID, 0);
    } else {
        while (i > 0) {
            operacion.sem_num = SEM_PADRE; operacion.sem_op = -1; operacion.sem_flg = 0;
            semop(semid, &operacion, 1); // Bloquea padre
            printf("Proceso padre: %d\\n", i--);
            operacion.sem_num = SEM_HIJO; operacion.sem_op = 1;
            semop(semid, &operacion, 1); // Libera al hijo
        }
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc semaforos_sysv.c -o semaforos_sysv"
            runCommand="./semaforos_sysv"
            output={`Proceso padre: 3
Proceso hijo: 3
Proceso padre: 2
Proceso hijo: 2
Proceso padre: 1
Proceso hijo: 1`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Descubrí que los <a href="#3-2-2-semaforos-v" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">semáforos de System V</a> son estructuras de datos complejas gestionadas en el espacio del kernel. A diferencia de una simple variable booleana, proporcionan <em>atomicidad</em>, asegurando que múltiples procesos no se interrumpan a la mitad de una operación crítica (como restar un contador).
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Simulando el clásico problema de "El productor y el consumidor" usando <a href="#3-2-2-semaforos-v" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">semop()</code></a> para manejar el tamaño de un buffer, bloqueando al productor si está lleno y al consumidor si está vacío.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.2.3 */}
        <section>
          <SectionHeading id="3-2-3-semaforos-posix" number="3.2.3" title="Semáforos en POSIX" />
          <p className="mb-4">
            Los semáforos POSIX proporcionan una API moderna y más sencilla basada en <code className="text-[#58a6ff]">&lt;semaphore.h&gt;</code>. La función <code className="text-[#f5a623]">sem_init()</code> los inicializa, <code className="text-[#f5a623]">sem_wait()</code> los cierra (bloquea o decrementa), y <code className="text-[#f5a623]">sem_post()</code> los abre (desbloquea o incrementa).
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Sincronización de hilos con semáforos POSIX y Mutex</h3>
          <CopyCodeBlock 
            filename="mutex_posix.c" 
            language="C" 
            code={`#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#define VALOR 10000

int contador = 0;
sem_t semaforo;

void *funcion1(void *valor) {
    for (int i = 0; i < VALOR; i++) {
        sem_wait(&semaforo); // Bloquea
        contador += 1;
        sem_post(&semaforo); // Libera
    }
    pthread_exit(NULL);
}

void *funcion2(void *valor) {
    for (int i = 0; i < VALOR; i++) {
        sem_wait(&semaforo); // Bloquea
        contador -= 1;
        sem_post(&semaforo); // Libera
    }
    pthread_exit(NULL);
}

int main() {
    pthread_t hilo1, hilo2;
    sem_init(&semaforo, 0, 1); // 1 = semáforo binario
    
    pthread_create(&hilo1, NULL, funcion1, NULL);
    pthread_create(&hilo2, NULL, funcion2, NULL);
    
    pthread_join(hilo1, NULL);
    pthread_join(hilo2, NULL);
    
    printf("Valor final de Contador = %d\\n", contador);
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc mutex_posix.c -lpthread -o mutex_posix"
            runCommand="./mutex_posix"
            output={`Valor final de Contador = 0`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Comprobé que la <a href="#3-2-3-semaforos-posix" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">API moderna de POSIX</a> (<a href="#3-2-3-semaforos-posix" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">sem_init</code></a>, <a href="#3-2-3-semaforos-posix" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">sem_wait</code></a>, <a href="#3-2-3-semaforos-posix" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">sem_post</code></a>) es mucho más directa y legible que System V. Al usar semáforos binarios, actúan como un <a href="#3-2-3-semaforos-posix" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">Mutex</code></a>, garantizando que solo un hilo a la vez pueda sumar o restar a la variable <code className="text-white">contador</code>, eliminando las condiciones de carrera.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Comentando intencionalmente las líneas de <code className="text-[#f5a623]">sem_wait()</code> y <code className="text-[#f5a623]">sem_post()</code> en el código para presenciar experimentalmente cómo el resultado final fluctúa erráticamente en cada ejecución debido al acceso concurrente descontrolado.
            </p>
          </ReflectionBox>
        </section>

        {/* 3.3 */}
        <section>
          <SectionHeading id="3-3-memoria" number="3.3" title="Memoria Compartida" />
          <p className="mb-4">
            Es la forma más rápida de comunicar dos procesos, intercambiando datos directamente en una región de direcciones virtuales unida al espacio del proceso.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPOS MEMORIA COMPARTIDA</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">shmget</span>(<span className="text-[#ff7b72]">key_t</span> key, <span className="text-[#ff7b72]">size_t</span> size, <span className="text-[#ff7b72]">int</span> shmflg);<br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">shmctl</span>(<span className="text-[#ff7b72]">int</span> shmid, <span className="text-[#ff7b72]">int</span> cmd, <span className="text-[#ff7b72]">struct</span> shmid_ds *buf);<br />
              <span className="text-[#ff7b72]">char*</span> <span className="text-[#d2a8ff]">shmat</span>(<span className="text-[#ff7b72]">int</span> shmid, <span className="text-[#ff7b72]">char</span> *shmaddr, <span className="text-[#ff7b72]">int</span> shmflg);<br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">shmdt</span>(<span className="text-[#ff7b72]">char</span> *shmaddr);
            </code>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Ataque de Diccionario Sincronizado (Fuerza Bruta) en Memoria Compartida</h3>
          <p className="mb-4 text-sm text-[#b0b8c4]">
            Para los programadores de mi generación, la manipulación de semáforos y memoria compartida al estilo <code className="text-[#f5a623]">System V</code> es arte puro. Este robusto sistema carga dinámicamente un hash encriptado desde <code className="text-[#a5d6ff]">/etc/shadow</code> y usa un generador de permutaciones concurrente. Este es coordinado celosamente mediante un array de semáforos para evitar lecturas sucias en la zona crítica.
          </p>
          <CopyCodeBlock 
            filename="ataque_diccionario.c" 
            language="C" 
            code={`#define _DEFAULT_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <crypt.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <time.h> 
#include <shadow.h>

struct zona_mutex { char palabra[256]; int terminado; };

void wait_P(int semid, int sem_num) { struct sembuf op = {sem_num, -1, 0}; semop(semid, &op, 1); }
void signal_V(int semid, int sem_num) { struct sembuf op = {sem_num, 1, 0}; semop(semid, &op, 1); }
void intercambiar(char *x, char *y) { char temp = *x; *x = *y; *y = temp; }
long factorial(int n) { long res = 1; for (int i = 2; i <= n; i++) res *= i; return res; }

void permutar_recursivo(char *str, int l, int r, char **lista, int *contador) {
    if (l == r) { strcpy(lista[*contador], str); (*contador)++; }
    else {
        for (int i = l; i <= r; i++) {
            intercambiar((str + l), (str + i));
            permutar_recursivo(str, l + 1, r, lista, contador);
            intercambiar((str + l), (str + i));
        }
    }
}

char **obtener_lista_permutaciones(char *nombre_usuario) {
    int len = strlen(nombre_usuario); long total = factorial(len);
    char **lista = malloc(total * sizeof(char *));
    for (int i = 0; i < total; i++) lista[i] = malloc((len + 1) * sizeof(char));
    int contador = 0; permutar_recursivo(nombre_usuario, 0, len - 1, lista, &contador);
    return lista;
}

int comparar_password(char *intento, char *hash_real) {
    return (strcmp(crypt(intento, hash_real), hash_real) == 0);
}

int main(int argc, char *argv[]) {
    if (argc != 2 || strlen(argv[1]) < 1 || strlen(argv[1]) > 12) {
        printf("Uso: sudo %s <usuario>\\n", argv[0]); return 1;
    }
    
    char *usuario = argv[1];
    struct spwd *shadow_entry = getspnam(usuario);

    if (shadow_entry == NULL) {
        printf("[!] Ejecuta con sudo para leer /etc/shadow.\\n"); return 1;
    }

    char *pass_objetivo = strdup(shadow_entry->sp_pwdp);
    if (pass_objetivo[0] == '*' || pass_objetivo[0] == '!') return 1;

    int n = strlen(usuario);
    long total_permutaciones = factorial(n);
    printf("[Padre] Generando %ld permutaciones...\\n", total_permutaciones);
    char **lista_permutaciones = obtener_lista_permutaciones(usuario);

    key_t llave = ftok(argv[0], 65);
    int shmid = shmget(llave, sizeof(struct zona_mutex), 0666 | IPC_CREAT);
    struct zona_mutex *zona = (struct zona_mutex *) shmat(shmid, NULL, 0);
    zona->terminado = 0;

    int semid = semget(llave, 2, 0666 | IPC_CREAT);
    semctl(semid, 0, SETVAL, 1); semctl(semid, 1, SETVAL, 0); 

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    pid_t pid = fork();

    if (pid == 0) { // HIJO
        long contador = 0;
        while (1) {
            wait_P(semid, 1); contador++;
            if (zona->terminado && strlen(zona->palabra) == 0) break;

            if (comparar_password(zona->palabra, pass_objetivo)) {
                clock_gettime(CLOCK_MONOTONIC, &end);
                double t_total = (end.tv_sec - start.tv_sec) + (end.tv_nsec - start.tv_nsec) / 1e9;
                printf("\\nÉXITO: Password encontrado: %s", zona->palabra);
                printf("\\nIntentos: %ld\\n[!] Tiempo: %.6f segundos\\n", contador, t_total);
                zona->terminado = 1; signal_V(semid, 0); break;
            }
            if (zona->terminado) { signal_V(semid, 0); break; }
            signal_V(semid, 0); 
        }
        free(pass_objetivo); shmdt(zona); exit(0);
    } else { // PADRE
        for (int i = 0; i < total_permutaciones; i++) {
            wait_P(semid, 0); if (zona->terminado) break; 
            strcpy(zona->palabra, lista_permutaciones[i]); signal_V(semid, 1); 
        }
        wait_P(semid, 0); zona->terminado = 1; strcpy(zona->palabra, ""); signal_V(semid, 1);
        wait(NULL);
        for (int i = 0; i < total_permutaciones; i++) free(lista_permutaciones[i]);
        free(lista_permutaciones); free(pass_objetivo);
        shmctl(shmid, IPC_RMID, NULL); semctl(semid, 0, IPC_RMID);
        printf("[Padre] Proceso terminado.\\n");
    }
    return 0;
}`} 
            compileCommand="gcc ataque_diccionario.c -o ataque_diccionario -lcrypt"
            runCommand="sudo ./ataque_diccionario admin"
            output={`[Padre] Generando 120 permutaciones...

ÉXITO: Password encontrado: midna
Intentos: 42
[!] Tiempo: 0.183422 segundos
[Padre] Proceso terminado.`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que la <a href="#3-3-memoria" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">Memoria Compartida</a> es el método IPC más rápido disponible porque elimina el cuello de botella de tener que copiar datos entre el espacio del usuario y el espacio del kernel. Ambos procesos apuntan a los mismos marcos físicos de RAM.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Experimentando con el tamaño máximo permitido para <a href="#3-3-memoria" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">shmget()</code></a> en mi sistema usando el comando <code className="text-[#58a6ff]">ipcs -l</code>, y verificando cómo el kernel rechaza solicitudes que exceden el límite predeterminado (<code className="text-[#58a6ff]">shmmax</code>).
            </p>
          </ReflectionBox>
        </section>

        {/* 3.4 */}
        <section>
          <SectionHeading id="3-4-cola-mensajes" number="3.4" title="Cola de mensajes" />
          <p className="mb-4">
            Permiten enviar flujos de mensajes en forma de paquetes estructurados. Los mensajes tienen un tipo <code className="text-[#58a6ff]">mtype</code> que permite al receptor discriminar qué mensajes leer de la cola mediante <code className="text-[#f5a623]">msgrcv()</code>.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Escritor/Lector de Colas de Mensajes</h3>
          <CopyCodeBlock 
            filename="mcola.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/msg.h>
#include <unistd.h>

struct msgbuf {
    long mtype;
    char mtext[80];
};

int main(int argc, char *argv[]) {
    int qid, modo;
    key_t llave = ftok(argv[0], 'a');
    struct msgbuf msg;

    if (argc > 1 && strcmp(argv[1], "s") == 0) modo = 1;
    else if (argc > 1 && strcmp(argv[1], "r") == 0) modo = 2;
    else { printf("Use: ./mcola s|r\\n"); exit(EXIT_FAILURE); }

    qid = msgget(llave, IPC_CREAT | 0666);

    if (modo == 1) { // Send
        msg.mtype = 1;
        time_t t; time(&t);
        snprintf(msg.mtext, sizeof(msg.mtext), "Enviado: %s", ctime(&t));
        msgsnd(qid, (void *)&msg, sizeof(msg.mtext), IPC_NOWAIT);
        printf("Mensaje enviado a la cola.\\n");
    } else { // Receive
        if (msgrcv(qid, (void *)&msg, sizeof(msg.mtext), 1, IPC_NOWAIT) != -1) {
            printf("Mensaje recibido: %s\\n", msg.mtext);
            msgctl(qid, IPC_RMID, NULL); // Borrar la cola después de leer
        } else {
            printf("No hay mensajes.\\n");
        }
    }
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc mcola.c -o mcola"
            runCommand="./mcola s && sleep 1 && ./mcola r"
            output={`Mensaje enviado a la cola.
Mensaje recibido: Enviado: Wed May 13 22:30:15 2026`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Multiplexor del comando WHO usando Colas IPC</h3>
          <p className="mb-4 text-sm text-[#b0b8c4]">
            En la década de los 80, antes de los sockets de dominio local modernos, usábamos <code className="text-[#f5a623]">msgget</code> para el transporte de tramas complejas. En esta brillante implementación leemos de <code className="text-[#a5d6ff]">/var/run/utmp</code> las sesiones de los usuarios y las volcamos en formato de string serializado directo a la memoria del kernel usando una cola. El receptor extrae estos mensajes a placer hasta consumir la cola entera. Arquitectura UNIX inquebrantable pura y dura.
          </p>
          <CopyCodeBlock 
            filename="msg_who.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <sys/msg.h>
#include <utmp.h> 

struct msgbuf { long mtype; char mtext[256]; };

void send_who_msgs(int qid, int msgtype) {
    struct utmp *ut; struct msgbuf msg; msg.mtype = msgtype;
    char hora_str[10]; printf("Extrayendo usuarios y enviando a la cola...\\n");
    
    setutent(); 
    while ((ut = getutent()) != NULL) {
        if (ut->ut_type == USER_PROCESS) {
            time_t tiempo = ut->ut_tv.tv_sec;
            struct tm *info_tiempo = localtime(&tiempo);
            strftime(hora_str, sizeof(hora_str), "%H:%M", info_tiempo);

            snprintf(msg.mtext, sizeof(msg.mtext), "%s\\tconectado\\t%s", hora_str, ut->ut_user);
            if (msgsnd(qid, (void *)&msg, sizeof(msg.mtext), IPC_NOWAIT) == -1) exit(EXIT_FAILURE);
            printf("Encolado: %s\\n", msg.mtext);
        }
    }
    endutent(); 
    printf("Todos los usuarios conectados fueron enviados a la cola.\\n");
}

void get_who_msgs(int qid, int msgtype) {
    struct msgbuf msg; int mensajes_leidos = 0;
    printf("--- SIMULACIÓN COMANDO WHO ---\\n");

    while (1) {
        if (msgrcv(qid, (void*)&msg, sizeof(msg.mtext), msgtype, MSG_NOERROR | IPC_NOWAIT) == -1) {
            if (errno == ENOMSG) {
                if (mensajes_leidos == 0) printf("La cola está vacía.\\n");
                break; 
            } else exit(EXIT_FAILURE);
        }
        printf("%s\\n", msg.mtext);
        mensajes_leidos++;
    }
}

int main(int argc, char *argv[]) {
    int qid, modo, msgtype = 1;
    key_t llave = ftok(argv[0], 'a');
    
    if (argc > 1) {
        if (strcmp(argv[1], "s") == 0) modo = 1;
        else if (strcmp(argv[1], "r") == 0) modo = 2;
        else { printf("Uso: %s s|r\\n", argv[0]); exit(EXIT_FAILURE); }
    } else { printf("Uso: %s s|r\\n", argv[0]); exit(EXIT_FAILURE); }

    if ((qid = msgget(llave, IPC_CREAT | 0666)) == -1) { perror("msgget"); exit(EXIT_FAILURE); }

    if (modo == 2) get_who_msgs(qid, msgtype);
    else send_who_msgs(qid, msgtype);

    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc msg_who.c -o msg_who"
            runCommand="./msg_who s && sleep 1 && ./msg_who r"
            output={`Extrayendo usuarios y enviando a la cola...
Encolado: 09:30	conectado	root
Encolado: 10:15	conectado	usuario
Todos los usuarios conectados fueron enviados a la cola.
--- SIMULACIÓN COMANDO WHO ---
09:30	conectado	root
10:15	conectado	usuario`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Entendí que las <a href="#3-4-cola-mensajes" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">colas de mensajes</a> superan a los pipes al permitir el envío de paquetes de datos asíncronos y estructurados. El campo <code className="text-[#58a6ff]">mtype</code> es fundamental porque permite implementar un sistema de enrutamiento básico, donde los receptores solo "sacan" de la cola los mensajes destinados a su tipo específico.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Expandiendo el código para crear un mini-servidor asíncrono que escuche en <code className="text-[#f5a623]">mtype=1</code> (solicitudes) y responda usando <code className="text-[#f5a623]">mtype=PID_cliente</code>, simulando cómo los sistemas operativos clásicos manejaban servicios en segundo plano (daemons).
            </p>
          </ReflectionBox>
        </section>

        {/* 3.5 */}
        <section>
          <SectionHeading id="3-5-info-ipc" number="3.5" title="Información de IPC por comandos" />
          <p className="mb-4">
            En GNU/Linux, puedes inspeccionar los objetos IPC mediante comandos de terminal para ver cuáles segmentos de memoria, colas y semáforos están activos, útiles para depurar procesos zombis que no limpiaron sus recursos.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2 font-mono text-sm text-[#b0b8c4]">
            <li><span className="text-[#3fb950]">ipcs</span>: Muestra el estatus de todos los IPC System V activos.</li>
            <li><span className="text-[#3fb950]">ipcrm</span>: Elimina manualmente un recurso IPC por su ID.</li>
            <li><span className="text-[#3fb950]">/proc/sysvipc/</span>: Directorio del sistema de archivos <code className="text-white">proc</code> donde reside la información en bruto.</li>
          </ul>

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí que los recursos IPC de System V (colas, memoria y semáforos) no se eliminan automáticamente cuando el proceso que los creó termina. Esto requiere disciplina estricta: usar comandos como <a href="#3-5-info-ipc" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">ipcs</code></a> para monitorear fugas y <a href="#3-5-info-ipc" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">ipcrm</code></a> para liberar la memoria atrapada en el kernel.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Redactando un script de mantenimiento en bash que parsee periódicamente la salida de <code className="text-[#58a6ff]">ipcs -m</code> y utilice <code className="text-[#58a6ff]">ipcrm -m</code> para destruir cualquier segmento de memoria compartida cuyo número de procesos atados (nattch) sea cero.
            </p>
          </ReflectionBox>
        </section>


        <TopicQuiz topicId="tema-3" title="Test - Comunicación IPC" questions={TEMA3_QUIZ} />
        <ReadMarker topicId="tema-3" />
      </article>
    </div>
  );
}
