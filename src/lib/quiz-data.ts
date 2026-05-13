import type { QuizQuestion } from "@/components/ui/TopicQuiz";

/* ── Tema 2: Procesos e Hilos ── */
export const TEMA2_QUIZ: QuizQuestion[] = [
  {
    id: "t2-q1",
    question: "Observa el siguiente código. ¿Cuántos procesos existen en total después de ejecutar las dos llamadas a fork()?",
    codeSnippet: `int main() {
    fork();
    fork();
    printf("Hola\\n");
    return 0;
}`,
    options: [
      "2 procesos",
      "3 procesos",
      "4 procesos",
      "8 procesos",
    ],
    correctIndex: 2,
    explanation:
      "El primer fork() crea 2 procesos. Cada uno ejecuta el segundo fork(), generando 2 procesos adicionales. Total: 4 procesos. Cada fork() duplica todos los procesos existentes: 1→2→4.",
  },
  {
    id: "t2-q2",
    question:
      "Un compañero reporta que su programa crea un proceso zombie. ¿Cuál es la línea problemática?",
    codeSnippet: `int main() {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Hijo terminó\\n");
        exit(0);
    } else {
        sleep(60);   // Línea 6
        exit(0);     // Línea 7
    }
}`,
    options: [
      "Línea 3: El hijo termina con exit(0) en vez de _exit(0)",
      "Línea 6: El padre duerme 60 segundos sin llamar a wait(), creando un zombie",
      "Línea 7: El padre debería usar return en vez de exit(0)",
      "Línea 1: Se debería verificar el error de fork() con == -1",
    ],
    correctIndex: 1,
    explanation:
      "Un zombie ocurre cuando el hijo termina pero el padre NO llama a wait(). Aquí el padre duerme 60 segundos sin esperar al hijo. Durante esos 60 segundos, el hijo está en estado zombie (<defunct>) en la tabla de procesos.",
  },
  {
    id: "t2-q3",
    question:
      "¿Cuál es la diferencia fundamental entre fork() y exec()?",
    options: [
      "fork() crea un nuevo proceso; exec() reemplaza la imagen del proceso actual con otro programa",
      "fork() es para procesos y exec() es para hilos",
      "fork() es más rápido que exec()",
      "Ambos crean nuevos procesos pero exec() lo hace de forma asíncrona",
    ],
    correctIndex: 0,
    explanation:
      "fork() DUPLICA el proceso actual (copia del espacio de direcciones). exec() REEMPLAZA la imagen del proceso actual con un nuevo programa — no crea un nuevo proceso, reutiliza el PID existente. El patrón clásico de Unix es fork()+exec().",
  },
  {
    id: "t2-q4",
    question:
      "Observa este programa con hilos. ¿Qué problema potencial tiene?",
    codeSnippet: `int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++)
        counter++;
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("Counter: %d\\n", counter);
}`,
    options: [
      "Falta -pthread al compilar",
      "counter no será 2,000,000 por una condición de carrera (race condition)",
      "pthread_join bloquea el hilo principal innecesariamente",
      "Se necesitan más de 2 hilos para paralelismo real",
    ],
    correctIndex: 1,
    explanation:
      "Ambos hilos acceden a 'counter' sin protección (mutex). La operación counter++ no es atómica: lee, incrementa y escribe. Cuando dos hilos lo hacen simultáneamente, se pierden incrementos. La solución: pthread_mutex_lock/unlock alrededor de counter++.",
  },
  {
    id: "t2-q5",
    question:
      "¿Qué retorna waitpid(-1, &status, WNOHANG) si no hay hijos terminados aún?",
    options: [
      "Retorna -1 con errno = ECHILD",
      "Se bloquea hasta que un hijo termine",
      "Retorna 0 (no hay hijos terminados pero sí hay hijos vivos)",
      "Retorna el PID del hijo más reciente",
    ],
    correctIndex: 2,
    explanation:
      "El flag WNOHANG hace que waitpid() NO se bloquee. Si hay hijos pero ninguno ha terminado, retorna 0. Si no hay hijos, retorna -1 con ECHILD. Sin WNOHANG, se bloquearía esperando.",
  },
  {
    id: "t2-q6",
    question: "¿Qué le sucede a un proceso hijo si su proceso padre termina antes que él (sin esperarlo con wait)?",
    options: [
      "El proceso hijo se convierte en un proceso zombie indefinidamente.",
      "El proceso hijo es destruido automáticamente por el sistema operativo.",
      "El proceso hijo queda huérfano y es adoptado por el proceso init (PID 1) o systemd.",
      "El proceso hijo se pausa hasta que el padre sea reiniciado."
    ],
    correctIndex: 2,
    explanation: "Cuando un padre termina antes que su hijo, el hijo se convierte en 'huérfano'. En Linux, el proceso init (o subreaper como systemd) automáticamente adopta a los procesos huérfanos y se encarga de recolectar su estado cuando terminen, evitando que se vuelvan zombies."
  },
  {
    id: "t2-q7",
    question: "Si tienes un programa que realiza cálculos matemáticos intensivos sin llamadas de I/O, ¿qué tipo de concurrencia te dará el mejor rendimiento en una CPU multi-núcleo?",
    options: [
      "Múltiples procesos pesados creados con fork()",
      "Múltiples hilos (threads) nivel usuario manejados por la librería de C",
      "Un solo proceso asíncrono manejado por eventos",
      "Múltiples hilos (threads) nivel kernel creados con pthread_create()"
    ],
    correctIndex: 3,
    explanation: "Para tareas CPU-bound en arquitecturas multi-núcleo, los hilos respaldados por el kernel (pthread) son la mejor opción. Permiten ejecución paralela real en diferentes núcleos compartiendo el espacio de memoria. Múltiples procesos también sirven, pero tienen mayor overhead en la creación y comunicación. La programación asíncrona es excelente para I/O-bound, pero no paralelaiza cálculos intensivos en CPU."
  }
];

