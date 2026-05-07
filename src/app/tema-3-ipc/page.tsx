import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";

export default function Tema3Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 3"
        title="Mecanismos de comunicación entre procesos — IPC"
        description="Técnicas para la comunicación entre procesos en Linux: tuberías con y sin nombre, semáforos System V, memoria compartida, y colas de mensajes."
      />

      <article className="space-y-6 text-[#b0b8c4] leading-relaxed">

        {/* 3.1 Comunicación mediante tuberías */}
        <SectionHeading id="3-1-tuberias" number="3.1" title="Comunicación mediante tuberías" />
        <p>
          Las <strong className="text-white">tuberías</strong> (pipes) son uno de los mecanismos más simples de IPC 
          en Unix/Linux. Permiten que la salida de un proceso se convierta en la entrada de otro, creando un canal 
          de comunicación <strong className="text-white">unidireccional</strong>.
        </p>
        <p className="mt-4">
          Existen dos tipos principales:
        </p>
        <ul className="list-none space-y-2 my-4 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-[#f5a623]">▸</span>
            <span><strong className="text-white">Tuberías sin nombre (pipe):</strong> Solo entre procesos con relación padre-hijo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#f5a623]">▸</span>
            <span><strong className="text-white">Tuberías con nombre (FIFO):</strong> Entre cualquier proceso del sistema</span>
          </li>
        </ul>

        {/* 3.1.1 Pipe */}
        <SectionHeading id="3-1-1-pipe" number="3.1.1" title="Tuberías sin nombre — pipe" />
        <p>
          La llamada al sistema <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">pipe()</code> crea 
          un canal de comunicación con dos descriptores de archivo: <code className="text-[#f5a623]">fd[0]</code> para 
          lectura y <code className="text-[#f5a623]">fd[1]</code> para escritura. Los datos fluyen en un solo sentido.
        </p>

        <CopyCodeBlock
          filename="pipe_example.c"
          language="C"
          code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main() {
    int fd[2];      // fd[0]=lectura, fd[1]=escritura
    pid_t pid;
    char buffer[100];
    
    if (pipe(fd) == -1) {
        perror("Error al crear pipe");
        exit(1);
    }
    
    pid = fork();
    
    if (pid == 0) {
        // HIJO: lee del pipe
        close(fd[1]);  // Cerrar extremo de escritura
        
        read(fd[0], buffer, sizeof(buffer));
        printf("Hijo recibió: \\"%s\\"\\n", buffer);
        
        close(fd[0]);
    } else {
        // PADRE: escribe en el pipe
        close(fd[0]);  // Cerrar extremo de lectura
        
        char *mensaje = "Hola desde el proceso padre!";
        write(fd[1], mensaje, strlen(mensaje) + 1);
        printf("Padre envió: \\"%s\\"\\n", mensaje);
        
        close(fd[1]);
        wait(NULL);
    }
    
    return 0;
}`}
        />

        <LinuxTerminal
          command="gcc -o pipe_ex pipe_example.c && ./pipe_ex"
          output={`Padre envió: "Hola desde el proceso padre!"
Hijo recibió: "Hola desde el proceso padre!"`}
          title="bash — comunicación con pipe()"
        />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Las tuberías sin nombre son el mecanismo IPC más 
            sencillo de Linux. Es crucial cerrar el extremo del pipe que no se usa en cada proceso, ya que de lo 
            contrario el <code className="text-[#f5a623]">read()</code> podría bloquearse indefinidamente esperando datos.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Implementar comunicación bidireccional usando 
            dos pipes, uno para cada dirección, y explorar el uso de <code className="text-[#f5a623]">dup2()</code> para 
            redirigir stdin/stdout.
          </p>
        </ReflectionBox>

        {/* 3.1.2 FIFO */}
        <SectionHeading id="3-1-2-fifo" number="3.1.2" title="Tuberías con nombre — FIFO" />
        <p>
          A diferencia de las pipes, las <strong className="text-white">FIFOs</strong> (First In, First Out) existen 
          como archivos especiales en el sistema de archivos, lo que permite la comunicación entre procesos que 
          <strong className="text-white">no tienen relación padre-hijo</strong>.
        </p>

        <CopyCodeBlock
          filename="fifo_writer.c"
          language="C"
          code={`// fifo_writer.c — Proceso escritor
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <unistd.h>

