import type { QuizQuestion } from "@/components/ui/TopicQuiz";

/* ── Tema 1: Introducción a los SO ── */
export const TEMA1_QUIZ: QuizQuestion[] = [
  {
    id: "t1-q1",
    question: "¿Cuál de las siguientes opciones describe correctamente lo que es un sistema operativo?",
    options: [
      "Es un software diseñado exclusivamente para conectarse a internet.",
      "Es un software que administra el hardware y sirve de intermediario entre el usuario y la computadora.",
      "Es un programa que traduce código fuente a lenguaje máquina.",
      "Es un sistema especializado en crear bases de datos."
    ],
    correctIndex: 1,
    explanation: "El sistema operativo es el software fundamental que administra los recursos del hardware y permite al usuario interactuar con la computadora."
  },
  {
    id: "t1-q2",
    question: "¿Qué tipo de sistema operativo está diseñado para responder dentro de plazos de tiempo estrictos, sin importar la interacción con el usuario?",
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
    question: "En los sistemas distribuidos, ¿qué diferencia a los 'fuertemente acoplados' de los 'débilmente acoplados'?",
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
    question: "¿Cómo está organizada internamente la arquitectura del sistema operativo iOS?",
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
    question: "Observa el siguiente código. Después de que se ejecuten ambas llamadas a fork(), ¿cuántos procesos habrá en total (incluyendo el original)?",
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
      "El siguiente programa genera un proceso zombie. ¿Cuál es la línea que causa este problema y por qué?",
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
      "¿En qué se diferencia la función fork() de la función exec() al momento de ejecutarse?",
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
      "Observa el siguiente programa que usa dos hilos. ¿Por qué el valor final de 'counter' podría NO ser 2,000,000?",
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
      "Si se llama a waitpid(-1, &status, WNOHANG) y todavía hay procesos hijos ejecutándose pero ninguno ha terminado, ¿qué valor devuelve?",
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
    question: "Si un proceso padre termina su ejecución antes que su proceso hijo y no lo esperó con wait(), ¿qué le ocurre al hijo?",
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
    question: "Para un programa que solo realiza cálculos matemáticos intensivos (sin leer archivos ni usar red), ¿cuál opción aprovecha mejor una CPU con varios núcleos?",
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
      "¿En qué se diferencia una tubería sin nombre (pipe) de una tubería con nombre (FIFO)?",
    options: [
      "Las tuberías sin nombre son más rápidas que las FIFO.",
      "Las FIFO se crean como archivos en el sistema de archivos, lo que permite que procesos sin relación de parentesco se comuniquen.",
      "Las tuberías sin nombre son bidireccionales y las FIFO solo unidireccionales.",
      "Las FIFO solo funcionan en System V, no en Linux.",
    ],
    correctIndex: 1,
    explanation:
      "Las tuberías sin nombre (pipe) solo funcionan entre procesos padre-hijo. Las FIFO se crean con mkfifo() como archivos especiales en el sistema de archivos, lo que permite que cualquier proceso las abra por su nombre.",
  },
  {
    id: "t3-q2",
    question:
      "Si un proceso crea memoria compartida con shmget() pero no la elimina con shmctl(IPC_RMID) antes de terminar, ¿qué pasa con ese segmento de memoria?",
    options: [
      "Se libera automáticamente cuando el proceso termina.",
      "El segmento permanece en el kernel hasta que se reinicie el sistema o se borre manualmente con ipcrm.",
      "Se produce un error de segmentación al terminar el proceso.",
      "Ningún otro proceso puede acceder al segmento.",
    ],
    correctIndex: 1,
    explanation:
      "Los recursos IPC de System V persisten en el kernel aunque el proceso que los creó haya terminado. Deben eliminarse manualmente con shmctl(IPC_RMID) o con el comando 'ipcrm'. Se pueden consultar con 'ipcs'.",
  },
  {
    id: "t3-q3",
    question:
      "En el siguiente código, el proceso hijo se queda esperando para siempre en read(). ¿Cuál es la causa?",
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
      "El padre no escribió suficientes bytes para llenar el buffer.",
      "El hijo no cerró el extremo de escritura (fd[1]), por lo que el kernel cree que aún podrían llegar más datos.",
      "Falta llamar a flush() después del write() del padre.",
      "El tamaño del buffer de lectura es demasiado grande.",
    ],
    correctIndex: 1,
    explanation:
      "El hijo hereda ambos extremos del pipe. Como no cerró fd[1], el kernel detecta que todavía existe un escritor activo (el propio hijo) y read() espera datos indefinidamente. Regla: siempre cierra el extremo del pipe que no uses.",
  },
  {
    id: "t3-q4",
    question:
      "De todos los mecanismos de comunicación entre procesos (IPC), ¿cuál es el más rápido y cuál es la razón?",
    options: [
      "Las tuberías (pipes), porque son las más simples.",
      "Las colas de mensajes, porque el kernel optimiza la entrega.",
      "La memoria compartida, porque los procesos acceden directamente a la misma zona de memoria sin copias intermedias.",
      "Las señales, porque solo envían un número entero.",
    ],
    correctIndex: 2,
    explanation:
      "La memoria compartida es el IPC más rápido porque ambos procesos leen y escriben directamente en la misma región de memoria, sin necesidad de copiar datos al kernel. Las tuberías y colas implican una doble copia (proceso→kernel→proceso).",
  },
  {
    id: "t3-q5",
    question: "Si todos los procesos que leían de una tubería (pipe) ya cerraron su extremo de lectura, ¿qué ocurre cuando otro proceso intenta escribir en esa tubería?",
    options: [
      "El proceso escritor se queda bloqueado esperando que alguien vuelva a abrir la lectura.",
      "La llamada write() falla silenciosamente y devuelve 0 bytes escritos.",
      "El kernel envía la señal SIGPIPE al proceso que intentó escribir, lo que por defecto lo termina.",
      "Los datos se almacenan en el buffer del kernel de forma indefinida."
    ],
    correctIndex: 2,
    explanation: "Cuando no hay lectores activos en un pipe, el kernel envía SIGPIPE al escritor. Por defecto, esta señal termina el proceso. Para evitarlo, se puede ignorar SIGPIPE o verificar el error EPIPE."
  },
  {
    id: "t3-q6",
    question: "Cuando dos procesos comparten memoria para intercambiar datos (Productor-Consumidor), ¿por qué es indispensable usar semáforos?",
    options: [
      "Porque los semáforos hacen que la memoria RAM funcione más rápido.",
      "Porque los semáforos evitan que ambos procesos lean o escriban al mismo tiempo, previniendo datos corruptos.",
      "Porque sin un semáforo inicializado, la memoria compartida no se puede crear.",
      "Porque los semáforos sirven para contar cuántos procesos hay activos."
    ],
    correctIndex: 1,
    explanation: "La memoria compartida no incluye sincronización por sí sola. Sin semáforos, ambos procesos podrían escribir o leer al mismo tiempo, corrompiendo los datos (condición de carrera). Los semáforos actúan como candados para proteger el acceso."
  }
];

