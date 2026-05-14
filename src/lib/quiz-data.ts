import type { QuizQuestion } from "@/components/ui/TopicQuiz";

/* ── Tema 1: Introducción a los SO ── */
export const TEMA1_QUIZ: QuizQuestion[] = [
  {
    id: "t1-q1",
    question: "¿Cuál es una de las definiciones de un sistema operativo?",
    options: [
      "Un software diseñado exclusivamente para interactuar con la red.",
      "Un software que controla el hardware y actúa como interfaz entre el usuario y la computadora.",
      "Un programa que compila código en lenguaje ensamblador.",
      "Un sistema para la creación de bases de datos relacionales."
    ],
    correctIndex: 1,
    explanation: "El sistema operativo es el software fundamental que controla la ejecución de programas y actúa como interfaz entre el usuario y el hardware."
  },
  {
    id: "t1-q2",
    question: "¿Qué tipo de sistema operativo prioriza el cumplimiento de restricciones temporales estrictas sobre la interacción con el usuario?",
    options: [
      "Sistema operativo de red",
      "Sistema operativo por lotes",
      "Sistema operativo de tiempo real",
      "Sistema operativo distribuido"
    ],
    correctIndex: 2,
    explanation: "Los sistemas de tiempo real (como VxWorks o RTLinux) buscan un comportamiento determinista, donde el tiempo de respuesta es crítico."
  },
  {
    id: "t1-q3",
    question: "¿Cuál es la diferencia principal entre sistemas distribuidos fuertemente acoplados y débilmente acoplados?",
    options: [
      "Los fuertemente acoplados comparten memoria principal y reloj global, los débilmente acoplados no.",
      "Los débilmente acoplados son más rápidos que los fuertemente acoplados.",
      "Los débilmente acoplados solo funcionan en dispositivos móviles.",
      "No existe diferencia, son sinónimos."
    ],
    correctIndex: 0,
    explanation: "En sistemas fuertemente acoplados, los procesadores comparten memoria y reloj, mientras que en los débilmente acoplados cada uno tiene su propia memoria local."
  },
  {
    id: "t1-q4",
    question: "¿Qué característica destacaba de la arquitectura de iOS?",
    options: [
      "No posee kernel, se comunica directamente con el hardware.",
      "Utiliza una máquina virtual llamada Dalvik.",
      "Se divide en capas: Aplicaciones, Middleware (Cocoa Touch, Media, Core Services) y Kernel (XNU).",
      "Está basado en la arquitectura de Windows CE."
    ],
    correctIndex: 2,
    explanation: "iOS se basa en XNU/Mac OS X y su arquitectura en capas incluye Middleware (Cocoa Touch, Core Services) y Kernel."
  },
];/* ── Tema 2: Procesos e Hilos ── */
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

