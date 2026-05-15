import type { Topic } from "@/lib/constants";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;       // e.g. "Tema 2 · Procesos"
  type: "topic" | "subtopic" | "function" | "command" | "concept";
  keywords: string[];     // extra terms that match this entry
}

/**
 * Build a rich, flat search index from topics + a hand-curated
 * keyword map so users can find "pwd", "fork", "ftok", etc.
 */
export function buildSearchIndex(topics: Topic[]): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // 1. Inject every topic / subtopic as a searchable entry
  for (const topic of topics) {
    entries.push({
      id: topic.id,
      title: topic.title,
      description: `Ir al tema principal`,
      href: topic.href,
      category: topic.title,
      type: "topic",
      keywords: [],
    });

    for (const sub of topic.subtopics || []) {
      entries.push({
        id: sub.id,
        title: sub.title,
        description: topic.title,
        href: sub.href,
        category: topic.title,
        type: "subtopic",
        keywords: [],
      });
    }
  }

  // 2. Hand-curated deep-content entries
  const deepEntries: Omit<SearchEntry, "id">[] = [
    // ── Tema 1 ──
    { title: "Kernel", description: "Núcleo del sistema operativo", href: "/tema-1-introduccion#1-1-introduccion", category: "1. Introducción a Linux", type: "concept", keywords: ["kernel", "nucleo", "linux"] },
    { title: "Sistemas por lotes", description: "Clasificación de SO", href: "/tema-1-introduccion#1-2-clasificacion", category: "1. Introducción a Linux", type: "concept", keywords: ["lotes", "batch", "multiprogramacion"] },
    { title: "Tiempo real", description: "SO de tiempo real", href: "/tema-1-introduccion#1-2-clasificacion", category: "1. Introducción a Linux", type: "concept", keywords: ["tiempo real", "real time", "vxworks", "freertos", "qnx"] },
    { title: "Android / iOS", description: "Sistemas operativos móviles", href: "/tema-1-introduccion#1-2-clasificacion", category: "1. Introducción a Linux", type: "concept", keywords: ["android", "ios", "dalvik", "xnu", "movil", "symbian"] },

    // ── Tema 2 ──
    { title: "fork()", description: "Crear un nuevo proceso (bifurcación)", href: "/tema-2-procesos-hilos#2-3-creacion", category: "2. Procesos e Hilos", type: "function", keywords: ["fork", "bifurcar", "crear proceso", "hijo", "padre"] },
    { title: "getpid() / getppid()", description: "Obtener PID del proceso o del padre", href: "/tema-2-procesos-hilos#2-4-identificar", category: "2. Procesos e Hilos", type: "function", keywords: ["getpid", "getppid", "pid", "identificar proceso"] },
    { title: "wait() / waitpid()", description: "Esperar terminación de un proceso hijo", href: "/tema-2-procesos-hilos#2-5-wait", category: "2. Procesos e Hilos", type: "function", keywords: ["wait", "waitpid", "esperar hijo", "WNOHANG", "zombie"] },
    { title: "exit() / _exit()", description: "Terminar la ejecución de un proceso", href: "/tema-2-procesos-hilos#2-6-exit", category: "2. Procesos e Hilos", type: "function", keywords: ["exit", "_exit", "terminar", "salir"] },
    { title: "Proceso zombie", description: "Hijo terminado sin wait() del padre", href: "/tema-2-procesos-hilos#2-7-zombie", category: "2. Procesos e Hilos", type: "concept", keywords: ["zombie", "defunct", "huerfano", "orphan"] },
    { title: "pthread_create()", description: "Crear un hilo POSIX", href: "/tema-2-procesos-hilos#2-9-hilos", category: "2. Procesos e Hilos", type: "function", keywords: ["pthread", "hilo", "thread", "pthread_create", "pthread_join"] },
    { title: "Árbol de procesos", description: "Creación recursiva de procesos", href: "/tema-2-procesos-hilos#2-4-identificar", category: "2. Procesos e Hilos", type: "concept", keywords: ["arbol", "tree", "recursivo", "cadena", "abanico"] },

    // ── Tema 3 ──
    { title: "pipe()", description: "Tubería sin nombre entre procesos", href: "/tema-3-ipc#3-1-1-pipe", category: "3. Comunicación IPC", type: "function", keywords: ["pipe", "tuberia", "pipe2", "pipefd"] },
    { title: "mkfifo()", description: "Tubería con nombre (FIFO)", href: "/tema-3-ipc#3-1-2-fifo", category: "3. Comunicación IPC", type: "function", keywords: ["fifo", "mkfifo", "named pipe", "tuberia con nombre"] },
    { title: "ftok()", description: "Generar llave IPC desde archivo", href: "/tema-3-ipc#3-2-1-llaves", category: "3. Comunicación IPC", type: "function", keywords: ["ftok", "llave", "key", "key_t", "ipc key"] },
    { title: "semget() / semop()", description: "Semáforos System V", href: "/tema-3-ipc#3-2-2-semaforos-v", category: "3. Comunicación IPC", type: "function", keywords: ["semget", "semop", "semctl", "semaforo", "system v", "sysv"] },
    { title: "sem_init() / sem_wait()", description: "Semáforos POSIX", href: "/tema-3-ipc#3-2-3-semaforos-posix", category: "3. Comunicación IPC", type: "function", keywords: ["sem_init", "sem_wait", "sem_post", "posix", "mutex", "pthread_mutex"] },
    { title: "shmget() / shmat()", description: "Memoria compartida System V", href: "/tema-3-ipc#3-3-memoria", category: "3. Comunicación IPC", type: "function", keywords: ["shmget", "shmat", "shmdt", "shmctl", "memoria compartida", "shared memory"] },
    { title: "msgget() / msgsnd()", description: "Colas de mensajes System V", href: "/tema-3-ipc#3-4-cola-mensajes", category: "3. Comunicación IPC", type: "function", keywords: ["msgget", "msgsnd", "msgrcv", "cola de mensajes", "message queue", "mtype"] },
    { title: "ipcs / ipcrm", description: "Inspeccionar / eliminar recursos IPC", href: "/tema-3-ipc#3-5-info-ipc", category: "3. Comunicación IPC", type: "command", keywords: ["ipcs", "ipcrm", "ipc", "recurso"] },

    // ── Tema 4 ──
    { title: "MMU", description: "Unidad de Administración de Memoria", href: "/tema-4-memoria#5-1-intro", category: "4. Administración de memoria", type: "concept", keywords: ["mmu", "unidad", "direccion virtual", "direccion fisica", "paginacion"] },
    { title: "sysconf() / getpagesize()", description: "Obtener tamaño de página", href: "/tema-4-memoria#5-2-paginacion", category: "4. Administración de memoria", type: "function", keywords: ["sysconf", "getpagesize", "page size", "pagina"] },
    { title: "mmap() / munmap()", description: "Mapeo de memoria", href: "/tema-4-memoria#5-2-paginacion", category: "4. Administración de memoria", type: "function", keywords: ["mmap", "munmap", "mapeo", "mapping"] },
    { title: "sysinfo()", description: "Estadísticas globales de memoria", href: "/tema-4-memoria#5-2-paginacion", category: "4. Administración de memoria", type: "function", keywords: ["sysinfo", "struct sysinfo", "ram", "swap", "free"] },
    { title: "Swappiness", description: "Agresividad del intercambio RAM/disco", href: "/tema-4-memoria#5-2-paginacion", category: "4. Administración de memoria", type: "concept", keywords: ["swappiness", "swap", "intercambio", "paginacion"] },
    { title: "Best-fit / First-fit", description: "Algoritmos de asignación de memoria", href: "/tema-4-memoria#5-1-intro", category: "4. Administración de memoria", type: "concept", keywords: ["best fit", "first fit", "worst fit", "next fit", "asignacion", "hueco", "fragmentacion"] },

    // ── Tema 5 ──
    { title: "Superbloque", description: "Metadatos globales del filesystem", href: "/tema-5-archivos#6-1-intro", category: "5. Sistema de Archivos", type: "concept", keywords: ["superbloque", "superblock", "ext4", "ext2", "ext3"] },
    { title: "Inodo", description: "Estructura de metadatos de un archivo", href: "/tema-5-archivos#6-2-inodos", category: "5. Sistema de Archivos", type: "concept", keywords: ["inodo", "inode", "stat", "fstat", "lstat", "permisos", "uid", "gid"] },
    { title: "stat() / fstat() / lstat()", description: "Obtener información de un archivo", href: "/tema-5-archivos#6-2-inodos", category: "5. Sistema de Archivos", type: "function", keywords: ["stat", "fstat", "lstat", "struct stat", "st_mode", "st_ino"] },
    { title: "statvfs()", description: "Información del sistema de archivos", href: "/tema-5-archivos#6-1-intro", category: "5. Sistema de Archivos", type: "function", keywords: ["statvfs", "df", "disco", "bloques"] },
    { title: "ioctl()", description: "Control de dispositivos de E/S", href: "/tema-5-archivos#6-3-dispositivos", category: "5. Sistema de Archivos", type: "function", keywords: ["ioctl", "dispositivo", "terminal", "tty", "major", "minor"] },
    { title: "Major / Minor number", description: "Números de dispositivo", href: "/tema-5-archivos#6-3-dispositivos", category: "5. Sistema de Archivos", type: "concept", keywords: ["major", "minor", "device", "dispositivo", "bloque", "caracter"] },

    // ── Tema 6 ──
    { title: "signal()", description: "Registrar un manejador de señal", href: "/tema-6-senales#7-3-tratamiento", category: "6. Señales", type: "function", keywords: ["signal", "handler", "manejador", "SIG_DFL", "SIG_IGN", "sighandler"] },
    { title: "kill() / raise()", description: "Enviar señal a un proceso", href: "/tema-6-senales#7-2-tipos", category: "6. Señales", type: "function", keywords: ["kill", "raise", "enviar senal", "pid"] },
    { title: "SIGKILL / SIGSTOP", description: "Señales no capturables", href: "/tema-6-senales#7-2-tipos", category: "6. Señales", type: "concept", keywords: ["sigkill", "sigstop", "sigint", "sigterm", "sigalrm", "sigsegv", "sigpipe", "sigchld", "sigusr1", "sigusr2", "sighup"] },
    { title: "setjmp() / longjmp()", description: "Salto no local desde un handler", href: "/tema-6-senales#7-3-tratamiento", category: "6. Señales", type: "function", keywords: ["setjmp", "longjmp", "jmp_buf", "salto no local"] },
    { title: "alarm() / pause()", description: "Temporizador y suspensión", href: "/tema-6-senales#7-4-alarma", category: "6. Señales", type: "function", keywords: ["alarm", "pause", "temporizador", "sigalrm", "timer"] },

    // ── Tema 7 ──
    { title: "pwd (getcwd)", description: "Mostrar directorio actual", href: "/tema-7-comandos#cmd-pwd", category: "7. Implementación de Comandos", type: "command", keywords: ["pwd", "getcwd", "directorio actual", "cwd"] },
    { title: "cd (chdir)", description: "Cambiar directorio de trabajo", href: "/tema-7-comandos#cmd-cd", category: "7. Implementación de Comandos", type: "command", keywords: ["cd", "chdir", "cambiar directorio", "HOME"] },
    { title: "mkdir", description: "Crear un directorio", href: "/tema-7-comandos#cmd-mkdir", category: "7. Implementación de Comandos", type: "command", keywords: ["mkdir", "crear directorio", "carpeta"] },
    { title: "ls (opendir / readdir)", description: "Listar contenido de directorio", href: "/tema-7-comandos#cmd-ls", category: "7. Implementación de Comandos", type: "command", keywords: ["ls", "opendir", "readdir", "listar", "directorio", "dirent"] },
    { title: "rm (unlink)", description: "Eliminar un archivo", href: "/tema-7-comandos#cmd-rm", category: "7. Implementación de Comandos", type: "command", keywords: ["rm", "unlink", "eliminar", "borrar archivo"] },
    { title: "cat (read / write)", description: "Mostrar contenido de un archivo", href: "/tema-7-comandos#cmd-cat", category: "7. Implementación de Comandos", type: "command", keywords: ["cat", "read", "write", "leer archivo", "contenido"] },
    { title: "rename", description: "Renombrar un archivo", href: "/tema-7-comandos#cmd-rename", category: "7. Implementación de Comandos", type: "command", keywords: ["rename", "renombrar", "mover"] },
    { title: "stat (información de archivo)", description: "Mostrar metadatos de un archivo", href: "/tema-7-comandos#cmd-stat", category: "7. Implementación de Comandos", type: "command", keywords: ["stat", "informacion archivo", "inodo", "permisos", "tamaño"] },
    { title: "statvfs (info filesystem)", description: "Información del sistema de archivos", href: "/tema-7-comandos#cmd-statvfs", category: "7. Implementación de Comandos", type: "command", keywords: ["statvfs", "filesystem", "bloques", "inodos libres"] },
    { title: "disp (dispositivos /dev)", description: "Listar dispositivos del sistema", href: "/tema-7-comandos#cmd-disp", category: "7. Implementación de Comandos", type: "command", keywords: ["disp", "dispositivo", "dev", "major", "minor", "caracter", "bloque"] },
    { title: "date (time / localtime)", description: "Mostrar fecha y hora del sistema", href: "/tema-7-comandos#cmd-date", category: "7. Implementación de Comandos", type: "command", keywords: ["date", "time", "localtime", "strftime", "fecha", "hora"] },
    { title: "who (utmp / getutent)", description: "Listar usuarios conectados", href: "/tema-7-comandos#cmd-who", category: "7. Implementación de Comandos", type: "command", keywords: ["who", "utmp", "getutent", "setutent", "usuario conectado", "login"] },
    { title: "free (sysinfo)", description: "Mostrar uso de memoria RAM y swap", href: "/tema-7-comandos#cmd-free", category: "7. Implementación de Comandos", type: "command", keywords: ["free", "sysinfo", "memoria", "ram", "swap", "buffer"] },
    { title: "uname (utsname)", description: "Mostrar información del sistema", href: "/tema-7-comandos#cmd-uname", category: "7. Implementación de Comandos", type: "command", keywords: ["uname", "utsname", "kernel", "hostname", "release", "arquitectura"] },
    { title: "mesg (chmod terminal)", description: "Controlar mensajes en tu terminal", href: "/tema-7-comandos#cmd-mesg", category: "7. Implementación de Comandos", type: "command", keywords: ["mesg", "chmod", "terminal", "tty", "permiso escritura"] },
    { title: "wall (broadcast)", description: "Enviar mensaje a todas las terminales", href: "/tema-7-comandos#cmd-wall", category: "7. Implementación de Comandos", type: "command", keywords: ["wall", "broadcast", "mensaje", "terminal", "tty"] },
    { title: "exit", description: "Salir del shell", href: "/tema-7-comandos#cmd-exit", category: "7. Implementación de Comandos", type: "command", keywords: ["exit", "salir", "shell", "terminar"] },
    { title: "getip (getifaddrs)", description: "Obtener la dirección IP de la máquina", href: "/tema-7-comandos#cmd-getip", category: "7. Implementación de Comandos", type: "command", keywords: ["getip", "ip", "getifaddrs", "inet_ntoa", "AF_INET", "red", "network", "direccion ip"] },
    { title: "getmac (ioctl SIOCGIFHWADDR)", description: "Obtener la dirección MAC del hardware de red", href: "/tema-7-comandos#cmd-getmac", category: "7. Implementación de Comandos", type: "command", keywords: ["getmac", "mac", "ioctl", "SIOCGIFHWADDR", "hardware", "ethernet", "direccion fisica"] },
    { title: "find (opendir / readdir)", description: "Buscar un archivo en un directorio", href: "/tema-7-comandos#cmd-find", category: "7. Implementación de Comandos", type: "command", keywords: ["find", "buscar", "opendir", "readdir", "strcmp", "archivo"] },
    { title: "find_r (búsqueda recursiva)", description: "Buscar un archivo recorriendo todo el árbol de directorios", href: "/tema-7-comandos#cmd-find-r", category: "7. Implementación de Comandos", type: "command", keywords: ["find_r", "find recursivo", "lstat", "S_ISDIR", "malloc", "recursion", "busqueda profunda"] },
  ];

  deepEntries.forEach((entry, i) => {
    entries.push({ ...entry, id: `deep-${i}` });
  });

  return entries;
}

