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
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Aprendí a usar las diferentes técnicas de IPC. Entendí cómo funcionan los <code className="text-[#f5a623]">pipes</code> (para procesos con parentesco) y <code className="text-[#f5a623]">fifos</code>. Además, pude distinguir entre las API antiguas de <code className="text-[#58a6ff]">System V</code>, que requieren la manipulación de llaves con <code className="text-[#f5a623]">ftok()</code> y persisten en memoria, versus los modernos y más directos semáforos/mutex de <code className="text-[#58a6ff]">POSIX</code>. La manipulación de colas de mensajes y memoria compartida demuestran cómo el kernel facilita un pasillo de comunicación altamente optimizado.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorarla?</strong> Se podría mejorar elaborando un proyecto de chat local multiproceso, usando Memoria Compartida para el buffer central y Semáforos para evitar condiciones de carrera al leer/escribir mensajes.
          </p>
        </ReflectionBox>

        <TopicQuiz topicId="tema-3" title="Test - Comunicación IPC" questions={TEMA3_QUIZ} />
        <ReadMarker topicId="tema-3" />
      </article>
    </div>
  );
}