/* ── Tema 5: Administración de memoria ── */
export const TEMA5_QUIZ: QuizQuestion[] = [
  {
    id: "t5-q1",
    question: "¿Cuál es la función de la Unidad de Administración de Memoria (MMU)?",
    options: [
      "Asignar prioridad a los procesos en la cola de CPU",
      "Asociar las direcciones virtuales generadas por el programa con las direcciones físicas de la RAM",
      "Controlar la velocidad de transferencia entre el disco duro y la memoria principal",
      "Eliminar procesos inactivos para liberar espacio en el mapa de bits",
    ],
    correctIndex: 1,
    explanation:
      "La MMU es un chip (o parte de la CPU) que mapea direcciones virtuales a físicas. Gracias a ella, los programas pueden creer que tienen un espacio de direcciones continuo cuando en realidad está fragmentado en marcos de página físicos.",
  },
  {
    id: "t5-q2",
    question: "Si un proceso espera por E/S el 80% de su tiempo (p=0.8) y hay 3 procesos en memoria, ¿cuál es el porcentaje de uso de la CPU según el modelo probabilístico?",
    options: [
      "20%",
      "48.8%",
      "51.2%",
      "80%",
    ],
    correctIndex: 2,
    explanation:
      "La fórmula es CPU = 1 - p^n. En este caso: 1 - (0.8)^3 = 1 - 0.512 = 0.488 (o 48.8% de uso). La probabilidad de que los 3 esperen a la vez es 51.2%.",
  },
  {
    id: "t5-q3",
    question: "¿Qué algoritmo de asignación de memoria busca en toda la lista para encontrar el hueco más pequeño que sea suficiente?",
    options: [
      "Primer ajuste (First-fit)",
      "Siguiente ajuste (Next-fit)",
      "Mejor ajuste (Best-fit)",
      "Peor ajuste (Worst-fit)",
    ],
    correctIndex: 2,
    explanation:
      "El 'Mejor ajuste' recorre toda la lista para encontrar el hueco que más se aproxime al tamaño solicitado, intentando no desperdiciar huecos grandes para procesos pequeños.",
  },
  {
    id: "t5-q4",
    question: "¿Para qué sirven los registros 'base' y 'límite' en la multiprogramación con particiones fijas?",
    options: [
      "Para acelerar la velocidad del bus de datos",
      "Para resolver los problemas de reasignación y protección de memoria",
      "Para contar cuántas páginas han sido enviadas al swap",
      "Para permitir que un proceso crezca dinámicamente",
    ],
    correctIndex: 1,
    explanation:
      "El registro base permite que las direcciones relativas se conviertan en absolutas sumando el inicio de la partición. El registro límite asegura que un proceso no acceda a memoria fuera de su partición (protección).",
  },
  {
    id: "t5-q5",
    question: "En Linux, ¿qué indica un valor de 'swappiness' igual a 60?",
    options: [
      "Que el sistema usará el swap cuando la RAM llegue al 60% de ocupación",
      "Que el 60% de la memoria está reservada para el kernel",
      "Que cuando la RAM llegue al 40% de uso (60% libre), empezará a paginar al disco",
      "Que el archivo swapfile tiene un tamaño de 60 GB",
    ],
    correctIndex: 2,
    explanation:
      "El valor de swappiness (0-100) controla la agresividad del intercambio. Un valor de 60 (común en Ubuntu) indica que el sistema empezará a mover páginas al swap cuando la RAM disponible sea relativamente baja (aproximadamente al 40% de uso de RAM).",
  },
];

/* ── Tema 6: Sistema de Archivos ── */
export const TEMA6_QUIZ: QuizQuestion[] = [
  {
    id: "t6-q1",
    question: "¿Qué sección del sistema de archivos contiene metadatos como el tamaño, total de archivos y espacio libre?",
    options: [
      "Boot",
      "Superbloque",
      "Lista de Inodos",
      "Bloque de datos",
    ],
    correctIndex: 1,
    explanation:
      "El superbloque es la estructura fundamental que describe el estado global del sistema de archivos (tamaño, bloques libres, etc.).",
  },
  {
    id: "t6-q2",
    question: "¿Qué información NO se encuentra almacenada directamente en el inodo de un archivo?",
    options: [
      "Permisos de acceso",
      "Identificador del propietario (UID)",
      "El nombre del archivo",
      "Tamaño del archivo",
    ],
    correctIndex: 2,
    explanation:
      "El nombre del archivo no está en el inodo; se almacena en el directorio, el cual asocia nombres con números de inodo (enlaces).",
  },
  {
    id: "t6-q3",
    question: "¿Cuál es la función del 'Major Number' en un archivo de dispositivo?",
    options: [
      "Indicar el número de unidad dentro del dispositivo",
      "Especificar el tamaño máximo de transferencia de datos",
      "Identificar el tipo de dispositivo (disco, terminal, etc.) para buscar el driver correcto",
      "Establecer la prioridad de acceso al bus de E/S",
    ],
    correctIndex: 2,
    explanation:
      "El 'Major Number' identifica el tipo de dispositivo y permite al kernel asociarlo con un controlador (driver) específico. El 'Minor Number' identifica la unidad específica.",
  },
  {
    id: "t6-q4",
    question: "¿Para qué sirve la función sync() en C?",
    options: [
      "Para sincronizar la hora del sistema con un servidor NTP",
      "Para forzar que los datos y metadatos en caché se escriban físicamente en el disco",
      "Para permitir que dos hilos compartan la misma variable",
      "Para verificar si un sistema de archivos está montado",
    ],
    correctIndex: 1,
    explanation:
      "sync() vuelca todos los buffers de caché del kernel al disco duro, asegurando la integridad de los datos ante un posible fallo de energía.",
  },
  {
    id: "t6-q5",
    question: "¿Qué diferencia a un dispositivo de bloque de uno de carácter?",
    options: [
      "Los de bloque son más lentos",
      "Los de bloque usan un buffer caché y gestionan datos en unidades de tamaño fijo (sectores)",
      "Los de carácter solo pueden leerse, no escribirse",
      "Los de bloque solo existen en sistemas distribuidos",
    ],
    correctIndex: 1,
    explanation:
      "Los dispositivos de bloque (como discos) transfieren datos en bloques fijos y usan caché. Los de carácter (como teclados) manejan flujos lineales de bytes sin buffer intermedio del kernel.",
  },
];

