import type { Topic } from "@/types";

export const PORTFOLIO_TOPICS: Topic[] = [
  {
    id: "tema-1",
    title: "1. Introducción a Linux",
    href: "/tema-1-introduccion",
    subtopics: [
      { id: "1-1", title: "1.1 Introducción a los SO", href: "/tema-1-introduccion#1-1-introduccion" },
      { id: "1-2", title: "1.2 Clasificación de los SO", href: "/tema-1-introduccion#1-2-clasificacion" },
      { id: "1-3", title: "1.3 Evidencias y Ejecución", href: "/tema-1-introduccion#1-3-evidencias" },
    ]
  },
  {
    id: "tema-2",
    title: "2. Procesos e Hilos",
    href: "/tema-2-procesos-hilos",
    subtopics: [
      { id: "2-1", title: "2.1 Introducción a procesos", href: "/tema-2-procesos-hilos#2-1-introduccion" },
      { id: "2-2", title: "2.2 Sistema de llamado para crear procesos", href: "/tema-2-procesos-hilos#2-2-creacion" },
      { id: "2-4", title: "2.4 Sistema de llamado para identificar procesos", href: "/tema-2-procesos-hilos#2-4-identificar" },
      { id: "2-5", title: "2.5 Sistema de llamada wait ()", href: "/tema-2-procesos-hilos#2-5-wait" },
      { id: "2-5-1", title: "2.5.1 Uso de waitpid()", href: "/tema-2-procesos-hilos#2-5-1-waitpid" },
      { id: "2-6", title: "2.6 Sistema de llamada _exit () y exit ()", href: "/tema-2-procesos-hilos#2-6-exit" },
      { id: "2-7", title: "2.7 Estado Zombi", href: "/tema-2-procesos-hilos#2-7-zombi" },
      { id: "2-8", title: "2.8 Hilos", href: "/tema-2-procesos-hilos#2-8-hilos" },
      { id: "2-8-2", title: "2.8.2 Creación de hilos", href: "/tema-2-procesos-hilos#2-8-2-creacion-hilos" },
    ]
  },
  {
    id: "tema-3",
    title: "3. Comunicación IPC",
    href: "/tema-3-ipc",
    subtopics: [
      { id: "3-1", title: "3.1 Comunicación mediante tuberías", href: "/tema-3-ipc#3-1-tuberias" },
      { id: "3-1-1", title: "3.1.1 Tuberías sin nombre - pipe", href: "/tema-3-ipc#3-1-1-pipe" },
      { id: "3-1-2", title: "3.1.2 Tuberías con nombre - fifo", href: "/tema-3-ipc#3-1-2-fifo" },
      { id: "3-2", title: "3.2 Mecanismos IPC derivados de System V", href: "/tema-3-ipc#3-2-system-v" },
      { id: "3-2-1", title: "3.2.1 Llaves", href: "/tema-3-ipc#3-2-1-llaves" },
      { id: "3-2-2", title: "3.2.2 Semáforos en derivados de System V", href: "/tema-3-ipc#3-2-2-semaforos" },
      { id: "3-3", title: "3.3 Memoria compartida", href: "/tema-3-ipc#3-3-memoria" },
      { id: "3-4", title: "3.4 Cola de mensajes", href: "/tema-3-ipc#3-4-cola-mensajes" },
      { id: "3-5", title: "3.5 Información de IPC por comandos", href: "/tema-3-ipc#3-5-info-ipc" },
    ]
  },
  {
    id: "tema-5",
    title: "5. Administración de memoria",
    href: "/tema-5-memoria",
    subtopics: [
      { id: "5-1", title: "5.1 Introducción", href: "/tema-5-memoria#5-1-introduccion" },
      { id: "5-3", title: "5.3 Modelos de multiprogramación", href: "/tema-5-memoria#5-3-modelos" },
      { id: "5-5", title: "5.5 Reasignación y protección", href: "/tema-5-memoria#5-5-reasignacion" },
      { id: "5-6", title: "5.6 Intercambio (Swap)", href: "/tema-5-memoria#5-6-intercambio" },
      { id: "5-8", title: "5.8 Registro de uso (Listas)", href: "/tema-5-memoria#5-8-registro-uso" },
      { id: "5-9", title: "5.9 Memoria virtual", href: "/tema-5-memoria#5-9-memoria-virtual" },
      { id: "5-10", title: "5.10 Funciones del sistema", href: "/tema-5-memoria#5-10-funciones" },
    ]
  },
  {
    id: "tema-6",
    title: "6. Sistema de Archivos",
    href: "/tema-6-archivos",
    subtopics: [
      { id: "6-1", title: "6.1 Introducción", href: "/tema-6-archivos#6-1-introduccion" },
      { id: "6-2", title: "6.2 Estructura lógica", href: "/tema-6-archivos#6-2-estructura-logica" },
      { id: "6-2-1", title: "6.2.1 Superbloque", href: "/tema-6-archivos#6-2-1-superbloque" },
      { id: "6-2-2", title: "6.2.2 Inodos", href: "/tema-6-archivos#6-2-2-inodos" },
      { id: "6-3", title: "6.3 Tipos de archivos", href: "/tema-6-archivos#6-3-tipos-archivos" },
      { id: "6-4", title: "6.4 Dispositivos E/S", href: "/tema-6-archivos#6-4-dispositivos" },
    ]
  },
  {
    id: "tema-7",
    title: "7. Señales",
    href: "/tema-7-senales",
    subtopics: [
      { id: "7-1", title: "7.1 Introducción a señales", href: "/tema-7-senales#7-1-intro" },
      { id: "7-2", title: "7.2 Función signal()", href: "/tema-7-senales#7-2-signal" },
      { id: "7-3", title: "7.3 setjmp / longjmp", href: "/tema-7-senales#7-3-setjmp" },
      { id: "7-4", title: "7.4 Función alarm()", href: "/tema-7-senales#7-4-alarm" },
    ]
  },
  {
    id: "tema-8",
    title: "8. Comandos POSIX",
    href: "/tema-8-comandos",
    subtopics: [
      { id: "8-1", title: "8.1 Comando pwd", href: "/tema-8-comandos#8-1-pwd" },
      { id: "8-2", title: "8.2 Comando cd", href: "/tema-8-comandos#8-2-cd" },
      { id: "8-3", title: "8.3 Comando mkdir", href: "/tema-8-comandos#8-3-mkdir" },
      { id: "8-4", title: "8.4 Comando rm", href: "/tema-8-comandos#8-4-rm" },
    ]
  }
];
