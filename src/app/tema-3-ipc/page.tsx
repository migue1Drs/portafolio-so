import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { PipeAnimation } from "@/components/ui/PipeAnimation";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA3_QUIZ } from "@/lib/quiz-data";

export default function Tema3Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 3"
        title="Mecanismos de comunicación entre procesos — IPC"
        description="Estudio de los mecanismos fundamentales para el intercambio de datos y sincronización entre procesos: tuberías (pipes), FIFOs, semáforos, memoria compartida y colas de mensajes."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* Intro */}
        <section>
          <p className="mb-4">
            Todos los procesos, parientes o no, necesitan en ocasiones comunicarse entre sí. Para esto, el sistema brinda formas básicas de comunicación como <strong className="text-white">stream</strong> (pipe, fifo y sockets) y <strong className="text-white">mensajes</strong> (colas de mensajes y sockets datagramas).
          </p>
          <p>
            Si los procesos son parientes, la comunicación se puede realizar por medio de una tubería o pipe, y si se necesita proteger el medio de comunicación se pueden utilizar mecanismos de sincronización, ya sea implementados como unidades que requieren una llave para poder accesar a los recursos compartidos (System V) o sin utilizar llaves por medio de llamados a funciones POSIX.
          </p>
        </section>

        {/* 3.1 */}
        <section>
          <SectionHeading id="3-1-tuberias" number="3.1" title="Comunicación mediante tuberías" />
          <p className="mb-4">
            La comunicación entre procesos es fundamental para que intercambien datos. Hay que tener en consideración, en primer lugar, si los procesos se van a comunicar en la misma máquina y si están emparentados, y segundo, si estos van a comunicar desde máquinas diferentes.
          </p>
          <p>
            Las tuberías son mecanismos clásicos de comunicación entre dos o más procesos emparentados y en la misma máquina. La teoría que se muestra está basada en las facilidades de comunicación entre procesos de los sistemas UNIX System V y derivados.
          </p>
          <div className="my-8">
            <PipeAnimation />
          </div>
        </section>

        {/* 3.1.1 */}
        <section>
          <SectionHeading id="3-1-1-pipe" number="3.1.1" title="Tuberías sin nombre — pipe" />
          <p className="mb-4">
            Las tuberías sin nombre, también llamadas <strong className="text-white">pipe</strong>, son viejas formas de IPC y son proporcionados por todos los sistemas UNIX y derivados. Presentan dos limitaciones:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-6 ml-2">
            <li>Los datos fluyen en una sola dirección (unidireccional).</li>
            <li>Pueden usarse sólo entre procesos que tienen un ancestro en común (relación de parentesco).</li>
          </ol>

          <p className="mb-6">
            Una tubería sin nombre se crea llamando a la función <code className="text-[#f5a623]">pipe()</code> o <code className="text-[#f5a623]">pipe2()</code>. El valor retornado es 0 si todo está correcto y -1 si existe un error. Los dos descriptores son retornados a través del argumento <code className="text-[#58a6ff]">filedes</code>:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 ml-2 font-mono text-sm">
            <li><code className="text-[#3fb950]">filedes[0]</code>: Se utiliza para abrir la tubería para <strong className="text-white">lectura</strong>.</li>
            <li><code className="text-[#3fb950]">filedes[1]</code>: Se utiliza para abrir la tubería para <strong className="text-white">escritura</strong>.</li>
          </ul>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo 1: Tubería del padre al hijo</h3>
          <CopyCodeBlock 
            filename="pipe_padre_hijo.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#define MAXLINEA 80

