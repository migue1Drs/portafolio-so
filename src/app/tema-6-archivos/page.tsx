import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA6_QUIZ } from "@/lib/quiz-data";
import { FileSystemDiagram } from "@/components/ui/FileSystemDiagram";

export default function Tema6Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 6"
        title="Arquitectura del sistema de archivos"
        description="Estructura lógica, superbloque, inodos, tipos de archivos, metadatos, y administración de dispositivos E/S en UNIX/Linux."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* Intro */}
        <section>
          <p className="mb-4">
            El sistema de archivos en UNIX es una estructura formada por el <strong>boot</strong>, el <strong>superbloque</strong>, la <strong>lista de inodos</strong>, y el <strong>área de los datos</strong>. Dicha estructura se encuentra administrada por el Sistema de Archivo Extendido (Extended File System, como ext2, ext3, o ext4).
          </p>
          <SectionHeading id="6-1-introduccion" number="6.1" title="Introducción" />
          <p className="mb-4">
            Las características del sistema de archivos de UNIX y Linux incluyen una estructura jerárquica, consistencia, y manejo dinámico. El kernel trabaja con el sistema de archivos a un <strong>nivel lógico</strong>. Cada dispositivo tiene asociado un <em>número mayor</em> (major number) y un <em>número menor</em> (minor number), que indexan los controladores (drivers) encargados de transformar direcciones lógicas a físicas.
          </p>
        </section>

        {/* 6.2 */}
        <section>
          <SectionHeading id="6-2-estructura-logica" number="6.2" title="Estructura lógica del sistema de archivos" />
          <FileSystemDiagram />
        </section>

        {/* 6.2.1 */}
        <section>
          <SectionHeading id="6-2-1-superbloque" number="6.2.1" title="El superbloque" />
          <p className="mb-4">
            El superbloque contiene información como el tamaño del sistema de archivos, lista de bloques libres, tamaño de la lista de inodos, y banderas de modificación. El sistema mantiene una copia en la memoria caché para acelerar el acceso, que se sincroniza periódicamente con el disco (por medio de procesos como <code className="text-white">sync_supers</code>).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">sync / syncfs</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;unistd.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">void</span> <span className="text-[#d2a8ff]">sync</span>(<span className="text-[#ff7b72]">void</span>);<br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">syncfs</span>(<span className="text-[#ff7b72]">int</span> fd);
              </code>
            </div>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">statvfs (Estadísticas SA)</span>
              </div>
              <code className="block text-sm font-mono text-[#e6edf3]">
                <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/statvfs.h&gt;</span><br /><br />
                <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">statvfs</span>(<span className="text-[#ff7b72]">const char</span> *path, <span className="text-[#ff7b72]">struct statvfs</span> *buf);
              </code>
            </div>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Información del Superbloque (statvfs)</h3>
          <CopyCodeBlock 
            filename="info_vfs.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/statvfs.h>

int main() {
    struct statvfs vfs;
    char *ruta = "/";
    
    if (statvfs(ruta, &vfs) != 0) {
        perror("llamado de statvfs");
        exit(EXIT_FAILURE);
    }
    
    printf("Archivo: %s\\n", ruta);
    printf("Tamaño de bloques: %ld\\n", (long) vfs.f_bsize);
    printf("Bloques libres: %lu\\n", (unsigned long) vfs.f_bfree);
    printf("Número de Inodos: %lu\\n", (unsigned long) vfs.f_files);
    printf("Número de Inodos Libres: %lu\\n", (unsigned long) vfs.f_ffree);
    printf("ID del S.A.: %#lx\\n", (unsigned long) vfs.f_fsid);
    printf("Longitud max para archivo: %ld\\n", (long)vfs.f_namemax);
    
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc info_vfs.c -o info_vfs"
            runCommand="./info_vfs"
            output={`Archivo: /
Tamaño de bloques: 4096
Bloques libres: 1543820
Número de Inodos: 8192000
Número de Inodos Libres: 7543021
ID del S.A.: 0x98a2f1c
Longitud max para archivo: 255`} 
          />
        </section>

        {/* 6.2.2 */}
        <section>
          <SectionHeading id="6-2-2-inodos" number="6.2.2" title="Nodos índices (inodos)" />
          <p className="mb-4">
            Cada archivo en UNIX tiene asociado un <strong>inodo</strong>. Este no almacena el nombre del archivo ni sus datos, sino sus <strong>metadatos</strong>: tipo de archivo, permisos de acceso, identificador de usuario/grupo, tamaño, marcas de tiempo, y las referencias (punteros) a los bloques de datos donde realmente reside la información.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPOS STAT (Metadatos del Inodo)</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/stat.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">stat</span>(<span className="text-[#ff7b72]">const char</span> *pathname, <span className="text-[#ff7b72]">struct stat</span> *statbuf);<br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">fstat</span>(<span className="text-[#ff7b72]">int</span> fd, <span className="text-[#ff7b72]">struct stat</span> *statbuf);<br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">lstat</span>(<span className="text-[#ff7b72]">const char</span> *pathname, <span className="text-[#ff7b72]">struct stat</span> *statbuf);
            </code>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Inspeccionar Inodos y Tipos en un Directorio</h3>
          <CopyCodeBlock 
            filename="lista_inodos.c" 
            language="C" 
            code={`#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <dirent.h>
#include <sys/stat.h>
#include <sys/sysmacros.h>

int main(void) {
    char ruta[255];
    DIR *dir;
    struct dirent *direntrada;
    struct stat sb;

    if (getcwd(ruta, 255) == NULL) exit(EXIT_FAILURE);
    
    printf("Ruta actual: %s\\n", ruta);
    if ((dir = opendir(ruta)) == NULL) { perror("opendir"); exit(EXIT_FAILURE); }

    while ((direntrada = readdir(dir)) != NULL) {
        if (lstat(direntrada->d_name, &sb) == -1) continue;
        
        printf("%-15s | I-nodo: %-8ld | ", direntrada->d_name, (long)sb.st_ino);
        
        switch (sb.st_mode & S_IFMT) {
            case S_IFDIR: printf("Directorio\\n"); break;
            case S_IFREG: printf("Archivo Regular (%lld bytes)\\n", (long long)sb.st_size); break;
            default: printf("Otro tipo\\n"); break;
        }
    }
    closedir(dir);
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc lista_inodos.c -o lista_inodos"
            runCommand="./lista_inodos"
            output={`Ruta actual: /home/usuario/proyectos
.               | I-nodo: 1258402  | Directorio
..              | I-nodo: 1258000  | Directorio
lista_inodos.c  | I-nodo: 1258410  | Archivo Regular (864 bytes)
lista_inodos    | I-nodo: 1258411  | Archivo Regular (16432 bytes)`}
          />
        </section>

        {/* 6.3 */}
        <section>
          <SectionHeading id="6-3-tipos-archivos" number="6.3" title="Tipos de archivos y Dispositivos" />
          <p className="mb-4">
            En Linux existen cuatro tipos principales de archivos:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2 text-[#b0b8c4]">
            <li><strong className="text-white">Ordinarios (Regulares):</strong> Contienen datos secuenciales organizados linealmente.</li>
            <li><strong className="text-white">Directorios:</strong> Mapean nombres humanos a números de inodos. Tienen permisos especiales de ejecución (para atravesarlos).</li>
            <li><strong className="text-white">Dispositivos:</strong> Representados en <code className="text-[#58a6ff]">/dev</code>. Contienen un <code className="text-[#f5a623]">major number</code> (tipo de driver) y un <code className="text-[#f5a623]">minor number</code> (unidad específica). Se dividen en dispositivos de bloque (usan caché, bloques fijos) y dispositivos de carácter (secuencias de bytes).</li>
            <li><strong className="text-white">Comunicación (FIFOs/Pipes):</strong> Archivos transitorios (first-in-first-out).</li>
          </ul>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Extraer Major y Minor Number de un Dispositivo</h3>
          <CopyCodeBlock 
            filename="dispositivo_mm.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <sys/sysmacros.h>

int main(int argc, char *argv[]) {
    struct stat sb;
    if (argc != 2) { fprintf(stderr, "Uso: %s <dispositivo>\\n", argv[0]); exit(1); }
    
    if (stat(argv[1], &sb) == -1) { perror("stat"); exit(1); }
    
    printf("Archivo: %s\\n", argv[1]);
    if (S_ISCHR(sb.st_mode)) printf("Tipo: Dispositivo de caracteres (Char)\\n");
    else if (S_ISBLK(sb.st_mode)) printf("Tipo: Dispositivo de bloques (Block)\\n");
    else { printf("No es un dispositivo\\n"); exit(1); }
    
    printf("Número Mayor (Major): %u\\n", major(sb.st_rdev));
    printf("Número Menor (Minor): %u\\n", minor(sb.st_rdev));
    
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc dispositivo_mm.c -o dispositivo_mm"
            runCommand="./dispositivo_mm /dev/tty1"
            output={`Archivo: /dev/tty1
Tipo: Dispositivo de caracteres (Char)
Número Mayor (Major): 4
Número Menor (Minor): 1`}
          />
        </section>

        {/* 6.4 */}
        <section>
          <SectionHeading id="6-4-dispositivos" number="6.4" title="Dispositivos de Entrada y Salida (ioctl)" />
          <p className="mb-4">
            El SO maneja operaciones de E/S con dispositivos, midiendo tiempos de búsqueda, latencia de giro, y acceso. En la terminal (<code className="text-[#58a6ff]">/dev/tty</code>), que es un dispositivo de carácter, se pueden enviar configuraciones o extraer datos directamente del hardware con la función de control de entrada y salida: <code className="text-[#f5a623]">ioctl()</code>.
          </p>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5 my-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
              <span className="text-xs font-bold text-[#58a6ff] uppercase tracking-wider">PROTOTIPO ioctl</span>
            </div>
            <code className="block text-sm font-mono text-[#e6edf3]">
              <span className="text-[#ff7b72]">#include</span> <span className="text-[#a5d6ff]">&lt;sys/ioctl.h&gt;</span><br /><br />
              <span className="text-[#ff7b72]">int</span> <span className="text-[#d2a8ff]">ioctl</span>(<span className="text-[#ff7b72]">int</span> fd, <span className="text-[#ff7b72]">unsigned long</span> request, <span className="text-[#ff7b72]">char</span> *argp, ...);
            </code>
          </div>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Ejemplo: Obtener tamaño de la ventana de la terminal y Dirección MAC</h3>
          <CopyCodeBlock 
            filename="info_red_term.c" 
            language="C" 
            code={`#include <stdio.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <string.h>
#include <net/if.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main() {
    // 1. Obtener tamaño de terminal (vía STDOUT)
    struct winsize w;
    if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &w) != -1) {
        printf("--- Terminal ---\\n");
        printf("Filas: %d, Columnas: %d\\n", w.ws_row, w.ws_col);
    }
    
    // 2. Obtener MAC Address de una interfaz
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    struct ifreq ifr;
    strncpy(ifr.ifr_name, "eth0", IFNAMSIZ - 1); // interfaz de prueba
    
    if (ioctl(sock, SIOCGIFHWADDR, &ifr) != -1) {
        unsigned char *mac = (unsigned char *)ifr.ifr_hwaddr.sa_data;
        printf("\\n--- Red (eth0) ---\\n");
        printf("MAC: %02x:%02x:%02x:%02x:%02x:%02x\\n",
               mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    }
    close(sock);
    return 0;
}`} 
            compileCommand="gcc info_red_term.c -o info_red_term"
            runCommand="./info_red_term"
            output={`--- Terminal ---
Filas: 24, Columnas: 80

--- Red (eth0) ---
MAC: 00:1a:2b:3c:4d:5e`}
          />
        </section>

        {/* Ejercicios */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 my-8">
          <h3 className="text-[#58a6ff] font-bold text-lg mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            Ejercicios Propuestos - Resoluciones
          </h3>
          <ol className="list-decimal list-inside space-y-4 text-sm">
            <li>
              <strong className="text-white">Comandos para analizar Archivos y Bloques:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><code className="text-[#58a6ff]">df</code>: (Disk Free) Muestra el espacio libre y usado de los sistemas de archivos montados.</li>
                <li><code className="text-[#58a6ff]">du</code>: (Disk Usage) Resume y calcula el tamaño total de los archivos/directorios.</li>
                <li><code className="text-[#58a6ff]">fsck</code>: Verifica la consistencia del SA y repara inodos/bloques huérfanos.</li>
                <li><code className="text-[#58a6ff]">lsblk / blkid</code>: Muestra los dispositivos de bloque en forma de árbol y extrae los UUID / tipos de particiones (ej. ext4, swap).</li>
              </ul>
            </li>
            <li>
              <strong className="text-white">Herramientas Avanzadas de E/S:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-[#8b949e]">
                <li><code className="text-[#58a6ff]">iotop</code>: Permite ver qué procesos están consumiendo más ancho de banda de disco en tiempo real.</li>
                <li><code className="text-[#58a6ff]">sysstat (iostat) / dstat</code>: Grafica estadísticas de cuellos de botella de hardware de red y disco.</li>
              </ul>
            </li>
          </ol>
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Aprendí que los archivos en UNIX no están definidos por sus nombres, sino por sus <strong>inodos</strong>. Los directorios solo son listas que vinculan nombres humanos con esos inodos. También descubrí que el hardware es tratado universalmente como un archivo dentro de <code className="text-white">/dev</code>, separándose en dispositivos de bloque (usando buffer/caché) y de carácter (flujos continuos). Funciones como <code className="text-[#f5a623]">ioctl()</code> nos dan la flexibilidad de interactuar profundamente con estos drivers.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorarla?</strong> Se podría crear un explorador de archivos básico desde la terminal en C que aplique <code className="text-[#f5a623]">stat()</code> recursivamente a un directorio, calculando el tamaño sumado de sus directorios internos para simular cómo opera el comando <code className="text-white">du -sh</code>.
          </p>
        </ReflectionBox>

        <TopicQuiz topicId="tema-6" title="Test - Sistema de Archivos" questions={TEMA6_QUIZ} />
        <ReadMarker topicId="tema-6" />
      </article>
    </div>
  );
}
