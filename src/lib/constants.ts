export const PORTFOLIO_TOPICS = [
  {
    id: "prologo",
    title: "Prólogo",
    href: "/prologo",
  },
  {
    id: "tema-1",
    title: "1. Introducción al sistema operativo Linux",
    href: "/tema-1-introduccion",
  },
  {
    id: "tema-2",
    title: "2. Procesos e Hilos",
    href: "/tema-2-procesos-hilos",
    subtopics: [
      { id: "2-1", title: "2.1 Introducción a procesos", href: "/tema-2-procesos-hilos#2-1-introduccion" },
      { id: "2-2", title: "2.2 Crear procesos — fork()", href: "/tema-2-procesos-hilos#2-2-fork" },
      { id: "2-4", title: "2.4 Identificar procesos", href: "/tema-2-procesos-hilos#2-4-identificar" },
      { id: "2-5", title: "2.5 Llamada wait()", href: "/tema-2-procesos-hilos#2-5-wait" },
      { id: "2-5-1", title: "2.5.1 Uso de waitpid()", href: "/tema-2-procesos-hilos#2-5-1-waitpid" },
      { id: "2-6", title: "2.6 _exit() y exit()", href: "/tema-2-procesos-hilos#2-6-exit" },
      { id: "2-7", title: "2.7 Estado Zombi", href: "/tema-2-procesos-hilos#2-7-zombi" },
      { id: "2-8", title: "2.8 Familia exec", href: "/tema-2-procesos-hilos#2-8-exec" },
      { id: "2-9", title: "2.9 Hilos (pthreads)", href: "/tema-2-procesos-hilos#2-9-hilos" },
      { id: "2-9-2", title: "2.9.2 Creación de hilos", href: "/tema-2-procesos-hilos#2-9-2-creacion-hilos" },
    ]
  },
  {
    id: "tema-3",
    title: "3. Mecanismos de comunicación entre procesos-IPC",
    href: "/tema-3-ipc",
    subtopics: [
      { id: "3-1", title: "3.1 Comunicación mediante tuberías", href: "/tema-3-ipc#3-1-tuberias" },
      { id: "3-1-1", title: "3.1.1 Tuberías sin nombre — pipe", href: "/tema-3-ipc#3-1-1-pipe" },
      { id: "3-1-2", title: "3.1.2 Tuberías con nombre — fifo", href: "/tema-3-ipc#3-1-2-fifo" },
      { id: "3-2", title: "3.2 IPC derivados de System V", href: "/tema-3-ipc#3-2-system-v" },
      { id: "3-2-1", title: "3.2.1 Llaves", href: "/tema-3-ipc#3-2-1-llaves" },
      { id: "3-2-2", title: "3.2.2 Semáforos System V", href: "/tema-3-ipc#3-2-2-semaforos" },
      { id: "3-3", title: "3.3 Memoria compartida", href: "/tema-3-ipc#3-3-memoria" },
      { id: "3-4", title: "3.4 Cola de mensajes", href: "/tema-3-ipc#3-4-cola-mensajes" },
      { id: "3-5", title: "3.5 Info IPC por comandos", href: "/tema-3-ipc#3-5-info-ipc" },
    ]
  },
  {
    id: "tema-5",
    title: "5. Administración de memoria",
    href: "/tema-5-memoria",
    subtopics: [
      { id: "5-1", title: "5.1 Página del sistema", href: "/tema-5-memoria#5-1-pagina" },
      { id: "5-2", title: "5.2 malloc() y free()", href: "/tema-5-memoria#5-2-malloc" },
      { id: "5-3", title: "5.3 mmap() / munmap()", href: "/tema-5-memoria#5-3-mmap" },
      { id: "5-4", title: "5.4 sysinfo", href: "/tema-5-memoria#5-4-sysinfo" },
    ]
  },
  {
    id: "tema-6",
    title: "6. Arquitectura del sistema de archivos",
    href: "/tema-6-archivos",
    subtopics: [
      { id: "6-1", title: "6.1 Estructura del sistema", href: "/tema-6-archivos#6-1-estructura" },
      { id: "6-2", title: "6.2 Superbloque e inodos", href: "/tema-6-archivos#6-2-superbloque" },
      { id: "6-3", title: "6.3 Descriptores de archivo", href: "/tema-6-archivos#6-3-descriptores" },
      { id: "6-4", title: "6.4 Control de E/S (ioctl)", href: "/tema-6-archivos#6-4-ioctl" },
    ]
  },
  {
    id: "tema-7",
    title: "7. Señales",
    href: "/tema-7-senales",
    subtopics: [
      { id: "7-1", title: "7.1 Introducción a señales", href: "/tema-7-senales#7-1-intro" },
      { id: "7-2", title: "7.2 Tratamiento con signal()", href: "/tema-7-senales#7-2-signal" },
      { id: "7-3", title: "7.3 setjmp / longjmp", href: "/tema-7-senales#7-3-setjmp" },
      { id: "7-4", title: "7.4 alarm() y pause()", href: "/tema-7-senales#7-4-alarm" },
    ]
  },
  {
    id: "tema-8",
    title: "8. Comandos POSIX (C)",
    href: "/tema-8-comandos",
    subtopics: [
      { id: "8-1", title: "8.1 Comando pwd (getcwd)", href: "/tema-8-comandos#8-1-pwd" },
      { id: "8-2", title: "8.2 Comando cd (chdir)", href: "/tema-8-comandos#8-2-cd" },
      { id: "8-3", title: "8.3 Comando mkdir", href: "/tema-8-comandos#8-3-mkdir" },
      { id: "8-4", title: "8.4 Comando rm (unlink)", href: "/tema-8-comandos#8-4-rm" },
    ]
  }
];