/** Normalize a string: lowercase + remove diacritics (á→a, é→e, etc.) */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Score a search entry against a query.
 * Scoring tiers (higher = better ranking):
 *
 *  TIER 1 — Title matches (always beat anything else)
 *    300 · exact title
 *    260 · title starts-with query
 *    200 · title contains query (any position)
 *    180 · every query token found in title
 *
 *  TIER 2 — Keyword matches
 *    150 · keyword exact match
 *    120 · keyword starts-with query
 *     90 · keyword contains query
 *     70 · every query token found in any keyword
 *
 *  TIER 3 — Description / fallback
 *     50 · description contains query
 *     30 · every token found across title+desc+keywords
 */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = normalize(query.trim());
  if (!q) return 0;

  const title = normalize(entry.title);
  const desc = normalize(entry.description);
  const kwNorm = entry.keywords.map(normalize);

  // ── TIER 1: Title ──────────────────────────────────────────
  if (title === q) return 300;
  if (title.startsWith(q)) return 260;
  if (title.includes(q)) return 200;

  // All query tokens inside the title
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => title.includes(t))) return 180;

  // ── TIER 2: Keywords ───────────────────────────────────────
  let kwScore = 0;
  for (const kw of kwNorm) {
    if (kw === q)            { kwScore = Math.max(kwScore, 150); break; }
    if (kw.startsWith(q))   { kwScore = Math.max(kwScore, 120); }
    else if (kw.includes(q)){ kwScore = Math.max(kwScore, 90);  }
    else if (tokens.length > 1 && tokens.every((t) => kw.includes(t))) {
      kwScore = Math.max(kwScore, 70);
    }
  }
  if (kwScore > 0) return kwScore;

  // ── TIER 3: Description / full-blob fallback ───────────────
  if (desc.includes(q)) return 50;

  if (tokens.length > 1) {
    const blob = `${title} ${desc} ${kwNorm.join(" ")}`;
    if (tokens.every((t) => blob.includes(t))) return 30;
  }

  return 0;
}