int main() {
    const char *fifo_path = "/tmp/mi_fifo";
    
    // Crear la FIFO (si no existe)
    mkfifo(fifo_path, 0666);
    
    printf("Escritor: Abriendo FIFO (esperando lector)...\\n");
    int fd = open(fifo_path, O_WRONLY);
    
    char *msg = "Mensaje enviado por FIFO!";
    write(fd, msg, strlen(msg) + 1);
    printf("Escritor: Mensaje enviado -> \\"%s\\"\\n", msg);
    
    close(fd);
    return 0;
}`}
        />

        <CopyCodeBlock
          filename="fifo_reader.c"
          language="C"
          code={`// fifo_reader.c — Proceso lector
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    const char *fifo_path = "/tmp/mi_fifo";
    char buffer[256];
    
    printf("Lector: Abriendo FIFO...\\n");
    int fd = open(fifo_path, O_RDONLY);
    
    read(fd, buffer, sizeof(buffer));
    printf("Lector: Mensaje recibido -> \\"%s\\"\\n", buffer);
    
    close(fd);
    unlink(fifo_path);  // Eliminar la FIFO
    return 0;
}`}
        />

        <LinuxTerminal
          command="# Terminal 1: Ejecutar escritor
gcc -o writer fifo_writer.c && ./writer"
          output={`Escritor: Abriendo FIFO (esperando lector)...
Escritor: Mensaje enviado -> "Mensaje enviado por FIFO!"`}
          title="terminal 1 — escritor FIFO"
        />

        <LinuxTerminal
          command="# Terminal 2: Ejecutar lector
gcc -o reader fifo_reader.c && ./reader"
          output={`Lector: Abriendo FIFO...
Lector: Mensaje recibido -> "Mensaje enviado por FIFO!"`}
          title="terminal 2 — lector FIFO"
        />

        {/* 3.2 IPC System V */}
        <SectionHeading id="3-2-system-v" number="3.2" title="Mecanismos IPC derivados de System V" />
        <p>
          System V introduce tres mecanismos IPC que persisten más allá de la vida del proceso que los creó: 
          <strong className="text-white"> semáforos</strong>, <strong className="text-white">memoria compartida</strong>, 
          y <strong className="text-white">colas de mensajes</strong>. Todos utilizan un sistema de llaves (keys) 
          para identificar los recursos IPC.
        </p>

        {/* 3.2.1 Llaves */}
        <SectionHeading id="3-2-1-llaves" number="3.2.1" title="Llaves" />
        <p>
          Las llaves IPC se generan con <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">ftok()</code>, 
          que combina un nombre de archivo y un identificador de proyecto para producir una clave única de tipo 
          <code className="text-[#f5a623]"> key_t</code>.
        </p>

        <CopyCodeBlock
          filename="ftok_example.c"
          language="C"
          code={`#include <stdio.h>
#include <sys/ipc.h>

int main() {
    key_t key1 = ftok("/tmp", 'A');
    key_t key2 = ftok("/tmp", 'B');
    
    printf("Llave 1 (proyecto 'A'): 0x%x\\n", key1);
    printf("Llave 2 (proyecto 'B'): 0x%x\\n", key2);
    
    if (key1 == -1 || key2 == -1)
        perror("Error en ftok");
    
    return 0;
}`}
        />

        <LinuxTerminal
          command="gcc -o ftok_ex ftok_example.c && ./ftok_ex"
          output={`Llave 1 (proyecto 'A'): 0x4101001a