/* ── Tema 5: Administración de memoria ── */
export const TEMA5_QUIZ: QuizQuestion[] = [
  {
    id: "t5-q1",
    question: "¿Qué trabajo realiza la Unidad de Administración de Memoria (MMU) dentro de la computadora?",
    options: [
      "Decide qué proceso se ejecuta primero en la CPU.",
      "Convierte las direcciones de memoria virtuales que usa cada programa en direcciones físicas reales de la RAM.",
      "Controla la velocidad de transferencia entre el disco duro y la memoria.",
      "Elimina procesos inactivos para liberar espacio.",
    ],
    correctIndex: 1,
    explanation:
      "La MMU traduce las direcciones virtuales (que cada programa cree tener de forma continua) a direcciones físicas reales en la RAM, permitiendo que varios programas coexistan en memoria sin interferirse.",
  },
  {
    id: "t5-q2",
    question: "Si cada proceso pasa el 80% de su tiempo esperando operaciones de disco (p=0.8) y hay 3 procesos cargados en memoria, ¿cuál es el porcentaje de uso de la CPU aplicando la fórmula: Uso CPU = 1 − p^n?",
    options: [
      "20%",
      "48.8%",
      "51.2%",
      "80%",
    ],
    correctIndex: 2,
    explanation:
      "Aplicando la fórmula: 1 − (0.8)³ = 1 − 0.512 = 0.488, es decir, la CPU se usa aproximadamente el 48.8% del tiempo. El 51.2% restante es la probabilidad de que los 3 procesos estén esperando simultáneamente.",
  },
  {
    id: "t5-q3",
    question: "¿Cuál algoritmo de asignación de memoria recorre toda la lista de espacios libres para elegir el que tenga el tamaño más cercano al que se necesita?",
    options: [
      "Primer ajuste (First-fit)",
      "Siguiente ajuste (Next-fit)",
      "Mejor ajuste (Best-fit)",
      "Peor ajuste (Worst-fit)",
    ],
    correctIndex: 2,
    explanation:
      "El algoritmo 'Mejor ajuste' (Best-fit) busca el espacio libre más pequeño que sea suficiente para el proceso, con el objetivo de desperdiciar la menor cantidad de memoria posible.",
  },
  {
    id: "t5-q4",
    question: "En la multiprogramación con particiones fijas, ¿cuál es el propósito de los registros 'base' y 'límite'?",
    options: [
      "Acelerar la velocidad del bus de datos.",
      "Permitir que las direcciones del programa se traduzcan a direcciones reales (base) y evitar que un proceso acceda a memoria de otro (límite).",
      "Contar cuántas páginas fueron enviadas al área de intercambio (swap).",
      "Permitir que un proceso crezca de tamaño dinámicamente.",
    ],
    correctIndex: 1,
    explanation:
      "El registro 'base' suma un desplazamiento para convertir direcciones relativas en absolutas. El registro 'límite' verifica que el proceso no acceda a memoria fuera de su partición asignada, protegiendo a los demás procesos.",
  },
  {
    id: "t5-q5",
    question: "En Linux, si el parámetro 'swappiness' tiene un valor de 60, ¿qué significa para el manejo de la memoria?",
    options: [
      "Que el sistema usará el swap únicamente cuando la RAM esté al 60% de ocupación.",
      "Que el 60% de la memoria RAM está reservada exclusivamente para el kernel.",
      "Que el sistema comenzará a mover datos de la RAM al disco (swap) cuando la memoria libre baje a un nivel intermedio (aproximadamente 40% de uso).",
      "Que el archivo de intercambio (swapfile) tiene un tamaño de 60 GB.",
    ],
    correctIndex: 2,
    explanation:
      "El valor de swappiness (0–100) controla qué tan agresivamente el sistema mueve páginas de la RAM al disco. Con un valor de 60 (el predeterminado en Ubuntu), el sistema empieza a paginar cuando la RAM disponible es relativamente baja.",
  },
];

