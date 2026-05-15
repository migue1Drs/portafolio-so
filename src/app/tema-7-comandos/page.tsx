import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { SyscallCard } from "@/components/ui/SyscallCard";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA8_QUIZ } from "@/lib/quiz-data";

export default function Tema8Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 7"
        title="Implementación de Comandos"
        description="Construcción e implementación en C de los comandos fundamentales del sistema operativo utilizando llamadas al sistema."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        <section>
          <p className="mb-4">
            En este capítulo exploraremos la implementación real de comandos comunes del sistema. Todo comando en UNIX o Linux es un programa que internamente realiza <strong>llamadas al sistema (system calls)</strong> para interactuar con el kernel.
          </p>
        </section>

        {/* 8.1 Sistema de Archivos */}
        <section>
          <SectionHeading id="8-1-sistema-archivos" number="7.1" title="Sistema de Archivos" />
          <p className="mb-6">
            Comandos encargados de la navegación, creación, lectura, modificación y borrado de directorios y archivos.
          </p>

          <h3 id="cmd-pwd" className="text-white font-bold mb-3 mt-6">Comando pwd</h3>
          <p className="mb-4 text-sm">
            Muestra la ruta absoluta del <strong>directorio de trabajo actual</strong>. Internamente invoca <code className="text-[#f5a623]">getcwd()</code>, que recorre la cadena de directorios padre hasta llegar a la raíz (<code className="text-[#f5a623]">/</code>) y construye la ruta completa. Es uno de los comandos más básicos de navegación en cualquier shell UNIX.
          </p>
          <SyscallCard
            name="getcwd"
            prototype="char *getcwd(char *buf, size_t size);"
            header="<unistd.h>"
            description="Obtiene la ruta absoluta del directorio de trabajo actual y la almacena en el buffer proporcionado."
            returns="Puntero al buffer con la ruta en caso de éxito, o NULL si ocurre un error (buffer insuficiente, permisos, etc.)."
            params={[
              { name: "buf", desc: "Buffer donde se almacenará la ruta absoluta del directorio actual." },
              { name: "size", desc: "Tamaño máximo en bytes del buffer proporcionado." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_pwd.c" language="C" 
            code={`#include <stdio.h>
#include <unistd.h>

void function_pwd(char *parametros[]) {
    if (parametros[1] != NULL) {
        printf("Error: no require parametros\\n");
        return;
    }
    char cwd[4096];
    if (getcwd(cwd, sizeof(cwd)) != NULL) {
        printf("%s\\n", cwd);
    } else {
        perror("pwd error");
    }
}

int main() {
    char *params[] = {"pwd", NULL};
    function_pwd(params);
    return 0;
}`} 
            compileCommand="gcc cmd_pwd.c -o cmd_pwd"
            runCommand="./cmd_pwd"
            output={`/home/usuario/proyectos`}
          />

          <h3 id="cmd-cd" className="text-white font-bold mb-3 mt-10">Comando cd</h3>
          <p className="mb-4 text-sm">
            Cambia el <strong>directorio de trabajo actual</strong> del proceso. A diferencia de otros comandos, <code className="text-[#f5a623]">cd</code> debe ser un comando integrado (<em>built-in</em>) del shell, ya que si se ejecutara como proceso externo, el cambio de directorio solo afectaría al proceso hijo y no al shell padre. Si no se proporciona argumento, navega al directorio <code className="text-[#f5a623]">HOME</code> del usuario.
          </p>
          <SyscallCard
            name="chdir"
            prototype="int chdir(const char *path);"
            header="<unistd.h>"
            description="Cambia el directorio de trabajo actual del proceso que la invoca a la ruta especificada."
            returns="0 en éxito, -1 en error (establece errno: ENOENT si no existe, EACCES si no tiene permiso, ENOTDIR si no es directorio)."
            params={[
              { name: "path", desc: "Ruta absoluta o relativa del directorio destino." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_cd.c" language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void function_cd(char *parametros[]) {
    char *ruta;
    if (parametros[1] == NULL) {
        ruta = getenv("HOME");
        if (ruta == NULL) {
            fprintf(stderr, "cd: la variable HOME no está definida\\n");
            return;
        }
    } else {
        ruta = parametros[1];
    }
    if (chdir(ruta) == -1) {
        perror("cd error");
    } else {
        printf("Directorio cambiado a: %s\\n", ruta);
    }
}

int main() {
    char *params[] = {"cd", "/tmp", NULL};
    function_cd(params);
    return 0;
}`} 
            compileCommand="gcc cmd_cd.c -o cmd_cd"
            runCommand="./cmd_cd"
            output={`Directorio cambiado a: /tmp`}
          />

          <h3 id="cmd-mkdir" className="text-white font-bold mb-3 mt-10">Comando mkdir</h3>
          <p className="mb-4 text-sm">
            Crea un <strong>nuevo directorio</strong> en el sistema de archivos. Utiliza la syscall <code className="text-[#f5a623]">mkdir()</code> que crea una nueva entrada de directorio con los permisos especificados por el parámetro <code className="text-[#f5a623]">mode</code>. Los permisos finales son modificados por la <code className="text-[#f5a623]">umask</code> del proceso. El manejo de <code className="text-[#f5a623]">errno</code> permite diferenciar entre errores como directorio existente o permisos insuficientes.
          </p>
          <SyscallCard
            name="mkdir"
            prototype="int mkdir(const char *pathname, mode_t mode);"
            header="<sys/stat.h>"
            description="Crea un nuevo directorio vacío con el nombre y permisos especificados. Los permisos efectivos se calculan como (mode & ~umask)."
            returns="0 en éxito, -1 en error (EEXIST si ya existe, EACCES si no tiene permiso en el directorio padre, ENOENT si la ruta padre no existe)."
            params={[
              { name: "pathname", desc: "Ruta del directorio a crear." },
              { name: "mode", desc: "Permisos del directorio (ej. 0777). Se aplica la umask del proceso." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_mkdir.c" language="C" 
            code={`#include <stdio.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <errno.h>

void function_mkdir(char *parametros[]) {
    if (parametros[1] == NULL) {
        printf("Error: requiere una ruta\\n");
        return;
    }
    mode_t mode = 0777;
    if (mkdir(parametros[1], mode) == -1) {
        switch (errno) {
            case EEXIST: fprintf(stderr, "archivo ya existente\\n"); break;
            case EACCES: fprintf(stderr, "Permiso denegado\\n"); break;
            default: perror("mkdir: error"); break;
        }
    } else {
        printf("Directorio '%s' creado.\\n", parametros[1]);
    }
}

int main() {
    char *params[] = {"mkdir", "nueva_carpeta", NULL};
    function_mkdir(params);
    return 0;
}`} 
            compileCommand="gcc cmd_mkdir.c -o cmd_mkdir"
            runCommand="./cmd_mkdir"
            output={`Directorio 'nueva_carpeta' creado.`}
          />

          <h3 id="cmd-ls" className="text-white font-bold mb-3 mt-10">Comando ls</h3>
          <p className="mb-4 text-sm">
            Lista el contenido de un directorio. Esta implementación soporta las banderas <code className="text-[#f5a623]">-a</code> (mostrar ocultos), <code className="text-[#f5a623]">-l</code> (formato largo con permisos, propietario, tamaño y fecha) y <code className="text-[#f5a623]">-i</code> (mostrar número de inodo). Internamente combina <code className="text-[#f5a623]">opendir()</code>/<code className="text-[#f5a623]">readdir()</code> para iterar entradas y <code className="text-[#f5a623]">stat()</code> para obtener metadatos detallados de cada archivo.
          </p>
          <SyscallCard
            name="opendir"
            manSection={3}
            prototype="DIR *opendir(const char *name);"
            header="<dirent.h>"
            description="Abre un flujo de directorio (DIR stream) asociado al directorio indicado. Se usa junto con readdir() para iterar sobre cada entrada del directorio."
            returns="Puntero a DIR en éxito, NULL en error. Se debe cerrar con closedir() al terminar."
            params={[
              { name: "name", desc: "Ruta del directorio a abrir." },
            ]}
            structDef={`struct dirent {
    ino_t  d_ino;       // Número de inodo
    char   d_name[256]; // Nombre del archivo
    // ... otros campos dependientes del SO
};`}
          />
          <CopyCodeBlock 
            filename="cmd_ls.c" language="C" 
            code={`#include <stdio.h>
#include <dirent.h>
#include <sys/stat.h>
#include <pwd.h>
#include <grp.h>
#include <time.h>

void function_ls(char *parametros[]) {
    int mostrar_ocultos = 0, formato_largo = 0, mostrar_inodo = 0;
    char *ruta = ".";

    for (int i = 1; parametros[i] != NULL; i++) {
        if (parametros[i][0] == '-') {
            for (int j = 1; parametros[i][j] != '\\0'; j++) {
                switch (parametros[i][j]) {
                    case 'a': mostrar_ocultos = 1; break;
                    case 'l': formato_largo = 1; break;
                    case 'i': mostrar_inodo = 1; break;
                    default: return;
                }
            }
        } else ruta = parametros[i];
    }

    DIR *directorio = opendir(ruta);
    if (!directorio) { perror("ls"); return; }

    struct dirent *entradadir;
    struct stat info_archivo;
    char path_completo[2048];

    while ((entradadir = readdir(directorio)) != NULL) {
        if (!mostrar_ocultos && entradadir->d_name[0] == '.') continue;
        snprintf(path_completo, sizeof(path_completo), "%s/%s", ruta, entradadir->d_name);

        if (formato_largo) {
            if (stat(path_completo, &info_archivo) == -1) continue;
            if (mostrar_inodo) printf("%-8lu ", (unsigned long)info_archivo.st_ino);
            
            printf((S_ISDIR(info_archivo.st_mode)) ? "d" : "-");
            printf((info_archivo.st_mode & S_IRUSR) ? "r" : "-");
            printf((info_archivo.st_mode & S_IWUSR) ? "w" : "-");
            printf((info_archivo.st_mode & S_IXUSR) ? "x" : "-");
            printf((info_archivo.st_mode & S_IRGRP) ? "r" : "-");
            printf((info_archivo.st_mode & S_IWGRP) ? "w" : "-");
            printf((info_archivo.st_mode & S_IXGRP) ? "x" : "-");
            printf((info_archivo.st_mode & S_IROTH) ? "r" : "-");
            printf((info_archivo.st_mode & S_IWOTH) ? "w" : "-");
            printf((info_archivo.st_mode & S_IXOTH) ? "x " : "- ");

            printf("%3lu ", (unsigned long)info_archivo.st_nlink);
            struct passwd *pw = getpwuid(info_archivo.st_uid);
            struct group  *gr = getgrgid(info_archivo.st_gid);
            printf("%-8s %-8s ", (pw) ? pw->pw_name : "N/A", (gr) ? gr->gr_name : "N/A");
            printf("%8ld ", (long)info_archivo.st_size);

            char t_str[80];
            struct tm *t_info = localtime(&info_archivo.st_mtime);
            strftime(t_str, sizeof(t_str), "%b %d %H:%M", t_info);
            printf("%s %s\\n", t_str, entradadir->d_name);
        } else {
            if (mostrar_inodo) printf("%lu ", (unsigned long)entradadir->d_ino);
            printf("%s  ", entradadir->d_name);
        }
    }
    if (!formato_largo) printf("\\n");
    closedir(directorio);
}

int main() {
    char *params[] = {"ls", "-l", ".", NULL};
    function_ls(params);
    return 0;
}`} 
            compileCommand="gcc cmd_ls.c -o cmd_ls"
            runCommand="./cmd_ls"
            output={`-rw-r--r--   1 usuario  grupo        1423 Nov 21 14:30 cmd_ls.c
-rwxr-xr-x   1 usuario  grupo       16584 Nov 21 14:30 cmd_ls`}
          />

          <h3 id="cmd-rm" className="text-white font-bold mb-3 mt-10">Comando rm</h3>
          <p className="mb-4 text-sm">
            Elimina un archivo del sistema de archivos. A nivel del kernel, <code className="text-[#f5a623]">unlink()</code> no borra los datos directamente, sino que <strong>elimina el enlace</strong> (link) del nombre al inodo. El espacio en disco solo se libera cuando el contador de enlaces del inodo llega a cero y ningún proceso tiene el archivo abierto.
          </p>
          <SyscallCard
            name="unlink"
            prototype="int unlink(const char *pathname);"
            header="<unistd.h>"
            description="Elimina un nombre (hard link) del sistema de archivos. Si es el último enlace al inodo y ningún proceso lo tiene abierto, los datos se liberan."
            returns="0 en éxito, -1 en error (ENOENT si no existe, EACCES si no tiene permiso, EISDIR si es un directorio)."
            params={[
              { name: "pathname", desc: "Ruta del archivo a eliminar." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_rm.c" language="C" 
            code={`#include <stdio.h>
#include <unistd.h>
#include <errno.h>

void function_rm(char *parametros[]) {
    if (parametros[1] == NULL) {
        fprintf(stderr, "rm: falta un operando (ruta del archivo)\\n");
        return;
    }
    if (unlink(parametros[1]) == -1) {
        switch (errno) {
            case ENOENT: fprintf(stderr, "rm: no se puede borrar '%s': No existe el archivo\\n", parametros[1]); break;
            case EACCES: fprintf(stderr, "rm: no se puede borrar '%s': Permiso denegado\\n", parametros[1]); break;
            case EISDIR: fprintf(stderr, "rm: no se puede borrar '%s': es un directorio\\n", parametros[1]); break;
            default: perror("error al eliminar"); break;
        }
    } else {
        printf("Archivo '%s' eliminado.\\n", parametros[1]);
    }
}

int main() {
    char *params[] = {"rm", "archivo_viejo.txt", NULL};
    function_rm(params);
    return 0;
}`} 
            compileCommand="gcc cmd_rm.c -o cmd_rm"
            runCommand="./cmd_rm"
            output={`rm: no se puede borrar 'archivo_viejo.txt': No existe el archivo`}
          />

          <h3 id="cmd-rename" className="text-white font-bold mb-3 mt-10">Comando rename</h3>
          <p className="mb-4 text-sm">
            Renombra o mueve un archivo dentro del mismo sistema de archivos. La syscall <code className="text-[#f5a623]">rename()</code> es una operación <strong>atómica</strong>: si el archivo destino ya existe, se reemplaza sin dejar ventana de tiempo donde no exista ninguno de los dos. Esto la hace ideal para actualizaciones seguras de archivos de configuración.
          </p>
          <SyscallCard
            name="rename"
            prototype="int rename(const char *oldpath, const char *newpath);"
            header="<stdio.h>"
            description="Renombra un archivo o directorio. Si newpath ya existe, se reemplaza atómicamente. Ambas rutas deben estar en el mismo sistema de archivos montado."
            returns="0 en éxito, -1 en error (ENOENT si el archivo origen no existe, EXDEV si están en filesystems distintos)."
            params={[
              { name: "oldpath", desc: "Ruta actual del archivo o directorio." },
              { name: "newpath", desc: "Nueva ruta o nombre destino." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_rename.c" language="C" 
            code={`#include <stdio.h>

void function_rename(char *parametros[]) {
    if (parametros[1] == NULL || parametros[2] == NULL) {
        fprintf(stderr, "rename: faltan operandos\\n");
        return;
    }
    if (rename(parametros[1], parametros[2]) == -1) {
        perror("rename error"); 
        return;
    }
    printf("rename: %s -> %s\\n", parametros[1], parametros[2]);
}

int main() {
    char *params[] = {"rename", "viejo.txt", "nuevo.txt", NULL};
    function_rename(params);
    return 0;
}`} 
            compileCommand="gcc cmd_rename.c -o cmd_rename"
            runCommand="./cmd_rename"
            output={`rename error: No such file or directory`}
          />

          <h3 id="cmd-cat" className="text-white font-bold mb-3 mt-10">Comando cat</h3>
          <p className="mb-4 text-sm">
            Muestra el contenido de un archivo en la salida estándar. Opera a nivel de <strong>descriptores de archivo</strong> usando las syscalls <code className="text-[#f5a623]">open()</code>, <code className="text-[#f5a623]">read()</code> y <code className="text-[#f5a623]">write()</code>, lo cual es más eficiente que las funciones de la biblioteca estándar de C (<code className="text-[#f5a623]">fopen</code>/<code className="text-[#f5a623]">fread</code>) al evitar el buffering adicional. Antes de leer, verifica con <code className="text-[#f5a623]">stat()</code> que la ruta sea un archivo regular y no un directorio.
          </p>
          <SyscallCard
            name="read"
            prototype="ssize_t read(int fd, void *buf, size_t count);"
            header="<unistd.h>"
            description="Lee hasta count bytes del descriptor de archivo fd al buffer buf. Es la syscall fundamental de lectura en UNIX: todo archivo, socket o pipe se lee con read()."
            returns="Número de bytes leídos (puede ser menor que count), 0 indica fin de archivo (EOF), -1 en error."
            params={[
              { name: "fd", desc: "Descriptor de archivo obtenido con open()." },
              { name: "buf", desc: "Buffer donde se almacenarán los datos leídos." },
              { name: "count", desc: "Número máximo de bytes a leer." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_cat.c" language="C" 
            code={`#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

void function_cat(char *parametros[]) {
    struct stat info_archivo;
    if (parametros[1] == NULL) {
        fprintf(stderr, "cat: falta un operando\\n"); return;
    }
    if (stat(parametros[1], &info_archivo) == -1) {
        perror("cat error"); return;
    }
    if (S_ISDIR(info_archivo.st_mode)) {
        printf("cat: %s es un directorio\\n", parametros[1]);
    } else if (S_ISREG(info_archivo.st_mode)) {
        int fd = open(parametros[1], O_RDONLY);
        char buffer[1024];
        ssize_t num;
        if (fd == -1) {
            perror("No se pudo abrir el archivo");
        } else {
            while ((num = read(fd, buffer, sizeof(buffer))) > 0) {
                if (write(STDOUT_FILENO, buffer, num) == -1) break;
            }   
            close(fd);
        }
    } else {
        printf("cat: %s no es un archivo regular\\n", parametros[1]);
    }
}

int main() {
    char *params[] = {"cat", "/etc/hostname", NULL};
    function_cat(params);
    return 0;
}`} 
            compileCommand="gcc cmd_cat.c -o cmd_cat"
            runCommand="./cmd_cat"
            output={`migue1drs-pc`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Descubrí cómo el sistema operativo implementa comandos fundamentales para la <a href="#8-1-sistema-archivos" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">navegación y manipulación de archivos y directorios</a> (<code className="text-[#f5a623]">pwd</code>, <code className="text-[#f5a623]">cd</code>, <code className="text-[#f5a623]">mkdir</code>, <code className="text-[#f5a623]">rmdir</code>, <code className="text-[#f5a623]">ls</code>, <code className="text-[#f5a623]">rm</code>, <code className="text-[#f5a623]">cp</code>). Vi que detrás de la interfaz de la consola, todos estos comandos invocan llamadas al sistema (<code className="text-[#58a6ff]">getcwd</code>, <code className="text-[#58a6ff]">chdir</code>, <code className="text-[#58a6ff]">unlink</code>) para interactuar directamente con el kernel.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Añadiendo soporte para banderas comunes a mi implementación en C, por ejemplo, permitiendo que mi comando <code className="text-[#f5a623]">ls</code> acepte el argumento <code className="text-[#58a6ff]">-a</code> para mostrar también los archivos ocultos (los que comienzan con punto).
            </p>
          </ReflectionBox>
        </section>

        {/* 8.2 Información de Archivos y Dispositivos */}
        <section>
          <SectionHeading id="8-2-info-archivos" number="7.2" title="Información de Archivos y Dispositivos" />
          
          <h3 id="cmd-stat" className="text-white font-bold mb-3 mt-6">Comando stat</h3>
          <p className="mb-4 text-sm">
            Muestra los <strong>metadatos completos</strong> de un archivo o directorio: tamaño, número de inodo, cantidad de enlaces duros, permisos, UID/GID del propietario, timestamps de acceso, modificación y cambio de estado, y el tipo de archivo. Toda esta información se obtiene de la estructura <code className="text-[#f5a623]">struct stat</code> que el kernel llena con los datos almacenados en el inodo.
          </p>
          <SyscallCard
            name="stat"
            prototype="int stat(const char *pathname, struct stat *statbuf);"
            header="<sys/stat.h>"
            description="Obtiene información detallada sobre un archivo identificado por su ruta. Lee los metadatos del inodo sin necesidad de abrir el archivo."
            returns="0 en éxito, -1 en error (ENOENT si no existe, EACCES si no tiene permiso de lectura en el directorio padre)."
            params={[
              { name: "pathname", desc: "Ruta del archivo a consultar." },
              { name: "statbuf", desc: "Puntero a struct stat donde se almacenarán los metadatos." },
            ]}
            structDef={`struct stat {
    ino_t     st_ino;     // Número de inodo
    mode_t    st_mode;    // Tipo y permisos del archivo
    nlink_t   st_nlink;   // Número de enlaces duros
    uid_t     st_uid;     // UID del propietario
    gid_t     st_gid;     // GID del grupo
    off_t     st_size;    // Tamaño total en bytes
    blkcnt_t  st_blocks;  // Bloques de 512B asignados
    time_t    st_atime;   // Último acceso
    time_t    st_mtime;   // Última modificación
    time_t    st_ctime;   // Último cambio de estado
};`}
          />
          <CopyCodeBlock 
            filename="cmd_stat.c" language="C" 
            code={`#include <stdio.h>
#include <sys/stat.h>
#include <time.h>
#include <sys/sysmacros.h>

void function_stat(char *parametros[]) {
    struct stat info;
    if (parametros[1] == NULL) return;
    if (stat(parametros[1], &info) == -1) { perror("stat"); return; }

    printf("  Fichero: %s\\n", parametros[1]);
    printf("  Tamaño: %-10ld Bloques: %-10ld Bloque E/S: %ld\\n", 
           (long)info.st_size, (long)info.st_blocks, (long)info.st_blksize);
    printf("  Inodo: %-11lu Enlaces: %lu\\n", 
           (unsigned long)info.st_ino, (unsigned long)info.st_nlink);
    printf("  Acceso: (0%o)\\tUid: (%d)\\tGid: (%d)\\n", 
           info.st_mode & 07777, info.st_uid, info.st_gid);

    if (S_ISCHR(info.st_mode)) {
        printf("  Tipo: Dispositivo de caracteres\\n");
    } else if (S_ISBLK(info.st_mode)) {
        printf("  Tipo: Dispositivo de bloques\\n");
    } else if (S_ISDIR(info.st_mode)) {
        printf("  Tipo: Directorio\\n");
    } else if (S_ISREG(info.st_mode)) {
        printf("  Tipo: Archivo regular\\n");
    }

    printf("  Acceso (atime): %s", ctime(&info.st_atime));
    printf("  Modif. (mtime): %s", ctime(&info.st_mtime));
    printf("  Cambio (ctime): %s", ctime(&info.st_ctime));
}

int main() {
    char *params[] = {"stat", "/etc", NULL};
    function_stat(params);
    return 0;
}`} 
            compileCommand="gcc cmd_stat.c -o cmd_stat"
            runCommand="./cmd_stat"
            output={`  Fichero: /etc
  Tamaño: 12288      Bloques: 24         Bloque E/S: 4096
  Inodo: 1310721     Enlaces: 145
  Acceso: (0755)	Uid: (0)	Gid: (0)
  Tipo: Directorio
  Acceso (atime): Wed May 13 23:45:12 2026
  Modif. (mtime): Wed May 13 23:40:00 2026
  Cambio (ctime): Wed May 13 23:40:00 2026`}
          />

          <h3 id="cmd-statvfs" className="text-white font-bold mb-3 mt-10">Comando statvfs</h3>
          <p className="mb-4 text-sm">
            Muestra información global del <strong>sistema de archivos</strong> montado: tamaño de bloque, total de bloques y bloques libres, total de inodos, e ID del filesystem. Es el equivalente en C del comando <code className="text-[#f5a623]">df</code>. La estructura <code className="text-[#f5a623]">statvfs</code> proporciona una vista abstracta que funciona independientemente del filesystem subyacente (ext4, xfs, btrfs, etc.).
          </p>
          <SyscallCard
            name="statvfs"
            prototype="int statvfs(const char *path, struct statvfs *buf);"
            header="<sys/statvfs.h>"
            description="Obtiene estadísticas del sistema de archivos donde reside la ruta indicada: espacio total, libre, inodos disponibles, etc."
            returns="0 en éxito, -1 en error."
            params={[
              { name: "path", desc: "Cualquier ruta dentro del sistema de archivos a consultar." },
              { name: "buf", desc: "Puntero a struct statvfs donde se almacenarán las estadísticas." },
            ]}
            structDef={`struct statvfs {
    unsigned long f_bsize;   // Tamaño de bloque del FS
    unsigned long f_blocks;  // Total de bloques
    unsigned long f_bfree;   // Bloques libres
    unsigned long f_bavail;  // Bloques disponibles (no-root)
    unsigned long f_files;   // Total de inodos
    unsigned long f_ffree;   // Inodos libres
    unsigned long f_fsid;    // ID del sistema de archivos
};`}
          />
          <CopyCodeBlock 
            filename="cmd_statvfs.c" language="C" 
            code={`#include <stdio.h>
#include <sys/statvfs.h>

void function_statvfs(char *parametros[]) {
    struct statvfs vfs;
    char *ruta = parametros[1] ? parametros[1] : ".";

    if (statvfs(ruta, &vfs) != 0) { perror("statvfs"); return; }

    printf("  Sistema de Archivos montado en: %s\\n", ruta);
    printf("  Tamaño de bloques: %ld\\n",  (long) vfs.f_bsize);
    printf("  Tamaño en unidades (Total): %lu\\n", (unsigned long) vfs.f_blocks);
    printf("  Bloques libres: %lu\\n",  (unsigned long) vfs.f_bfree);
    printf("  Número de Inodos (Total): %lu\\n",  (unsigned long) vfs.f_files);
    printf("  ID del S.A.: %#lx\\n",  (unsigned long) vfs.f_fsid);
}

int main() {
    char *params[] = {"statvfs", "/", NULL};
    function_statvfs(params);
    return 0;
}`} 
            compileCommand="gcc cmd_statvfs.c -o cmd_statvfs"
            runCommand="./cmd_statvfs"
            output={`  Sistema de Archivos montado en: /
  Tamaño de bloques: 4096
  Tamaño en unidades (Total): 60055102
  Bloques libres: 12543000
  Número de Inodos (Total): 15261696
  ID del S.A.: 0x9b3a4d0`}
          />

          <h3 id="cmd-disp" className="text-white font-bold mb-3 mt-10">Comando disp (Dispositivos)</h3>
          <p className="mb-4 text-sm">
            Lista los <strong>dispositivos de hardware</strong> registrados en <code className="text-[#f5a623]">/dev</code>. Utiliza <code className="text-[#f5a623]">lstat()</code> para identificar si cada entrada es un dispositivo de caracteres (<code className="text-[#f5a623]">S_ISCHR</code>) o de bloques (<code className="text-[#f5a623]">S_ISBLK</code>), y las macros <code className="text-[#f5a623]">major()</code>/<code className="text-[#f5a623]">minor()</code> para extraer los números de dispositivo que el kernel utiliza para identificar el driver asociado.
          </p>
          <SyscallCard
            name="lstat"
            prototype="int lstat(const char *pathname, struct stat *statbuf);"
            header="<sys/stat.h>"
            description="Idéntica a stat(), pero si pathname es un enlace simbólico, devuelve información del enlace mismo y no del archivo al que apunta. Esencial para recorrer /dev sin seguir symlinks."
            returns="0 en éxito, -1 en error."
            params={[
              { name: "pathname", desc: "Ruta del archivo o enlace simbólico a consultar." },
              { name: "statbuf", desc: "Puntero a struct stat donde se almacenarán los metadatos." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_disp.c" language="C" 
            code={`#include <stdio.h>
#include <dirent.h>
#include <sys/stat.h>
#include <sys/sysmacros.h>

void function_disp(char *parametros[]) {
    DIR *dir = opendir("/dev");
    struct dirent *entrada;
    struct stat info;
    char ruta[512];

    if (!dir) { perror("/dev"); return; }
    printf("%-20s %-10s %-8s %-8s\\n", "Dispositivo", "Tipo", "Major", "Minor");
    printf("------------------------------------------------------------\\n");

    int i = 0;
    while ((entrada = readdir(dir)) != NULL && i < 5) {
        snprintf(ruta, sizeof(ruta), "/dev/%s", entrada->d_name);
        if (lstat(ruta, &info) == -1) continue;

        if (S_ISCHR(info.st_mode) || S_ISBLK(info.st_mode)) {
            char *tipo = S_ISCHR(info.st_mode) ? "Caracter" : "Bloque";
            printf("%-20s %-10s %-8u %-8u\\n", 
                   entrada->d_name, tipo, major(info.st_rdev), minor(info.st_rdev));
            i++;
        }
    }
    closedir(dir);
}

int main() {
    char *params[] = {"disp", NULL};
    function_disp(params);
    return 0;
}`} 
            compileCommand="gcc cmd_disp.c -o cmd_disp"
            runCommand="./cmd_disp"
            output={`Dispositivo          Tipo       Major    Minor   
------------------------------------------------------------
tty                  Caracter   5        0       
sda                  Bloque     8        0       
sda1                 Bloque     8        1       
zero                 Caracter   1        5       
null                 Caracter   1        3       `}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Entendí que la lectura y manipulación de contenido en <a href="#8-2-info-archivos" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">archivos regulares</a> (<code className="text-[#f5a623]">cat</code>, <code className="text-[#f5a623]">more</code>, <code className="text-[#f5a623]">head</code>, <code className="text-[#f5a623]">tail</code>, <code className="text-[#f5a623]">grep</code>) se basa en el manejo eficiente de descriptores de archivo y flujos (streams). Las utilidades como <a href="#8-2-info-archivos" className="hover:underline cursor-pointer"><code className="text-[#f5a623] hover:text-[#ffd33d] transition-colors">grep</code></a> demuestran el inmenso poder de las expresiones regulares en la filosofía UNIX.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Extendiendo la funcionalidad de <code className="text-[#f5a623]">grep</code> simulado para que no solo busque cadenas exactas usando <code className="text-[#58a6ff]">strstr</code>, sino que soporte expresiones regulares nativas integrando la biblioteca <code className="text-[#a5d6ff]">&lt;regex.h&gt;</code> de C.
            </p>
          </ReflectionBox>
        </section>

        {/* 8.3 Información del Sistema y Usuarios */}
        <section>
          <SectionHeading id="8-3-info-sistema" number="7.3" title="Información del Sistema y Usuarios" />
          
          <h3 id="cmd-date" className="text-white font-bold mb-3 mt-6">Comando date</h3>
          <p className="mb-4 text-sm">
            Muestra la <strong>fecha y hora actual</strong> del sistema. Combina <code className="text-[#f5a623]">time()</code> para obtener el tiempo UNIX (segundos desde el epoch del 1 enero 1970) con <code className="text-[#f5a623]">localtime()</code> para convertirlo a la zona horaria local, y finalmente <code className="text-[#f5a623]">strftime()</code> para formatearlo como texto legible. La separación de estas tres funciones permite una gran flexibilidad al cambiar el formato de salida.
          </p>
          <SyscallCard
            name="localtime"
            manSection={3}
            prototype="struct tm *localtime(const time_t *timep);"
            header="<time.h>"
            description="Convierte un valor time_t (tiempo UNIX en segundos desde el epoch) a una estructura tm descompuesta en año, mes, día, hora, minuto y segundo en la zona horaria local del sistema."
            returns="Puntero a una struct tm estática (compartida entre llamadas). No es thread-safe; usar localtime_r() en programas concurrentes."
            params={[
              { name: "timep", desc: "Puntero al valor time_t obtenido con time(NULL)." },
            ]}
            structDef={`struct tm {
    int tm_sec;   // Segundos [0-60]
    int tm_min;   // Minutos [0-59]
    int tm_hour;  // Horas [0-23]
    int tm_mday;  // Día del mes [1-31]
    int tm_mon;   // Mes [0-11] (0=enero)
    int tm_year;  // Años desde 1900
    int tm_wday;  // Día de la semana [0-6]
    int tm_yday;  // Día del año [0-365]
    int tm_isdst; // Horario de verano
};`}
          />
          <CopyCodeBlock 
            filename="cmd_date.c" language="C" 
            code={`#include <stdio.h>
#include <time.h>

void function_date(char *parametros[]) {
    time_t t = time(NULL);
    struct tm *tm_info = localtime(&t);
    char buffer[100];

    if (strftime(buffer, sizeof(buffer), "%a %b %d %T %Z %Y", tm_info) != 0) {
        printf("%s\\n", buffer);
    }
}

int main() {
    char *params[] = {"date", NULL};
    function_date(params);
    return 0;
}`} 
            compileCommand="gcc cmd_date.c -o cmd_date"
            runCommand="./cmd_date"
            output={`Thu May 14 00:30:15 UTC 2026`}
          />

          <h3 id="cmd-who" className="text-white font-bold mb-3 mt-10">Comando who</h3>
          <p className="mb-4 text-sm">
            Lista todos los <strong>usuarios actualmente conectados</strong> al sistema, con su terminal (<code className="text-[#f5a623]">pts/0</code>, <code className="text-[#f5a623]">tty1</code>) y su hora de inicio de sesión. Lee directamente el archivo binario <code className="text-[#f5a623]">/var/run/utmp</code> a través de las funciones <code className="text-[#f5a623]">getutent()</code>/<code className="text-[#f5a623]">setutent()</code>/<code className="text-[#f5a623]">endutent()</code>, filtrando únicamente las entradas de tipo <code className="text-[#f5a623]">USER_PROCESS</code>.
          </p>
          <SyscallCard
            name="getutent"
            manSection={3}
            prototype="struct utmp *getutent(void);"
            header="<utmp.h>"
            description="Lee la siguiente entrada del archivo utmp (/var/run/utmp). Cada entrada describe una sesión de usuario activa, un proceso de sistema o un reinicio del sistema."
            returns="Puntero a una struct utmp estática en éxito, NULL al llegar al final del archivo. Usar setutent() para rebobinar y endutent() para cerrar."
            params={[]}
            structDef={`struct utmp {
    short   ut_type;          // Tipo: USER_PROCESS, etc.
    pid_t   ut_pid;           // PID del proceso
    char    ut_line[32];      // Terminal (ej. pts/0)
    char    ut_user[32];      // Nombre de usuario
    char    ut_host[256];     // Host remoto o IP
    struct timeval ut_tv;     // Tiempo de inicio de sesión
};`}
          />
          <CopyCodeBlock 
            filename="cmd_who.c" language="C" 
            code={`#include <stdio.h>
#include <utmp.h>
#include <time.h>

void function_who(char *parametros[]) {
    struct utmp *entrada;
    char time_str[30];

    setutent();
    while ((entrada = getutent()) != NULL) {
        if (entrada->ut_type == USER_PROCESS) {
            time_t login_time = entrada->ut_tv.tv_sec;
            struct tm *tm_info = localtime(&login_time);
            strftime(time_str, sizeof(time_str), "%Y-%m-%d %H:%M", tm_info);

            printf("%-12s %-12s %-16s (%s)\\n",
                   entrada->ut_user, entrada->ut_line, time_str, entrada->ut_host);
        }
    }
    endutent();
}

int main() {
    char *params[] = {"who", NULL};
    function_who(params);
    return 0;
}`} 
            compileCommand="gcc cmd_who.c -o cmd_who"
            runCommand="./cmd_who"
            output={`usuario      pts/0        2026-05-13 22:15 (192.168.1.100)`}
          />

          <h3 id="cmd-free" className="text-white font-bold mb-3 mt-10">Comando free</h3>
          <p className="mb-4 text-sm">
            Muestra el uso de <strong>memoria RAM y swap</strong> del sistema. Usa la syscall <code className="text-[#f5a623]">sysinfo()</code> que proporciona estadísticas globales del kernel en tiempo real: RAM total, libre, compartida, usada en buffers, y estado del espacio de intercambio. Los valores se expresan en unidades de <code className="text-[#f5a623]">mem_unit</code> bytes, por lo que hay que multiplicar antes de convertir a kilobytes.
          </p>
          <SyscallCard
            name="sysinfo"
            prototype="int sysinfo(struct sysinfo *info);"
            header="<sys/sysinfo.h>"
            description="Obtiene estadísticas globales del sistema operativo: memoria RAM, swap, carga del sistema y tiempo de actividad (uptime). Es la syscall detrás de comandos como free y uptime."
            returns="0 en éxito, -1 en error."
            params={[
              { name: "info", desc: "Puntero a struct sysinfo donde el kernel escribirá los datos." },
            ]}
            structDef={`struct sysinfo {
    long    uptime;       // Segundos desde el arranque
    unsigned long totalram;  // RAM total
    unsigned long freeram;   // RAM libre
    unsigned long sharedram; // RAM compartida
    unsigned long bufferram; // RAM en buffers
    unsigned long totalswap; // Swap total
    unsigned long freeswap;  // Swap libre
    unsigned short procs;    // Número de procesos activos
    unsigned long mem_unit;  // Tamaño de unidad en bytes
};`}
          />
          <CopyCodeBlock 
            filename="cmd_free.c" language="C" 
            code={`#include <stdio.h>
#include <sys/sysinfo.h>

void function_free(char *parametros[]) {
    struct sysinfo info;
    if (sysinfo(&info) != 0) return;

    unsigned long unit = info.mem_unit;
    unsigned long kb = 1024;

    unsigned long total = (info.totalram * unit) / kb;
    unsigned long free = (info.freeram * unit) / kb;
    unsigned long shared = (info.sharedram * unit) / kb;
    unsigned long buffer = (info.bufferram * unit) / kb;
    unsigned long used = total - free - buffer;

    unsigned long t_swap = (info.totalswap * unit) / kb;
    unsigned long f_swap = (info.freeswap * unit) / kb;

    printf("              total        usado        libre   compartido    búf/caché\\n");
    printf("Mem:   %12lu %12lu %12lu %12lu %12lu\\n", total, used, free, shared, buffer);
    printf("Inter: %12lu %12lu %12lu\\n", t_swap, t_swap - f_swap, f_swap);
}

int main() {
    char *params[] = {"free", NULL};
    function_free(params);
    return 0;
}`} 
            compileCommand="gcc cmd_free.c -o cmd_free"
            runCommand="./cmd_free"
            output={`              total        usado        libre   compartido    búf/caché
Mem:       16240000      6500000      4200000       500000      5540000
Inter:      2097152            0      2097152`}
          />

          <h3 id="cmd-uname" className="text-white font-bold mb-3 mt-10">Comando uname</h3>
          <p className="mb-4 text-sm">
            Muestra información de identificación del <strong>sistema operativo y del hardware</strong>: nombre del kernel, hostname, versión de release, versión del kernel y arquitectura. Soporta las banderas estándar <code className="text-[#f5a623]">-s</code>, <code className="text-[#f5a623]">-n</code>, <code className="text-[#f5a623]">-r</code>, <code className="text-[#f5a623]">-v</code>, <code className="text-[#f5a623]">-m</code> y <code className="text-[#f5a623]">-a</code> (todas a la vez), igual que el comando real.
          </p>
          <SyscallCard
            name="uname"
            prototype="int uname(struct utsname *buf);"
            header="<sys/utsname.h>"
            description="Obtiene información de identificación del sistema operativo directamente desde el kernel. Los datos provienen del núcleo y no pueden ser modificados por el usuario."
            returns="0 en éxito, -1 en error."
            params={[
              { name: "buf", desc: "Puntero a struct utsname donde se almacenará la información del sistema." },
            ]}
            structDef={`struct utsname {
    char sysname[65];   // Nombre del SO (ej. "Linux")
    char nodename[65];  // Hostname del equipo
    char release[65];   // Versión del kernel (ej. "6.8.0")
    char version[65];   // Fecha y hora de compilación
    char machine[65];   // Arquitectura (ej. "x86_64")
};`}
          />
          <CopyCodeBlock 
            filename="cmd_uname.c" language="C" 
            code={`#include <stdio.h>
#include <sys/utsname.h>

void function_uname(char *parametros[]) {
    struct utsname info;
    if (uname(&info) == -1) return;

    if (parametros[1] == NULL) {
        printf("%s\\n", info.sysname);
        return;
    }

    int fs = 0, fn = 0, fr = 0, fv = 0, fm = 0;
    for (int i = 1; parametros[i] != NULL; i++) {
        if (parametros[i][0] == '-') {
            for (int j = 1; parametros[i][j] != '\\0'; j++) {
                switch (parametros[i][j]) {
                    case 'a': fs = fn = fr = fv = fm = 1; break;
                    case 's': fs = 1; break;
                    case 'n': fn = 1; break;
                    case 'r': fr = 1; break;
                    case 'v': fv = 1; break;
                    case 'm': fm = 1; break;
                }
            }
        }
    }

    if (fs) printf("%s ", info.sysname);
    if (fn) printf("%s ", info.nodename);
    if (fr) printf("%s ", info.release);
    if (fv) printf("%s ", info.version);
    if (fm) printf("%s ", info.machine);
    printf("\\n");
}

int main() {
    char *params[] = {"uname", "-a", NULL};
    function_uname(params);
    return 0;
}`} 
            compileCommand="gcc cmd_uname.c -o cmd_uname"
            runCommand="./cmd_uname"
            output={`Linux migue1drs-pc 6.8.0-45-generic #45-Ubuntu SMP x86_64 `}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Comprendí que los comandos relacionados con <a href="#8-3-info-sistema" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">información del sistema y de los usuarios</a> (<code className="text-[#f5a623]">uname</code>, <code className="text-[#f5a623]">who</code>, <code className="text-[#f5a623]">whoami</code>, <code className="text-[#f5a623]">ps</code>) obtienen sus datos directamente de las estructuras de datos del kernel, usando llamadas como <a href="#8-3-info-sistema" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">uname()</code></a> o leyendo desde directorios del sistema como <code className="text-[#58a6ff]">/proc</code> y <code className="text-[#58a6ff]">/var/run/utmp</code>.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Escribiendo una versión de <code className="text-[#f5a623]">ps</code> que en lugar de ejecutar una llamada a <code className="text-[#58a6ff]">system("ps")</code>, iteré directamente sobre los directorios numéricos dentro de <code className="text-[#58a6ff]">/proc/</code> para leer manualmente el archivo <code className="text-[#a5d6ff]">status</code> de cada proceso activo.
            </p>
          </ReflectionBox>
        </section>

        {/* 8.4 Mensajes, Terminal y Control */}
        <section>
          <SectionHeading id="8-4-mensajes-control" number="7.4" title="Mensajes, Terminal y Control" />

          <h3 id="cmd-mesg" className="text-white font-bold mb-3 mt-6">Comando mesg</h3>
          <p className="mb-4 text-sm">
            Controla si otros usuarios pueden escribir mensajes en tu <strong>terminal actual</strong>. Usa <code className="text-[#f5a623]">ttyname()</code> para obtener el archivo de dispositivo del terminal actual (ej. <code className="text-[#f5a623]">/dev/pts/0</code>), <code className="text-[#f5a623]">stat()</code> para leer sus permisos actuales, y <code className="text-[#f5a623]">chmod()</code> para activar o revocar el bit de escritura de grupo (<code className="text-[#f5a623]">S_IWGRP</code>). Si ese bit está activo, comandos como <code className="text-[#f5a623]">write</code> o <code className="text-[#f5a623]">wall</code> pueden escribir en tu terminal.
          </p>
          <SyscallCard
            name="chmod"
            prototype="int chmod(const char *pathname, mode_t mode);"
            header="<sys/stat.h>"
            description="Cambia los permisos (bits de modo) de un archivo. En mesg, se usa para activar (S_IWGRP) o revocar (~S_IWGRP) el permiso de escritura de grupo sobre el archivo de dispositivo del terminal."
            returns="0 en éxito, -1 en error (EPERM si no es el propietario o root, ENOENT si el archivo no existe)."
            params={[
              { name: "pathname", desc: "Ruta del archivo cuyo modo se modificará." },
              { name: "mode", desc: "Nuevos permisos expresados como máscara de bits (ej. info.st_mode | S_IWGRP)." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_mesg.c" language="C" 
            code={`#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>

void function_mesg(char *parametros[]) {
    char *tty = ttyname(STDERR_FILENO);
    struct stat info;

    if (tty == NULL || stat(tty, &info) == -1) return;

    if (parametros[1] == NULL) {
        printf("is %s\\n", (info.st_mode & S_IWGRP) ? "y" : "n");
        return;
    }

    if (strcmp(parametros[1], "y") == 0) chmod(tty, info.st_mode | S_IWGRP);
    else if (strcmp(parametros[1], "n") == 0) chmod(tty, info.st_mode & ~S_IWGRP);
}

int main() {
    char *params[] = {"mesg", "y", NULL};
    function_mesg(params);
    
    char *params2[] = {"mesg", NULL};
    function_mesg(params2);
    return 0;
}`} 
            compileCommand="gcc cmd_mesg.c -o cmd_mesg"
            runCommand="./cmd_mesg"
            output={`is y`}
          />

          <h3 id="cmd-wall" className="text-white font-bold mb-3 mt-10">Comando wall</h3>
          <p className="mb-4 text-sm">
            Envía un <strong>mensaje de difusión</strong> (<em>broadcast</em>) a los terminales de todos los usuarios activos. Lee el archivo <code className="text-[#f5a623]">/var/run/utmp</code> con <code className="text-[#f5a623]">getutent()</code> para obtener la lista de sesiones activas, construye la ruta del dispositivo de cada terminal (<code className="text-[#f5a623]">/dev/pts/N</code>), lo abre con <code className="text-[#f5a623]">open()</code> y escribe directamente el mensaje con <code className="text-[#f5a623]">write()</code>. El flag <code className="text-[#f5a623]">O_NOCTTY</code> evita que el proceso tome control del terminal destino.
          </p>
          <SyscallCard
            name="write"
            prototype="ssize_t write(int fd, const void *buf, size_t count);"
            header="<unistd.h>"
            description="Escribe hasta count bytes del buffer buf en el descriptor fd. En wall, se usa para escribir el mensaje directamente en los archivos de dispositivo de terminal de otros usuarios (/dev/pts/N)."
            returns="Número de bytes escritos en éxito (puede ser menor que count), -1 en error (EACCES si el terminal tiene mesg n)."
            params={[
              { name: "fd", desc: "Descriptor de archivo, aquí el fd del terminal de otro usuario." },
              { name: "buf", desc: "Buffer con el contenido a escribir." },
              { name: "count", desc: "Número de bytes a escribir." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_wall.c" language="C" 
            code={`#include <stdio.h>
#include <utmp.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <time.h>

void function_wall(char *parametros[]) {
    if (parametros[1] == NULL) return;

    struct utmp *entrada;
    char ruta_tty[128], cabecera[256];
    time_t t = time(NULL);
    struct tm *tm_info = localtime(&t);

    snprintf(cabecera, sizeof(cabecera), 
             "\\r\\nBroadcast message from %s (%s) (%02d:%02d):\\r\\n\\r\\n", 
             getlogin(), ttyname(STDERR_FILENO), tm_info->tm_hour, tm_info->tm_min);

    setutent();
    while ((entrada = getutent()) != NULL) {
        if (entrada->ut_type == USER_PROCESS) {
            snprintf(ruta_tty, sizeof(ruta_tty), "/dev/%s", entrada->ut_line);
            int fd = open(ruta_tty, O_WRONLY | O_NOCTTY);
            if (fd != -1) {
                write(fd, cabecera, strlen(cabecera));
                for (int i = 1; parametros[i] != NULL; i++) {
                    write(fd, parametros[i], strlen(parametros[i]));
                    write(fd, " ", 1);
                }
                write(fd, "\\r\\n", 2);
                close(fd);
            }
        }
    }
    endutent();
}

int main() {
    char *params[] = {"wall", "Hola", "a", "todos!", NULL};
    // Descomentar para enviar a todo el sistema, por seguridad desactivado en la simulación.
    // function_wall(params);
    printf("\\r\\nBroadcast message from usuario (/dev/pts/0) (00:45):\\r\\n\\r\\nHola a todos! \\r\\n");
    return 0;
}`} 
            compileCommand="gcc cmd_wall.c -o cmd_wall"
            runCommand="./cmd_wall"
            output={`
Broadcast message from usuario (/dev/pts/0) (00:45):

Hola a todos! `}
          />

          <h3 id="cmd-exit" className="text-white font-bold mb-3 mt-10">Comando exit</h3>
          <p className="mb-4 text-sm">
            Termina la ejecución del shell devolviendo un <strong>código de salida</strong> al proceso padre. La diferencia entre <code className="text-[#f5a623]">exit()</code> (biblioteca estándar) y <code className="text-[#f5a623]">_exit()</code> (syscall directa) es crucial: <code className="text-[#f5a623]">exit()</code> ejecuta los <em>handlers</em> registrados con <code className="text-[#f5a623]">atexit()</code> y vacía los buffers de I/O antes de llamar al kernel, mientras que <code className="text-[#f5a623]">_exit()</code> termina inmediatamente sin limpieza.
          </p>
          <SyscallCard
            name="exit"
            manSection={3}
            prototype="void exit(int status);"
            header="<stdlib.h>"
            description="Finaliza el proceso actual con el código de estado indicado. Ejecuta las funciones registradas con atexit(), vacía y cierra todos los streams de stdio, y luego llama a _exit(status) para notificar al kernel."
            returns="No retorna (el proceso termina). El código de salida (0-255) queda disponible para el proceso padre mediante wait() o waitpid()."
            params={[
              { name: "status", desc: "Código de salida. Por convención: 0 indica éxito, cualquier valor distinto indica error." },
            ]}
          />
          <CopyCodeBlock 
            filename="cmd_exit.c" language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>

void function_exit(char *parametros[]) {
    if (parametros[1] != NULL) {
        fprintf(stderr, "exit\\n");
        return;
    }
    printf("Saliendo del shell ...\\n");
    exit(0);
}

int main() {
    char *params[] = {"exit", NULL};
    function_exit(params);
    return 1;
}`} 
            compileCommand="gcc cmd_exit.c -o cmd_exit"
            runCommand="./cmd_exit"
            output={`Saliendo del shell ...`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Aprendí cómo el sistema operativo gestiona <a href="#8-4-mensajes-control" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">permisos, grupos y propiedades de los archivos</a> a través de comandos como <code className="text-[#f5a623]">chmod</code>, <code className="text-[#f5a623]">chown</code>, <code className="text-[#f5a623]">su</code> y <code className="text-[#f5a623]">passwd</code>. Vi que la función <a href="#8-4-mensajes-control" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">chmod()</code></a> en C modifica la máscara de bits del inodo para cambiar los derechos de lectura, escritura y ejecución.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Implementando soporte para el formato simbólico en la función <code className="text-[#f5a623]">chmod</code> (por ejemplo, <code className="text-[#58a6ff]">u+x</code>), para que no solo requiera el modo octal y sea mucho más fácil de utilizar.
            </p>
          </ReflectionBox>
        </section>

        {/* 8.5 Red y Búsqueda de Archivos */}
        <section>
          <SectionHeading id="8-5-red-busqueda" number="7.5" title="Red y Búsqueda de Archivos" />
          <p className="mb-6">
            Comandos que permiten obtener información de la configuración de red de la máquina y realizar búsquedas de archivos dentro del sistema de archivos.
          </p>

          <h3 id="cmd-getip" className="text-white font-bold mb-3 mt-6">Comando getip</h3>
          <p className="mb-4 text-sm">
            Consulta las <strong>interfaces de red</strong> del sistema usando <code className="text-[#f5a623]">getifaddrs()</code>, que devuelve una lista enlazada con todas las interfaces disponibles. Filtra únicamente las direcciones <strong>IPv4</strong> (<code className="text-[#f5a623]">AF_INET</code>) descartando el loopback (<code className="text-[#f5a623]">lo</code>). Convierte la dirección binaria a texto legible con <code className="text-[#f5a623]">inet_ntoa()</code> y libera los recursos con <code className="text-[#f5a623]">freeifaddrs()</code> para evitar fugas de memoria.
          </p>
          <SyscallCard
            name="getifaddrs"
            prototype="int getifaddrs(struct ifaddrs **ifap);"
            header="<ifaddrs.h>"
            description="Crea una lista enlazada de estructuras ifaddrs describiendo cada interfaz de red del sistema (nombre, familia de dirección, dirección, máscara, flags). Se debe liberar con freeifaddrs()."
            returns="0 en éxito, -1 en error."
            params={[
              { name: "ifap", desc: "Puntero al puntero donde se almacenará el inicio de la lista de interfaces." },
            ]}
            structDef={`struct ifaddrs {
    struct ifaddrs  *ifa_next;    // Siguiente interfaz en la lista
    char            *ifa_name;   // Nombre (ej. "eth0", "enp3s0")
    unsigned int     ifa_flags;  // Flags (IFF_UP, IFF_LOOPBACK...)
    struct sockaddr *ifa_addr;   // Dirección de la interfaz
    struct sockaddr *ifa_netmask;// Máscara de red
};`}
          />
          <CopyCodeBlock
            filename="cmd_getip.c" language="C"
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <ifaddrs.h>

void function_getip(char *parametros[]) {
    if (parametros[1] != NULL) {
        fprintf(stderr, "error\\n");
        return;
    }

    struct ifaddrs *direcciones, *interfaz;
    struct sockaddr_in *ipaddr;
    char ip_encontrada[INET_ADDRSTRLEN] = "127.0.0.1";

    if (getifaddrs(&direcciones) == -1) {
        perror("error");
        return;
    }

    for (interfaz = direcciones; interfaz != NULL; interfaz = interfaz->ifa_next) {
        if (interfaz->ifa_addr == NULL) continue;

        if (interfaz->ifa_addr->sa_family == AF_INET &&
            strcmp(interfaz->ifa_name, "lo") != 0) {
            ipaddr = (struct sockaddr_in *)interfaz->ifa_addr;
            strncpy(ip_encontrada, inet_ntoa(ipaddr->sin_addr), INET_ADDRSTRLEN);
            break;
        }
    }

    printf("IP de la maquina: %s\\n", ip_encontrada);
    freeifaddrs(direcciones);
}

int main() {
    char *params[] = {"getip", NULL};
    function_getip(params);
    return 0;
}`}
            compileCommand="gcc cmd_getip.c -o cmd_getip"
            runCommand="./cmd_getip"
            output={`IP de la maquina: 192.168.1.105`}
          />

          <h3 id="cmd-getmac" className="text-white font-bold mb-3 mt-10">Comando getmac</h3>
          <p className="mb-4 text-sm">
            Obtiene la dirección <strong>MAC</strong> (dirección física del hardware de red) de la primera interfaz válida. Necesita abrir un <strong>socket genérico</strong> (<code className="text-[#f5a623]">socket(AF_INET, SOCK_DGRAM, 0)</code>) para comunicarse con el hardware a través de <code className="text-[#f5a623]">ioctl()</code> con la operación <code className="text-[#f5a623]">SIOCGIFHWADDR</code>. Lee directamente los 6 bytes de la dirección MAC desde el driver de la interfaz, sin importar si tiene conectividad de red. Filtra interfaces vacías verificando que la MAC no sea <code className="text-[#f5a623]">00:00:00:00:00:00</code>.
          </p>
          <SyscallCard
            name="ioctl"
            prototype="int ioctl(int fd, unsigned long request, ...);" 
            header="<sys/ioctl.h>"
            description="Operación de control de E/S genérica para comunicarse con drivers de dispositivo. Con SIOCGIFHWADDR lee la dirección MAC del hardware de red. Con SIOCGIFADDR obtiene la dirección IP. Es la interfaz universal para operaciones que no tienen syscall propia."
            returns="0 en éxito, -1 en error (EPERM si no tiene permisos, ENODEV si la interfaz no existe)."
            params={[
              { name: "fd", desc: "Descriptor de un socket abierto con socket()." },
              { name: "request", desc: "Código de operación: SIOCGIFHWADDR (MAC), SIOCGIFADDR (IP), etc." },
            ]}
            structDef={`struct ifreq {
    char  ifr_name[IFNAMSIZ]; // Nombre interfaz (ej. "eth0")
    union {
        struct sockaddr ifr_addr;    // Dirección IP
        struct sockaddr ifr_hwaddr;  // Dirección MAC
        // ... otros campos
    };
};`}
          />
          <CopyCodeBlock
            filename="cmd_getmac.c" language="C"
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <netinet/in.h>
#include <net/if.h>
#include <arpa/inet.h>
#include <ifaddrs.h>

void function_getmac(char *parametros[]) {
    if (parametros[1] != NULL) {
        fprintf(stderr, "error\\n");
        return;
    }

    struct ifaddrs *direcciones, *interfaz;
    int sock;
    struct ifreq ifr;

    if (getifaddrs(&direcciones) == -1) {
        perror("error");
        return;
    }

    sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock == -1) {
        perror("error al crear socket");
        freeifaddrs(direcciones);
        return;
    }

    for (interfaz = direcciones; interfaz != NULL; interfaz = interfaz->ifa_next) {
        if (interfaz->ifa_name == NULL) continue;

        if (strcmp(interfaz->ifa_name, "lo") != 0) {
            memset(&ifr, 0, sizeof(ifr));
            strncpy(ifr.ifr_name, interfaz->ifa_name, IFNAMSIZ - 1);
            ifr.ifr_name[IFNAMSIZ - 1] = '\\0';

            if (ioctl(sock, SIOCGIFHWADDR, &ifr) != -1) {
                unsigned char *mac = (unsigned char *)ifr.ifr_hwaddr.sa_data;

                if (mac[0] != 0 || mac[1] != 0 || mac[2] != 0) {
                    printf("MAC de la maquina (%s): %02x:%02x:%02x:%02x:%02x:%02x\\n",
                           interfaz->ifa_name,
                           mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
                    break;
                }
            }
        }
    }

    close(sock);
    freeifaddrs(direcciones);
}

int main() {
    char *params[] = {"getmac", NULL};
    function_getmac(params);
    return 0;
}`}
            compileCommand="gcc cmd_getmac.c -o cmd_getmac"
            runCommand="./cmd_getmac"
            output={`MAC de la maquina (enp3s0): a8:5e:45:1c:d3:f7`}
          />

          <h3 id="cmd-find" className="text-white font-bold mb-3 mt-10">Comando find</h3>
          <p className="mb-4 text-sm">
            Implementación simplificada del comando <code className="text-[#f5a623]">find</code> que busca un archivo por nombre dentro de un <strong>único directorio</strong> (sin recursión). Utiliza <code className="text-[#f5a623]">opendir()</code> y <code className="text-[#f5a623]">readdir()</code> para iterar sobre las entradas, comparando cada nombre con <code className="text-[#f5a623]">strcmp()</code>. Es la versión más básica de búsqueda: rápida pero limitada a un solo nivel de profundidad.
          </p>
          <SyscallCard
            name="readdir"
            manSection={3}
            prototype="struct dirent *readdir(DIR *dirp);"
            header="<dirent.h>"
            description="Lee la siguiente entrada del directorio apuntado por el DIR stream. Cada llamada devuelve la siguiente entrada hasta agotar todas. El orden de las entradas no está garantizado."
            returns="Puntero a una struct dirent (estática, sobreescrita en la próxima llamada) en éxito, NULL cuando no quedan más entradas o en error."
            params={[
              { name: "dirp", desc: "Stream de directorio obtenido con opendir()." },
            ]}
          />
          <CopyCodeBlock
            filename="cmd_find.c" language="C"
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>

void buscar_en_un_directorio(char *ruta, char *objetivo) {
    DIR *dir = opendir(ruta);
    struct dirent *entrada;

    if (dir == NULL) {
        perror("Error al abrir el directorio");
        return;
    }

    while ((entrada = readdir(dir)) != NULL) {
        if (strcmp(entrada->d_name, objetivo) == 0) {
            if (strcmp(ruta, "/") == 0) {
                printf("/%s\\n", entrada->d_name);
            } else {
                printf("%s/%s\\n", ruta, entrada->d_name);
            }
        }
    }
    closedir(dir);
}

void function_find(char *parametros[]) {
    char *ruta = ".";
    char *objetivo = NULL;

    if (parametros[1] != NULL && parametros[2] == NULL) {
        objetivo = parametros[1];
    } else if (parametros[1] != NULL && parametros[2] != NULL) {
        ruta = parametros[1];
        objetivo = parametros[2];
    }

    if (objetivo == NULL) {
        fprintf(stderr, "Uso: find [ruta] <nombre>\\n");
        return;
    }

    buscar_en_un_directorio(ruta, objetivo);
}

int main() {
    char *params[] = {"find", "/etc", "hostname", NULL};
    function_find(params);
    return 0;
}`}
            compileCommand="gcc cmd_find.c -o cmd_find"
            runCommand="./cmd_find"
            output={`/etc/hostname`}
          />

          <h3 id="cmd-find-r" className="text-white font-bold mb-3 mt-10">Comando find_r (búsqueda recursiva)</h3>
          <p className="mb-4 text-sm">
            Versión avanzada del comando anterior. Recorre el árbol de directorios de forma <strong>recursiva</strong> usando <code className="text-[#f5a623]">lstat()</code> para identificar subdirectorios (<code className="text-[#f5a623]">S_ISDIR</code>) y descender en ellos. Los resultados se almacenan en un arreglo dinámico asignado con <code className="text-[#f5a623]">malloc()</code> (hasta 1024 coincidencias). Las entradas <code className="text-[#f5a623]">.</code> y <code className="text-[#f5a623]">..</code> se filtran para evitar bucles infinitos. Al terminar libera la memoria con <code className="text-[#f5a623]">free()</code>.
          </p>
          <SyscallCard
            name="malloc"
            manSection={3}
            prototype="void *malloc(size_t size);"
            header="<stdlib.h>"
            description="Asigna dinámicamente un bloque de memoria de size bytes en el heap. En find_r, se usa para crear un buffer con capacidad para 1024 rutas de hasta 4096 bytes cada una, ya que el número de resultados es desconocido en tiempo de compilación."
            returns="Puntero al bloque asignado en éxito, NULL si no hay memoria disponible. La memoria debe liberarse con free() para evitar memory leaks."
            params={[
              { name: "size", desc: "Número de bytes a asignar. Ej: 1024 * sizeof(char[4096])." },
            ]}
          />
          <CopyCodeBlock
            filename="cmd_find_r.c" language="C"
            code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

void realizar_busqueda_recursiva(char *ruta, char *objetivo,
                                 char resultados[][4096], int *contador) {
    DIR *dir = opendir(ruta);
    struct dirent *entrada;
    struct stat info;
    char subruta[4096];

    if (dir == NULL) return;

    while ((entrada = readdir(dir)) != NULL) {
        if (strcmp(entrada->d_name, ".") == 0 ||
            strcmp(entrada->d_name, "..") == 0)
            continue;

        if (strcmp(entrada->d_name, objetivo) == 0) {
            if (*contador < 1024) {
                if (strcmp(ruta, "/") == 0)
                    snprintf(resultados[*contador], 4096, "/%s", entrada->d_name);
                else
                    snprintf(resultados[*contador], 4096, "%s/%s", ruta, entrada->d_name);
                (*contador)++;
            }
        }

        if (strcmp(ruta, "/") == 0)
            snprintf(subruta, sizeof(subruta), "/%s", entrada->d_name);
        else
            snprintf(subruta, sizeof(subruta), "%s/%s", ruta, entrada->d_name);

        if (lstat(subruta, &info) == 0 && S_ISDIR(info.st_mode)) {
            realizar_busqueda_recursiva(subruta, objetivo, resultados, contador);
        }
    }
    closedir(dir);
}

void function_find_r(char *parametros[]) {
    char *ruta = ".";
    char *objetivo = NULL;

    if (parametros[1] != NULL && parametros[2] == NULL) {
        objetivo = parametros[1];
    } else if (parametros[1] != NULL && parametros[2] != NULL) {
        ruta = parametros[1];
        objetivo = parametros[2];
    }

    if (objetivo == NULL) {
        fprintf(stderr, "Uso: find_r [ruta] <nombre>\\n");
        return;
    }

    char (*lista_coincidencias)[4096] = malloc(1024 * sizeof(*lista_coincidencias));
    if (lista_coincidencias == NULL) {
        perror("Error: No se pudo asignar memoria");
        return;
    }

    int total_encontrados = 0;
    realizar_busqueda_recursiva(ruta, objetivo, lista_coincidencias, &total_encontrados);

    if (total_encontrados > 0) {
        for (int i = 0; i < total_encontrados; i++)
            printf("%s\\n", lista_coincidencias[i]);
    } else {
        printf("find_r: No se encontro '%s' en la ruta especificada.\\n", objetivo);
    }

    free(lista_coincidencias);
}

int main() {
    char *params[] = {"find_r", "/etc", "hostname", NULL};
    function_find_r(params);
    return 0;
}`}
            compileCommand="gcc cmd_find_r.c -o cmd_find_r"
            runCommand="sudo ./cmd_find_r"
            output={`/etc/hostname`}
          />

          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Exploré los mecanismos a bajo nivel para interactuar con <a href="#8-5-red-busqueda" className="text-white font-bold hover:text-[#58a6ff] hover:underline transition-colors cursor-pointer">interfaces de red y buscar en el sistema de archivos</a>. Comandos como <code className="text-[#f5a623]">getip</code> y <code className="text-[#f5a623]">getmac</code> requieren de manipulación de sockets e <a href="#8-5-red-busqueda" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">ioctl</code></a> para hablar con el hardware de red. Por otro lado, <code className="text-[#f5a623]">find_r</code> demostró el uso de la recursión sobre la estructura de directorios con <a href="#8-5-red-busqueda" className="hover:underline cursor-pointer"><code className="text-[#58a6ff] hover:text-[#79b8ff] transition-colors">opendir/readdir</code></a>.
            </p>
            <p>
              <strong className="text-white">¿Cómo podría mejorarla?</strong> Modificando la función <code className="text-[#f5a623]">getip</code> para que no solo soporte direcciones IPv4, sino que también detecte y retorne direcciones IPv6 analizando correctamente las estructuras <code className="text-[#a5d6ff]">sockaddr_in6</code> devueltas por <code className="text-[#58a6ff]">getifaddrs</code>.
            </p>
          </ReflectionBox>
        </section>


        <TopicQuiz topicId="tema-8" title="Test - Implementación de Comandos" questions={TEMA8_QUIZ} />
        <ReadMarker topicId="tema-8" />
      </article>
    </div>
  );
}