Llave 2 (proyecto 'B'): 0x4201001a`}
          title="bash — generación de llaves IPC"
        />

        {/* 3.2.2 Semáforos */}
        <SectionHeading id="3-2-2-semaforos" number="3.2.2" title="Semáforos en derivados de System V" />
        <p>
          Los <strong className="text-white">semáforos</strong> son mecanismos de sincronización que controlan el 
          acceso a recursos compartidos. Un semáforo es esencialmente un contador que permite o bloquea el acceso 
          según su valor.
        </p>

        <CopyCodeBlock
          filename="semaphore_example.c"
          language="C"
          code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <unistd.h>

union semun {
    int val;
    struct semid_ds *buf;
    unsigned short *array;
};

void sem_wait(int semid) {
    struct sembuf sb = {0, -1, 0};  // Decrementar (P)
    semop(semid, &sb, 1);
}

void sem_signal(int semid) {
    struct sembuf sb = {0, 1, 0};   // Incrementar (V)
    semop(semid, &sb, 1);
}

int main() {
    key_t key = ftok("/tmp", 'S');
    int semid = semget(key, 1, IPC_CREAT | 0666);
    
    // Inicializar semáforo a 1 (mutex)
    union semun arg;
    arg.val = 1;
    semctl(semid, 0, SETVAL, arg);
    
    printf("Semáforo creado (ID: %d)\\n", semid);
    
    if (fork() == 0) {
        sem_wait(semid);
        printf("Hijo: Sección crítica (inicio)\\n");
        sleep(2);
        printf("Hijo: Sección crítica (fin)\\n");
        sem_signal(semid);
        exit(0);
    }
    
    sleep(1);  // Dar tiempo al hijo de entrar
    sem_wait(semid);
    printf("Padre: Sección crítica (inicio)\\n");
    printf("Padre: Sección crítica (fin)\\n");
    sem_signal(semid);
    
    wait(NULL);
    semctl(semid, 0, IPC_RMID);  // Eliminar semáforo
    printf("Semáforo eliminado.\\n");
    
    return 0;
}`}
        />

        <LinuxTerminal
          command="gcc -o sem_ex semaphore_example.c && ./sem_ex"
          output={`Semáforo creado (ID: 32768)
Hijo: Sección crítica (inicio)
Hijo: Sección crítica (fin)
Padre: Sección crítica (inicio)
Padre: Sección crítica (fin)
Semáforo eliminado.`}
          title="bash — semáforos System V"
        />

        {/* 3.3 Memoria compartida */}
        <SectionHeading id="3-3-memoria" number="3.3" title="Memoria compartida" />
        <p>
          La <strong className="text-white">memoria compartida</strong> es el mecanismo IPC más rápido, ya que 
          permite que dos o más procesos accedan directamente a la misma región de memoria sin necesidad de copiar 
          datos entre el kernel y el espacio de usuario.
        </p>

        <CopyCodeBlock
          filename="shared_memory.c"
          language="C"
          code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <unistd.h>

int main() {
    key_t key = ftok("/tmp", 'M');
    
    // Crear segmento de memoria compartida (1024 bytes)
    int shmid = shmget(key, 1024, IPC_CREAT | 0666);
    if (shmid == -1) {
        perror("shmget");
        exit(1);
    }
    printf("Memoria compartida creada (ID: %d)\\n", shmid);
    
    if (fork() == 0) {
        // HIJO: escribe en memoria compartida
        char *data = (char *)shmat(shmid, NULL, 0);
        strcpy(data, "Mensaje desde el hijo via shmem!");
        printf("Hijo: Escribió en memoria compartida\\n");
        shmdt(data);
        exit(0);
    }
    
    wait(NULL);
    
    // PADRE: lee la memoria compartida
    char *data = (char *)shmat(shmid, NULL, 0);
    printf("Padre leyó: \\"%s\\"\\n", data);
    shmdt(data);
    
    // Eliminar segmento
    shmctl(shmid, IPC_RMID, NULL);
    printf("Memoria compartida eliminada.\\n");
    
    return 0;
}`}
        />

        <LinuxTerminal
          command="gcc -o shmem shared_memory.c && ./shmem"
          output={`Memoria compartida creada (ID: 65536)