/* ── Tema 6: Sistema de Archivos ── */
export const TEMA6_QUIZ: QuizQuestion[] = [
  {
    id: "t6-q1",
    question: "¿En cuál de las secciones del sistema de archivos se almacena la información general como el tamaño total, la cantidad de archivos y el espacio libre disponible?",
    options: [
      "Boot (Arranque)",
      "Superbloque",
      "Lista de Inodos",
      "Bloque de datos",
    ],
    correctIndex: 1,
    explanation:
      "El superbloque contiene los metadatos globales del sistema de archivos: tamaño total, cantidad de bloques libres, tamaño de bloque, entre otros.",
  },
  {
    id: "t6-q2",
    question: "De la siguiente lista, ¿cuál dato NO se guarda dentro del inodo de un archivo?",
    options: [
      "Los permisos de lectura, escritura y ejecución.",
      "El identificador del propietario (UID).",
      "El nombre del archivo.",
      "El tamaño del archivo en bytes.",
    ],
    correctIndex: 2,
    explanation:
      "El nombre del archivo no se almacena en el inodo. Se guarda en la entrada del directorio que contiene al archivo, la cual asocia el nombre con un número de inodo.",
  },
  {
    id: "t6-q3",
    question: "En Linux, cada archivo de dispositivo tiene un 'Major Number'. ¿Para qué sirve ese número?",
    options: [
      "Indica cuál unidad específica es dentro de un mismo tipo de dispositivo.",
      "Define el tamaño máximo de datos que se pueden transferir.",
      "Identifica el tipo de dispositivo (disco, terminal, etc.) para que el kernel sepa qué driver (controlador) usar.",
      "Establece la prioridad de acceso al bus de entrada/salida.",
    ],
    correctIndex: 2,
    explanation:
      "El 'Major Number' le dice al kernel qué tipo de dispositivo es para asociarlo con el controlador (driver) correcto. El 'Minor Number' identifica la unidad específica dentro de ese tipo.",
  },
  {
    id: "t6-q4",
    question: "Cuando se llama a la función sync() en un programa en C, ¿qué acción realiza el sistema?",
    options: [
      "Sincroniza la hora del sistema con un servidor de internet (NTP).",
      "Obliga al sistema a escribir en el disco todos los datos que aún estaban almacenados temporalmente en la memoria caché.",
      "Permite que dos hilos de ejecución compartan la misma variable.",
      "Verifica si un sistema de archivos está montado correctamente.",
    ],
    correctIndex: 1,
    explanation:
      "sync() fuerza la escritura de todos los buffers de la memoria caché al disco físico, asegurando que los datos no se pierdan ante una falla de energía.",
  },
  {
    id: "t6-q5",
    question: "¿Cuál es la diferencia principal entre un dispositivo de bloque y un dispositivo de carácter en Linux?",
    options: [
      "Los dispositivos de bloque son siempre más lentos que los de carácter.",
      "Los dispositivos de bloque transfieren datos en unidades de tamaño fijo (sectores) y utilizan memoria caché, mientras que los de carácter manejan datos byte a byte.",
      "Los dispositivos de carácter solo permiten lectura, no escritura.",
      "Los dispositivos de bloque solo existen en sistemas distribuidos.",
    ],
    correctIndex: 1,
    explanation:
      "Los dispositivos de bloque (como discos duros) transfieren datos en bloques de tamaño fijo y usan caché del kernel. Los de carácter (como teclados o puertos serie) envían o reciben datos byte a byte, sin buffer intermedio.",
  },
];