/* ── Tema 3: IPC ── */
export const TEMA3_QUIZ: QuizQuestion[] = [
  {
    id: "t3-q1",
    question:
      "¿Cuál es la diferencia principal entre un pipe sin nombre y un FIFO?",
    options: [
      "Los pipes son más rápidos que los FIFOs",
      "Los FIFOs existen como archivos en el sistema de archivos, permitiendo comunicación entre procesos sin parentesco",
      "Los pipes son bidireccionales y los FIFOs unidireccionales",
      "Los FIFOs solo funcionan en System V, no en Linux",
    ],
    correctIndex: 1,
    explanation:
      "Los pipes solo funcionan entre procesos con relación padre-hijo (comparten los file descriptors del fork). Los FIFOs (named pipes) se crean con mkfifo() como archivos especiales en el filesystem, permitiendo que cualquier proceso los abra por nombre.",
  },
  {
    id: "t3-q2",
    question:
      "Un proceso crea un segmento de memoria compartida con shmget() pero olvida llamar a shmctl(IPC_RMID). ¿Qué sucede?",
    options: [
      "La memoria se libera automáticamente cuando el proceso termina",
      "El segmento persiste en el kernel hasta un reboot o hasta eliminarse con ipcrm",
      "Se genera un segfault al terminar el proceso",
      "Otro proceso no puede acceder al segmento",
    ],
    correctIndex: 1,
    explanation:
      "Los recursos IPC de System V (semáforos, memoria compartida, colas de mensajes) persisten más allá de la vida del proceso que los creó. Deben eliminarse explícitamente con xxxctl(IPC_RMID) o con el comando 'ipcrm'. Se pueden inspeccionar con 'ipcs'.",
  },
  {
    id: "t3-q3",
    question:
      "Observa este código. ¿Por qué el read() del hijo se bloquea indefinidamente?",
    codeSnippet: `int main() {
    int fd[2];
    pipe(fd);
    
    if (fork() == 0) {
        // Hijo: intenta leer
        char buf[100];
        read(fd[0], buf, 100);  // Se bloquea aquí
        printf("Recibido: %s\\n", buf);
    } else {
        // Padre: escribe
        write(fd[1], "Hello", 6);
        wait(NULL);
    }
}`,
    options: [
      "El padre no escribió suficientes bytes",
      "El hijo no cerró fd[1] — el kernel cree que aún podría recibir datos",
      "Falta un flush() después del write()",
      "El buffer es demasiado grande",
    ],
    correctIndex: 1,
    explanation:
      "El hijo hereda ambos extremos del pipe (fd[0] y fd[1]). Como el hijo no cerró fd[1], el kernel ve que todavía hay un escritor (el propio hijo) y el read() espera indefinidamente. Regla de oro: SIEMPRE cerrar el extremo del pipe que no usas.",
  },
  {
    id: "t3-q4",
    question:
      "¿Qué mecanismo IPC es el más rápido y por qué?",
    options: [
      "Pipes, porque son el más simple y con menos overhead",
      "Colas de mensajes, porque el kernel optimiza el enrutamiento",
      "Memoria compartida, porque no hay copia de datos entre kernel y espacio de usuario",
      "Señales, porque solo transmiten un número entero",
    ],
    correctIndex: 2,
    explanation:
      "La memoria compartida (shmem) es el IPC más rápido porque ambos procesos acceden directamente a la misma región de memoria sin copy_to_user/copy_from_user. Los pipes y colas involucran copiar datos al kernel y luego al otro proceso (doble copia).",
  },
  {
    id: "t3-q5",
    question: "¿Qué sucede si un proceso intenta hacer write() en una tubería (pipe) cuyo extremo de lectura (read) ha sido cerrado por todos los otros procesos?",
    options: [
      "La llamada write() bloquea al proceso hasta que alguien vuelva a abrir el pipe para lectura.",
      "La llamada write() falla silenciosamente retornando 0 bytes escritos.",
      "El kernel envía la señal SIGPIPE al proceso escritor, lo que por defecto lo termina.",
      "Los datos se guardan en el buffer del kernel indefinidamente."
    ],
    correctIndex: 2,
    explanation: "Escribir en un pipe sin lectores vivos genera una señal SIGPIPE. El comportamiento por defecto de SIGPIPE es terminar el proceso. Para evitar que tu programa se cierre de golpe (crash), debes ignorar SIGPIPE o manejar el error (-1 y errno=EPIPE)."
  },
  {
    id: "t3-q6",
    question: "En un escenario clásico de Productor-Consumidor usando memoria compartida, ¿por qué es ABSOLUTAMENTE necesario el uso de semáforos?",
    options: [
      "Porque los semáforos aceleran la lectura de la memoria RAM.",
      "Porque garantizan exclusión mutua, evitando que el productor sobrescriba datos antes de que el consumidor los lea, o que ambos lean/escriban a la vez.",
      "Porque la memoria compartida no funciona sin al menos un semáforo inicializado.",
      "Para contar cuántos procesos están actualmente ejecutándose en el sistema."
    ],
    correctIndex: 1,
    explanation: "La memoria compartida no tiene mecanismos de sincronización integrados. Si ambos acceden simultáneamente, ocurre una condición de carrera (race condition). Los semáforos actúan como candados para garantizar Exclusión Mutua (mutex) y también para sincronizar el estado (ej. esperar si el buffer está vacío/lleno)."
  }
];