/* ── Tema 7: Señales ── */
export const TEMA7_QUIZ: QuizQuestion[] = [
  {
    id: "t7-q1",
    question: "¿Qué señales de Linux NO pueden ser capturadas ni ignoradas por un proceso?",
    options: [
      "SIGINT y SIGTERM",
      "SIGKILL y SIGSTOP",
      "SIGUSR1 y SIGUSR2",
      "SIGSEGV y SIGILL",
    ],
    correctIndex: 1,
    explanation:
      "SIGKILL (9) y SIGSTOP (19) son señales que el kernel maneja directamente para asegurar el control del sistema; el proceso no tiene oportunidad de tratarlas.",
  },
  {
    id: "t7-q2",
    question: "Si llamamos a kill(0, SIGKILL), ¿a quién se le envía la señal?",
    options: [
      "Al proceso con PID 0 (kernel)",
      "Solo al proceso que realiza la llamada",
      "A todos los procesos que pertenecen al mismo grupo que el emisor",
      "A todos los procesos del sistema (broadcast)",
    ],
    correctIndex: 2,
    explanation:
      "Cuando pid = 0, la señal se envía a todos los procesos cuyo ID de grupo de proceso es igual al del proceso que envía la señal.",
  },
  {
    id: "t7-q3",
    question: "¿Qué par de funciones permiten realizar un salto no local de retorno a un estado guardado?",
    options: [
      "fork() y wait()",
      "signal() y raise()",
      "setjmp() y longjmp()",
      "alarm() y pause()",
    ],
    correctIndex: 2,
    explanation:
      "setjmp() guarda el entorno (registros, pila, etc.) y longjmp() restaura dicho entorno, permitiendo 'saltar' de vuelta a un punto anterior del programa.",
  },
  {
    id: "t7-q4",
    question: "¿Cuál es el comportamiento por defecto de SIGALRM?",
    options: [
      "Ignorar la señal",
      "Suspender el proceso",
      "Terminar la ejecución del proceso",
      "Reiniciar el temporizador",
    ],
    correctIndex: 2,
    explanation:
      "A menos que se defina un manejador (handler), la acción por defecto de SIGALRM es finalizar el proceso.",
  },
  {
    id: "t7-q5",
    question: "¿Para qué sirve la función pause()?",
    options: [
      "Para detener el programa por un tiempo fijo",
      "Para suspender el proceso hasta que se reciba cualquier señal capturable",
      "Para liberar la memoria del proceso",
      "Para esperar a que un hijo termine",
    ],
    correctIndex: 1,
    explanation:
      "pause() pone al proceso a dormir hasta que llega una señal que o bien termina el proceso o bien invoca a un manejador de señales.",
  },
];