/* ── Tema 7: Señales ── */
export const TEMA7_QUIZ: QuizQuestion[] = [
  {
    id: "t7-q1",
    question: "¿Cuáles son las dos señales de Linux que un proceso NO puede capturar, bloquear ni ignorar bajo ninguna circunstancia?",
    options: [
      "SIGINT y SIGTERM",
      "SIGKILL y SIGSTOP",
      "SIGUSR1 y SIGUSR2",
      "SIGSEGV y SIGILL",
    ],
    correctIndex: 1,
    explanation:
      "SIGKILL (señal 9) y SIGSTOP (señal 19) son manejadas directamente por el kernel. Ningún programa puede interceptarlas ni ignorarlas, lo que garantiza que siempre se pueda terminar o detener un proceso.",
  },
  {
    id: "t7-q2",
    question: "Cuando se ejecuta kill(0, SIGKILL) pasando 0 como primer argumento, ¿a qué procesos se les envía la señal?",
    options: [
      "Únicamente al proceso con PID 0, que es el kernel.",
      "Solo al proceso que ejecutó la llamada.",
      "A todos los procesos que pertenecen al mismo grupo de procesos que el emisor.",
      "A todos los procesos del sistema sin excepción.",
    ],
    correctIndex: 2,
    explanation:
      "Cuando el primer argumento de kill() es 0, la señal se envía a todos los procesos que comparten el mismo ID de grupo de proceso que el proceso que hizo la llamada.",
  },
  {
    id: "t7-q3",
    question: "¿Qué par de funciones en C permiten guardar el estado actual del programa y después regresar a ese punto desde cualquier otra parte del código?",
    options: [
      "fork() y wait()",
      "signal() y raise()",
      "setjmp() y longjmp()",
      "alarm() y pause()",
    ],
    correctIndex: 2,
    explanation:
      "setjmp() guarda el estado del programa (registros, pila, etc.) en un buffer. Posteriormente, longjmp() puede restaurar ese estado, haciendo que la ejecución 'salte' de vuelta al punto donde se llamó a setjmp().",
  },
  {
    id: "t7-q4",
    question: "Si un proceso recibe la señal SIGALRM y no tiene definido ningún manejador (handler) para ella, ¿qué le ocurre al proceso?",
    options: [
      "La señal se ignora y el proceso continúa normalmente.",
      "El proceso se suspende temporalmente.",
      "El proceso se termina (es la acción por defecto).",
      "El temporizador se reinicia automáticamente.",
    ],
    correctIndex: 2,
    explanation:
      "Si no se ha definido un manejador con signal(), la acción por defecto de SIGALRM es terminar el proceso. Por eso es importante registrar un handler antes de usar alarm().",
  },
  {
    id: "t7-q5",
    question: "¿Qué hace exactamente la función pause() cuando se ejecuta dentro de un programa en C?",
    options: [
      "Detiene el programa durante una cantidad fija de segundos.",
      "Suspende el proceso y lo deja dormido hasta que reciba cualquier señal que pueda ser capturada.",
      "Libera la memoria que el proceso estaba utilizando.",
      "Espera a que un proceso hijo termine su ejecución.",
    ],
    correctIndex: 1,
    explanation:
      "pause() pone al proceso a dormir indefinidamente hasta que llegue una señal. Si la señal tiene un manejador (handler), se ejecuta el handler y pause() retorna. Si no, la acción por defecto de la señal se aplica (por ejemplo, terminar el proceso).",
  },
];