int main ()
{
 int n, fd[2];
 pid_t hijo;
 char linea [MAXLINEA];
 
 if (pipe(fd) < 0) {
  fprintf (stderr, "error de pipe");
  exit(0);
 }
 
 if ( (hijo = fork() ) < 0) {
  fprintf (stderr, "error de fork");
  exit(EXIT_FAILURE);
 }
 else if (hijo > 0)
 { /* padre */
  close (fd[0]);
  write (fd[1], "hola mundo\\n", 12);
 }
 else { /* hijo */
  close (fd[1]);
  n = read (fd[0], linea, MAXLINEA);
  write (STDOUT_FILENO, linea, n);
 }
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc pipe_padre_hijo.c -o pipe1"
            runCommand="./pipe1"
            output={`hola mundo`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo 2: Tubería del hijo al padre</h3>
          <CopyCodeBlock 
            filename="pipe_hijo_padre.c" 
            language="C" 
            code={`#include <unistd.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <stdio.h>
#define MAXLINE 80

int main ()
{
 int n, fd[2];
 pid_t hijo;
 char linea[MAXLINE];
 
 if (pipe(fd) < 0) { 
  fprintf (stderr,"error de tubería"); 
  exit(EXIT_FAILURE); 
 }
 
 if ( (hijo=fork()) == 0)
 { /* hijo escribe */
  close (fd[0]);
  write (fd[1], "hola mundo \\n", 12);
 }
 else
 { /* padre lee */
  close (fd[1]);
  n = read (fd[0], linea, MAXLINE);
  write (STDOUT_FILENO, linea, n);
  printf("numero de lineas %d \\n", n);
 }
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc pipe_hijo_padre.c -o pipe2"
            runCommand="./pipe2"
            output={`hola mundo 
numero de lineas 12 `}
          />
        </section>

        {/* 3.1.2 */}
        <section>
          <SectionHeading id="3-1-2-fifo" number="3.1.2" title="Tuberías con nombre — fifo" />
          <p className="mb-4">
            El sistema de llamado <code className="text-[#f5a623]">mkfifo()</code> permite crear un archivo especial llamado FIFO, el cual es una tubería con un nombre asociado en el sistema de archivos. A diferencia de las pipes anónimas, las FIFOs permiten la comunicación entre procesos que <strong className="text-white">no tienen relación padre-hijo</strong>.
          </p>
          <p className="mb-6">
            Abrir un FIFO para leer normalmente bloquea hasta que algún otro proceso abre el mismo FIFO para escribir, y viceversa.
          </p>

          <CopyCodeBlock 
            filename="fifo_comunicacion.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main (void)
{
 pid_t hijo;
 int file;
 char mensaje[20];
 unlink("namepipe"); 
 umask(~0666); 
 
 if(mkfifo("namepipe", 0666) == -1)
 {
  perror("error en mkfifo");
  exit(EXIT_FAILURE);
 }
 
 if ( (hijo=fork ( )) == 0)
 {
  fprintf (stdout,"soy el hijo, ID=%ld\\n", (long)getpid());
  if( (file=open("namepipe", O_WRONLY) ) == -1)
  {
   perror("error en open O_WRONLY");
   exit(EXIT_FAILURE);
  }
  write (file, "soy el hijo, ID...\\n", 20);
  close(file);
  exit(EXIT_SUCCESS);
 }
 
 if (hijo > 0)
 {
  fprintf (stdout,"soy el padre, ID = %ld\\n", (long)getpid());
  if((file=open("namepipe", O_RDONLY)) == -1)
  {
   perror("error en open O_RDONLY");
   exit(EXIT_FAILURE);
  }
  read(file, mensaje, 20);
  fprintf(stdout, "%s\\n", mensaje);
  close(file);
 }
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc fifo_comunicacion.c -o fifo_ex"
            runCommand="./fifo_ex"
            output={`soy el padre, ID = 16000
soy el hijo, ID=16001
soy el hijo, ID...`}
          />
        </section>

        {/* 3.2 */}
        <section>
          <SectionHeading id="3-2-system-v" number="3.2" title="Mecanismos IPC derivados de System V" />
          <p className="mb-4">
            El paquete de comunicación de System V se compone de tres mecanismos:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-6 ml-2">
            <li><strong className="text-white">Semáforos:</strong> Sincronización de procesos.</li>
            <li><strong className="text-white">Memoria compartida:</strong> Compartir espacio de direcciones virtuales.</li>
            <li><strong className="text-white">Colas de mensajes:</strong> Intercambio de datos con formato.</li>
          </ol>
          <p>
            Estos mecanismos comparten características como el uso de una <strong className="text-white">llave numérica</strong>, una tabla de entradas en el núcleo, registros de permisos y llamadas de control.
          </p>
        </section>

        {/* 3.2.1 */}
        <section>
          <SectionHeading id="3-2-1-llaves" number="3.2.1" title="Llaves" />
          <p className="mb-4">
            Una llave es una variable de tipo <code className="text-[#58a6ff]">key_t</code> (típicamente un entero de 32 bits) usada para acceder a mecanismos IPC. En GNU C, se crean utilizando la función <code className="text-[#f5a623]">ftok()</code>.
          </p>
          
          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-md mb-6 max-w-xl">
            <h4 className="text-[#58a6ff] font-mono text-sm mb-2">PROTOTIPO DE FTOK</h4>
            <code className="text-xs font-mono text-[#b0b8c4]">
              #include &lt;sys/types.h&gt;<br/>
              #include &lt;sys/ipc.h&gt;<br/><br/>
              key_t ftok(const char *pathname, int proj_id);
            </code>
          </div>

          <p>
            La implementación de <code className="text-[#f5a623]">ftok()</code> combina los 8 bits menos significativos de <code className="text-[#58a6ff]">proj_id</code> con el número de i-nodo del archivo y el número menor del dispositivo para generar una llave única de 32 bits.
          </p>
        </section>

        {/* 3.2.2 */}
        <section>
          <SectionHeading id="3-2-2-semaforos" number="3.2.2" title="Semáforos en derivados de System V" />
          <p className="mb-4">
            Los semáforos sincronizan el acceso a recursos compartidos. En System V, un semáforo no es un simple valor, sino un <strong className="text-white">conjunto de valores</strong> gestionados de forma atómica por el kernel.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Operación con semop()</h3>
          <p className="mb-4">
            La función <code className="text-[#f5a623]">semop()</code> realiza operaciones atómicas sobre los semáforos. Las banderas reconocidas en <code className="text-[#58a6ff]">sem_flg</code> son:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-2">
            <li><strong className="text-white">IPC_NOWAIT:</strong> Interrumpe la llamada si la operación no puede realizarse inmediatamente.</li>
            <li><strong className="text-white">SEM_UNDO:</strong> Registra la operación para anularla automáticamente si el proceso finaliza.</li>
          </ul>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Control con semctl()</h3>
          <p className="mb-4">
            La función <code className="text-[#f5a623]">semctl()</code> permite administrar el grupo de semáforos (inicializar, consultar, modificar y eliminar). Comandos comunes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded text-sm">
              <span className="text-[#58a6ff] font-mono">SETVAL</span>: Inicializa un semáforo a un valor.
            </div>
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded text-sm">
              <span className="text-[#58a6ff] font-mono">IPC_RMID</span>: Elimina el conjunto de semáforos.
            </div>
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded text-sm">
              <span className="text-[#58a6ff] font-mono">GETVAL</span>: Lee el valor actual de un semáforo.
            </div>
            <div className="bg-[#161b22] border border-[#30363d] p-3 rounded text-sm">
              <span className="text-[#58a6ff] font-mono">IPC_STAT</span>: Obtiene información del grupo.
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Sincronización Padre-Hijo (System V)</h3>
          <CopyCodeBlock 
            filename="semaforos_v.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <unistd.h>
#define SEM_HIJO 0
#define SEM_PADRE 1

int main (int argc, char *argv[])
{
 int i=5, semid;
 pid_t pid;
 struct sembuf operacion;
 key_t llave;
 llave = ftok (argv[0], 'a');
 
 if ( (semid = semget (llave, 2, IPC_CREAT|0600)) == -1) {
  perror ("semget"); exit (-1);
 }
 
 semctl (semid, SEM_HIJO, SETVAL, 0); // hijo empieza cerrado
 semctl (semid, SEM_PADRE, SETVAL, 1); // padre empieza abierto
 
 if ( (pid = fork()) == -1) {
  perror ("fork"); exit (EXIT_FAILURE);
 }
 else if (pid == 0) {
  while (i > 0) {
   operacion.sem_num = SEM_HIJO;
   operacion.sem_op = -1; operacion.sem_flg = 0;
   semop (semid, &operacion, 1); // espera al hijo
   printf ("Proceso hijo: %d\\n", i--);
   operacion.sem_num = SEM_PADRE;
   operacion.sem_op = 1;
   semop (semid, &operacion, 1); // libera al padre
  }
  semctl (semid, 0, IPC_RMID, 0);
 }
 else {
  while (i > 0) {
   operacion.sem_num = SEM_PADRE;
   operacion.sem_op = -1; operacion.sem_flg = 0;
   semop (semid, &operacion, 1); // espera al padre
   printf ("Proceso padre: %d\\n", i--);
   operacion.sem_num = SEM_HIJO;
   operacion.sem_op = 1;
   semop (semid, &operacion, 1); // libera al hijo
  }
  wait(NULL);
  semctl (semid, 0, IPC_RMID, 0);
 }
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc semaforos_v.c -o sem_v"
            runCommand="./sem_v"
            output={`Proceso padre: 5
Proceso hijo: 5
Proceso padre: 4
Proceso hijo: 4
Proceso padre: 3
Proceso hijo: 3`}
          />
        </section>

        {/* 3.2.3 */}
        <section>
          <SectionHeading id="3-2-3-semaforos-posix" number="3.2.3" title="Semáforos en POSIX" />
          <p className="mb-4">
            Los semáforos POSIX ofrecen una interfaz más simple y moderna. Se utilizan funciones como <code className="text-[#f5a623]">sem_init()</code>, <code className="text-[#f5a623]">sem_wait()</code> (cerrar/bloquear) y <code className="text-[#f5a623]">sem_post()</code> (abrir/desbloquear).
          </p>

          <CopyCodeBlock 
            filename="semaforos_posix.c" 
            language="C" 
            code={`#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#define VALOR 1000

int contador=0;
sem_t semaforo;

void *funcion1 (void *valor) {
 for (int i=0; i<VALOR; i++) {
  sem_wait(&semaforo);
  contador+=1;
  sem_post(&semaforo);
 }
 pthread_exit(NULL);
}

void *funcion2 (void *valor) {
 for (int i=0; i<VALOR; i++) {
  sem_wait(&semaforo);
  contador-=1;
  sem_post(&semaforo);
 }
 pthread_exit(NULL);
}

int main () {
 pthread_t hilo1, hilo2;
 sem_init(&semaforo, 0, 1); // semáforo entre hilos, valor inicial 1
 pthread_create(&hilo1, NULL, funcion1, NULL);
 pthread_create(&hilo2, NULL, funcion2, NULL);
 pthread_join(hilo1, NULL);
 pthread_join(hilo2, NULL);
 printf("Valor final de Contador = %d\\n", contador);
 sem_destroy(&semaforo);
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc semaforos_posix.c -lpthread -o sem_posix"
            runCommand="./sem_posix"
            output={`Valor final de Contador = 0`}
          />
        </section>

        {/* 3.2.3.1 */}
        <section>
          <SectionHeading id="3-2-3-1-mutex" number="3.2.3.1" title="Sincronización de hilos usando mutex" />
          <p className="mb-4">
            Los <strong className="text-white">mutex</strong> (mutual exclusion) son semáforos binarios optimizados para hilos. El flujo básico es:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-6 ml-2 text-sm">
            <li>Inicializar con <code className="text-[#58a6ff]">pthread_mutex_init()</code>.</li>
            <li>Bloquear antes de entrar a la sección crítica con <code className="text-[#58a6ff]">pthread_mutex_lock()</code>.</li>
            <li>Desbloquear al salir con <code className="text-[#58a6ff]">pthread_mutex_unlock()</code>.</li>
          </ol>

          <CopyCodeBlock 
            filename="hilos_mutex.c" 
            language="C" 
            code={`#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

pthread_mutex_t EM;
int recurso_compartido = 0;

void *funcion (void *id) {
 pthread_mutex_lock(&EM);
 recurso_compartido++;
 printf("Hilo %ld en sección crítica. Recurso: %d\\n", (long)id, recurso_compartido);
 pthread_mutex_unlock(&EM);
 pthread_exit(NULL);
}

int main () {
 pthread_t hilos[2];
 pthread_mutex_init(&EM, NULL);
 for(long i=0; i<2; i++) pthread_create(&hilos[i], NULL, funcion, (void*)i);
 for(int i=0; i<2; i++) pthread_join(hilos[i], NULL);
 pthread_mutex_destroy(&EM);
 return EXIT_SUCCESS;
}`} 
            compileCommand="gcc hilos_mutex.c -lpthread -o mutex_ex"
            runCommand="./mutex_ex"
            output={`Hilo 0 en sección crítica. Recurso: 1
Hilo 1 en sección crítica. Recurso: 2`}
          />
        </section>

        {/* 3.3 */}
        <section>
          <SectionHeading id="3-3-memoria" number="3.3" title="Memoria compartida" />
          <p className="mb-4">
            Es la forma más rápida de comunicar dos procesos, permitiéndoles compartir una zona de memoria física en sus espacios de direcciones virtuales.
          </p>
          <ul className="list-disc list-inside space-y-2 mb-6 ml-2">
            <li><code className="text-[#f5a623]">shmget()</code>: Crea o habilita el acceso a la zona.</li>
            <li><code className="text-[#f5a623]">shmat()</code>: Une (ata) el segmento al proceso.</li>
            <li><code className="text-[#f5a623]">shmdt()</code>: Separa (desata) el segmento.</li>
            <li><code className="text-[#f5a623]">shmctl()</code>: Operaciones de control (borrado con <code className="text-[#ff5f56]">IPC_RMID</code>).</li>
          </ul>
        </section>

        {/* 3.4 */}
        <section>
          <SectionHeading id="3-4-cola-mensajes" number="3.4" title="Cola de mensajes" />
          <p className="mb-4">
            Permiten el intercambio de datos con un formato determinado (estructuras de mensajes) mediante identificadores de tipo, lo que permite filtrar qué mensajes leer.
          </p>

          <CopyCodeBlock 
            filename="mcola.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/msg.h>
#include <errno.h>

struct msgbuf {
 long mtype;
 char mtext[80];
};

int main(int argc, char *argv[]) {
 int qid;
 key_t llave = ftok(argv[0], 'a');
 struct msgbuf msg;
 
 qid = msgget(llave, IPC_CREAT | 0666);
 
 if (argc > 1 && strcmp(argv[1], "s") == 0) {
  msg.mtype = 1;
  time_t t = time(NULL);
  snprintf(msg.mtext, 80, "Mensaje enviado a las: %s", ctime(&t));
  msgsnd(qid, &msg, 80, IPC_NOWAIT);
  printf("Enviado: %s", msg.mtext);
 } else {
  if (msgrcv(qid, &msg, 80, 1, IPC_NOWAIT) != -1)
   printf("Recibido: %s", msg.mtext);
  else
   printf("No hay mensajes disponibles.\\n");
 }
 return 0;
}`} 
            compileCommand="gcc mcola.c -o mcola"
            runCommand="./mcola s"
            output={`Enviado: Mensaje enviado a las: Wed May 13 17:30:00 2026`}
          />
        </section>

        {/* 3.5 */}
        <section>
          <SectionHeading id="3-5-info-ipc" number="3.5" title="Información de IPC por medio de comandos del sistema" />
          <p className="mb-4">
            En GNU/Linux se utiliza el comando <code className="text-[#f5a623]">ipcs</code> para obtener información de los objetos IPC activos (colas, memoria, semáforos).
          </p>
          <p className="mb-4">
            También se puede consultar el directorio <code className="text-[#58a6ff]">/proc/sysvipc</code>, donde residen archivos con el estado actual de los mecanismos System V.
          </p>

          <div className="bg-[#090c10] border border-[#30363d] p-4 rounded-xl font-mono text-xs text-[#8b949e]">
            <p className="text-[#3fb950] mb-2">$ ipcs</p>
            <p>------ Message Queues --------</p>
            <p>key        msqid      owner      perms      used-bytes   messages</p>
            <p className="mt-2">---- Segmentos memoria compartida ----</p>
            <p>key        shmid      owner      perms      bytes      nattch     status</p>
            <p>0x00000000 884743     user       600        1048576    2          dest</p>
            <p className="mt-2">------ Matrices semáforo -------</p>
            <p>key        semid      owner      perms      nsems</p>
          </div>
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> En esta etapa completé el estudio de la comunicación entre procesos, abordando no solo el flujo de datos (tuberías y colas) sino también la sincronización crítica. Aprendí la diferencia fundamental entre los semáforos de System V (más complejos y potentes) y los de POSIX (más ligeros), así como el uso de variables <code className="text-[#f5a623]">mutex</code> para la exclusión mutua en hilos.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorar?</strong> Podría desarrollar una aplicación pequeña que utilice colas de mensajes para implementar un sistema de chat local entre dos procesos independientes, practicando el filtrado por tipos de mensaje (<code className="text-[#f5a623]">mtype</code>).
          </p>
        </ReflectionBox>

        <TopicQuiz
          topicId="tema-3"
          title="Test — Mecanismos IPC"
          questions={TEMA3_QUIZ}
        />

        <ReadMarker topicId="tema-3" />

      </article>
    </div>
  );
}
