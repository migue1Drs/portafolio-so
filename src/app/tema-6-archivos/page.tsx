import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";

export default function Tema6Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 6"
        title="Arquitectura del sistema de archivos"
        description="Exploración de la estructura interna del sistema de archivos en Linux: inodos, bloques, directorios, descriptores de archivo y las llamadas al sistema para manipular archivos."
      />

      <article className="space-y-6 text-[#b0b8c4] leading-relaxed">

        <SectionHeading id="6-1-estructura" number="6.1" title="Estructura del sistema de archivos" />
        <p>
          En Linux, <strong className="text-white">&quot;todo es un archivo&quot;</strong>. El sistema de archivos se 
          organiza en una jerarquía de directorios partiendo de la raíz <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">/</code>. 
          Internamente, cada archivo está representado por un <strong className="text-white">inodo</strong> (index node) 
          que almacena los metadatos del archivo.
        </p>

        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm p-6 my-6">
          <h4 className="text-[#f5a623] font-bold text-sm uppercase tracking-widest mb-4">Componentes del sistema de archivos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-4">
              <span className="text-[#f5a623] font-bold">Superbloque</span>
              <p className="text-[#a0a0a0] mt-1">Información global: tamaño, # inodos libres, # bloques libres</p>
            </div>
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-4">
              <span className="text-[#f5a623] font-bold">Tabla de inodos</span>
              <p className="text-[#a0a0a0] mt-1">Metadatos de cada archivo: permisos, propietario, tamaño, punteros a bloques</p>
            </div>
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-4">
              <span className="text-[#f5a623] font-bold">Bloques de datos</span>
              <p className="text-[#a0a0a0] mt-1">Contenido real de los archivos almacenado en bloques de tamaño fijo</p>
            </div>
            <div className="bg-[#2d333b] border border-[#444c56] rounded p-4">
              <span className="text-[#f5a623] font-bold">Directorios</span>
              <p className="text-[#a0a0a0] mt-1">Archivos especiales que mapean nombres → inodos</p>
            </div>
          </div>
        </div>

        <LinuxTerminal
          command="stat /etc/passwd"
          output={`  Archivo: /etc/passwd
  Tamaño: 2847      	Bloques: 8          IO en bloques: 4096   archivo regular
Dispositivo: 802h/2050d	Inodo: 131074      Enlaces: 1
Acceso: (0644/-rw-r--r--)  UID: (    0/    root)   GID: (    0/    root)
Acceso: 2026-05-07 12:00:01.000000000 -0600
Modificación: 2026-05-01 10:30:00.000000000 -0600
     Cambio: 2026-05-01 10:30:00.000000000 -0600
  Creación: 2026-01-15 08:00:00.000000000 -0600`}
          title="bash — información del inodo con stat"
        />

        <SectionHeading id="6-2-descriptores" number="6.2" title="Descriptores de archivo" />
        <p>
          Cuando un proceso abre un archivo, el kernel le asigna un <strong className="text-white">descriptor de archivo</strong> (file 
          descriptor), que es un número entero no negativo. Los descriptores estándar son:
        </p>
        <ul className="list-none space-y-2 my-4 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-[#f5a623] font-mono font-bold">0</span>
            <span>— <strong className="text-white">stdin</strong> (entrada estándar)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#f5a623] font-mono font-bold">1</span>
            <span>— <strong className="text-white">stdout</strong> (salida estándar)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#f5a623] font-mono font-bold">2</span>
            <span>— <strong className="text-white">stderr</strong> (error estándar)</span>
          </li>
        </ul>

        <CopyCodeBlock
          filename="file_operations.c"
          language="C"
          code={`#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int main() {
    // Crear y escribir un archivo
    int fd = open("prueba_so.txt", O_CREAT | O_WRONLY | O_TRUNC, 0644);
    if (fd == -1) {
        perror("Error al abrir");
        exit(1);
    }
    
    printf("Archivo abierto con descriptor: %d\\n", fd);
    
    char *texto = "Contenido escrito con llamadas al sistema\\n";
    ssize_t bytes = write(fd, texto, strlen(texto));
    printf("Bytes escritos: %zd\\n", bytes);
    close(fd);
    
    // Leer el archivo
    fd = open("prueba_so.txt", O_RDONLY);
    char buffer[256];
    bytes = read(fd, buffer, sizeof(buffer) - 1);
    buffer[bytes] = '\\0';
    
    printf("Bytes leídos: %zd\\n", bytes);
    printf("Contenido: \\"%s\\"\\n", buffer);
    close(fd);
    
    // Ver descriptores abiertos del proceso
    printf("\\nDescriptores abiertos:\\n");
    printf("  stdin:  %d\\n", STDIN_FILENO);
    printf("  stdout: %d\\n", STDOUT_FILENO);
    printf("  stderr: %d\\n", STDERR_FILENO);
    
    return 0;
}`}
        />

        <LinuxTerminal
          command="gcc -o file_ops file_operations.c && ./file_ops"
          output={`Archivo abierto con descriptor: 3
Bytes escritos: 42
Bytes leídos: 42
Contenido: "Contenido escrito con llamadas al sistema
"

Descriptores abiertos:
  stdin:  0
  stdout: 1
  stderr: 2`}
          title="bash — operaciones con archivos"
        />

        <SectionHeading id="6-3-directorios" number="6.3" title="Operaciones con directorios" />

        <CopyCodeBlock
          filename="directory_ops.c"
          language="C"
          code={`#include <stdio.h>
#include <dirent.h>
#include <sys/stat.h>

int main() {
    DIR *dir = opendir(".");
    struct dirent *entry;
    struct stat file_stat;
    
    if (dir == NULL) {
        perror("opendir");
        return 1;
    }
    
    printf("%-25s %-10s %s\\n", "NOMBRE", "TIPO", "TAMAÑO");
    printf("%-25s %-10s %s\\n", "-------------------------", 
           "----------", "----------");
    
    while ((entry = readdir(dir)) != NULL) {
        stat(entry->d_name, &file_stat);
        
        char *tipo;
        if (S_ISDIR(file_stat.st_mode))
            tipo = "DIR";
        else if (S_ISREG(file_stat.st_mode))
            tipo = "FILE";
        else if (S_ISLNK(file_stat.st_mode))
            tipo = "LINK";
        else
            tipo = "OTHER";
        
        printf("%-25s %-10s %ld bytes\\n", 
               entry->d_name, tipo, file_stat.st_size);
    }
    
    closedir(dir);
    return 0;
}`}
        />

        <LinuxTerminal
          command="gcc -o dir_ops directory_ops.c && ./dir_ops"
          output={`NOMBRE                    TIPO       TAMAÑO
------------------------- ---------- ----------
.                         DIR        4096 bytes
..                        DIR        4096 bytes
file_operations.c         FILE       892 bytes
directory_ops.c           FILE       745 bytes
prueba_so.txt             FILE       42 bytes
fork_example.c            FILE       540 bytes`}
          title="bash — lectura de directorios"
        />

        <LinuxTerminal
          command="df -hT / && echo '---' && ls -li /etc/passwd /etc/shadow | head"
          output={`S.ficheros     Tipo   Tamaño Usados  Disp Uso% Montado en
/dev/sda2      ext4     50G    18G   30G  38% /
---
131074 -rw-r--r-- 1 root root   2847 mayo  1 10:30 /etc/passwd
131089 -rw-r----- 1 root shadow 1640 mayo  1 10:30 /etc/shadow`}
          title="bash — sistema de archivos y inodos"
        />

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> El sistema de archivos de Linux es una abstracción 
            elegante que permite tratar todo como un archivo, desde documentos hasta dispositivos de hardware. 
            Los inodos son la pieza central que almacena los metadatos, mientras que los bloques almacenan el contenido. 
            Las llamadas al sistema <code className="text-[#f5a623]">open()</code>, <code className="text-[#f5a623]">read()</code>, 
            <code className="text-[#f5a623]"> write()</code> y <code className="text-[#f5a623]">close()</code> son la interfaz 
            fundamental para interactuar con archivos a nivel de kernel.
          </p>
          <p>
            <strong className="text-white">¿Cómo mejorar?</strong> Implementar un programa que use <code className="text-[#f5a623]">lseek()</code> para 
            acceso aleatorio en archivos binarios, y explorar la creación de enlaces duros y simbólicos mediante 
            <code className="text-[#f5a623]"> link()</code> y <code className="text-[#f5a623]">symlink()</code>.
          </p>
        </ReflectionBox>

      </article>
    </div>
  );
}