export const TEMA8_QUIZ: QuizQuestion[] = [
  {
    id: "t8-q1",
    question: "Al implementar el comando 'mkdir' en C, ¿cuál es la llamada al sistema que se utiliza para crear el directorio?",
    options: [
      "mkdir()",
      "chdir()",
      "open()",
      "create()"
    ],
    correctIndex: 0,
    explanation: "La función mkdir() es la llamada al sistema que crea un nuevo directorio en la ruta indicada, recibiendo además los permisos iniciales como segundo argumento."
  },
  {
    id: "t8-q2",
    question: "Si quieres programar en C un comando que muestre la ruta del directorio actual (similar a 'pwd'), ¿qué función debes usar?",
    options: [
      "pwd()",
      "getcwd()",
      "chdir()",
      "dir()"
    ],
    correctIndex: 1,
    explanation: "La función getcwd() devuelve la ruta absoluta (path completo) del directorio de trabajo actual del proceso."
  },
  {
    id: "t8-q3",
    question: "El comando 'mesg' controla si otros usuarios pueden escribir mensajes en tu terminal. ¿Qué llamada al sistema usa internamente para modificar los permisos?",
    options: [
      "stat()",
      "chmod()",
      "rename()",
      "access()"
    ],
    correctIndex: 1,
    explanation: "El comando mesg usa chmod() para agregar o quitar el permiso de escritura del grupo sobre el archivo de la terminal (/dev/pts/X)."
  },
  {
    id: "t8-q4",
    question: "Para implementar en C un comando similar a 'free' que muestre el uso de memoria RAM y swap, ¿qué estructura y función del sistema se deben utilizar?",
    options: [
      "struct stat y stat()",
      "struct sysinfo y sysinfo()",
      "struct utsname y uname()",
      "struct utmp y getutent()"
    ],
    correctIndex: 1,
    explanation: "La llamada sysinfo() llena una estructura de tipo 'sysinfo' con datos globales del sistema: memoria total, memoria libre, swap usado, número de procesos, etc."
  },
  {
    id: "t8-q5",
    question: "Al implementar el comando 'rm' en C para borrar un archivo regular, ¿cuál es la llamada al sistema correcta para eliminarlo?",
    options: [
      "remove()",
      "delete()",
      "unlink()",
      "rmdir()"
    ],
    correctIndex: 2,
    explanation: "La función unlink() elimina el nombre del archivo del directorio. Si ese era el último enlace duro (hard link) apuntando al inodo, el sistema libera el espacio en disco."
  }
];