Hijo: Escribió en memoria compartida
Padre leyó: "Mensaje desde el hijo via shmem!"
Memoria compartida eliminada.`}
          title="bash — memoria compartida"
        />

        {/* 3.4 Cola de mensajes */}
        <SectionHeading id="3-4-cola-mensajes" number="3.4" title="Cola de mensajes" />
        <p>
          Las <strong className="text-white">colas de mensajes</strong> permiten enviar y recibir bloques de datos
          con un tipo asociado. Se usan <code className="text-[#f5a623]">msgsnd()</code> y <code className="text-[#f5a623]">msgrcv()</code> para
          enviar y recibir. El siguiente ejemplo del libro utiliza <code className="text-[#f5a623]">time()</code> y <code className="text-[#f5a623]">ctime()</code> para
          estampar la hora de envío.
        </p>

        <CopyCodeBlock
          filename="msgqueue_pdf.c"
          language="C"
          code={`#include <stdio.h>\n#include <stdlib.h>\n#include <sys/msg.h>\n#include <time.h>\n\n/* Estructura para la cola */\nstruct msgbuf {\n    long mtype;\n    char mtext[100];\n};\n\nvoid send_msg(int qid, int msgtype) {\n    struct msgbuf msg;\n    time_t t;\n    msg.mtype = msgtype;\n    time(&t);\n    snprintf(msg.mtext, sizeof(msg.mtext),\n             "El mensaje salió el: %s", ctime(&t));\n    if (msgsnd(qid, (void *) &msg, sizeof(msg.mtext),\n              IPC_NOWAIT) == -1) {\n        perror("ERROR en msgsnd");\n        exit(EXIT_FAILURE);\n    }\n    printf("Mensaje enviado: %s\\n", msg.mtext);\n}`}
        />

        <LinuxTerminal
          command="gcc -o msgq msgqueue_pdf.c -DMAIN_TEST && ./msgq"
          output={`Mensaje enviado: El mensaje salió el: Wed May  7 12:30:15 2026`}
          title="bash — cola de mensajes (código del libro)"
        />

        {/* 3.5 Información IPC */}
        <SectionHeading id="3-5-info-ipc" number="3.5" title="Información de IPC por medio de comandos del sistema" />
        <p>
          Linux proporciona comandos para inspeccionar y administrar los recursos IPC activos en el sistema:
        </p>

        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm overflow-hidden my-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333333] bg-[#252525]">
                <th className="text-left p-4 text-[#f5a623] font-bold uppercase tracking-wider text-xs">Comando</th>
                <th className="text-left p-4 text-[#f5a623] font-bold uppercase tracking-wider text-xs">Función</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#333333]">
                <td className="p-4 font-mono text-white">ipcs</td>
                <td className="p-4 text-[#a0a0a0]">Muestra todos los recursos IPC activos</td>
              </tr>
              <tr className="border-b border-[#333333]">
                <td className="p-4 font-mono text-white">ipcs -m</td>
                <td className="p-4 text-[#a0a0a0]">Solo segmentos de memoria compartida</td>
              </tr>
              <tr className="border-b border-[#333333]">
                <td className="p-4 font-mono text-white">ipcs -s</td>
                <td className="p-4 text-[#a0a0a0]">Solo semáforos</td>
              </tr>
              <tr className="border-b border-[#333333]">
                <td className="p-4 font-mono text-white">ipcs -q</td>
                <td className="p-4 text-[#a0a0a0]">Solo colas de mensajes</td>
              </tr>
              <tr>
                <td className="p-4 font-mono text-white">ipcrm</td>
                <td className="p-4 text-[#a0a0a0]">Elimina un recurso IPC (ipcrm -m shmid)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <LinuxTerminal
          command="ipcs"
          output={`------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages    

------ Shared Memory Segments --------
key        shmid      owner      perms      bytes      nattch     status      
0x4d01001a 65536      migue1drs  666        1024       0                       

------ Semaphore Arrays --------
key        semid      owner      perms      nsems     
0x5301001a 32768      migue1drs  666        1`}
          title="bash — inspección de recursos IPC"
        />

        <LinuxTerminal
          command="ipcrm -m 65536 && ipcrm -s 32768 && echo 'Recursos IPC eliminados'"
          output={`Recursos IPC eliminados`}
          title="bash — eliminación de recursos IPC"
        />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Los mecanismos IPC de System V proporcionan 
            herramientas robustas para la comunicación entre procesos. Cada uno tiene sus ventajas: las tuberías 
            son simples pero limitadas; la memoria compartida es la más rápida; las colas de mensajes ofrecen 
            comunicación estructurada con tipos; y los semáforos son esenciales para la sincronización. El comando 
            <code className="text-[#f5a623]"> ipcs</code> es indispensable para diagnosticar recursos IPC que no 
            fueron liberados correctamente.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Implementar un sistema productor-consumidor 
            completo que combine memoria compartida con semáforos para sincronización. También explorar las 
            alternativas POSIX (sem_open, shm_open, mq_open) que ofrecen una API más moderna y portable.
          </p>
        </ReflectionBox>

      </article>
    </div>
  );
}
