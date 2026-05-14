import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ReadMarker } from "@/components/ui/ReadMarker";

export default function Tema8Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 8"
        title="Implementación de Comandos POSIX"
        description="Construyendo nuestras propias versiones de herramientas clásicas (pwd, cd, mkdir, rm) mediante llamadas al sistema."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        <p>
          Los comandos de la terminal son programas en C que actúan como envoltorios (wrappers) de las llamadas al sistema. Al reimplementarlos, entendemos la interacción entre el espacio de usuario y el kernel.
        </p>

        {/* 8.1 pwd */}
        <section>
          <SectionHeading id="8-1-pwd" number="8.1" title="Comando pwd (Print Working Directory)" />
          <p className="mb-4">
            Imprime la ruta absoluta del directorio actual usando <code className="text-[#f5a623]">getcwd()</code>.
          </p>
          <CopyCodeBlock 
            filename="mi_pwd.c" 
            language="C" 
            code={`#include <stdio.h>
#include <unistd.h>
#include <limits.h>

int main() {
    char cwd[PATH_MAX];
    if (getcwd(cwd, sizeof(cwd)) != NULL) {
        printf("%s\\n", cwd);
    } else {
        perror("getcwd");
        return 1;
    }
    return 0;
}`} 
            compileCommand="gcc mi_pwd.c -o mi_pwd"
            runCommand="./mi_pwd"
            output={`/home/migue1drs/Descargas/blog-SO/portafolio-so`}
          />
        </section>

        {/* 8.2 cd */}
        <section>
          <SectionHeading id="8-2-cd" number="8.2" title="Comando cd (Change Directory)" />
          <p className="mb-4">
            Se implementa usando la llamada <code className="text-[#f5a623]">chdir()</code>. <strong className="text-white">Nota:</strong> cd debe ser un comando interno de la shell para afectar al proceso padre.
          </p>
          <CopyCodeBlock 
            filename="mi_cd.c" 
            language="C" 
            code={`#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    if (argc < 2) return 1;
    if (chdir(argv[1]) != 0) {
        perror("chdir");
        return 1;
    }
    char buf[1024];
    getcwd(buf, sizeof(buf));
    printf("Nuevo directorio: %s\\n", buf);
    return 0;
}`} 
            compileCommand="gcc mi_cd.c -o mi_cd"
            runCommand="./mi_cd /tmp"
            output={`Nuevo directorio: /tmp`}
          />
        </section>

        {/* 8.3 mkdir */}
        <section>
          <SectionHeading id="8-3-mkdir" number="8.3" title="Comando mkdir" />
          <p className="mb-4">
            Crea un directorio con permisos específicos (octal).
          </p>
          <CopyCodeBlock 
            filename="mi_mkdir.c" 
            language="C" 
            code={`#include <stdio.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    if (argc < 2) return 1;
    if (mkdir(argv[1], 0755) != 0) {
        perror("mkdir");
        return 1;
    }
    printf("Directorio '%s' creado.\\n", argv[1]);
    return 0;
}`} 
            compileCommand="gcc mi_mkdir.c -o mi_mkdir"
            runCommand="./mi_mkdir mi_directorio && ls -ld mi_directorio"
            output={`Directorio 'mi_directorio' creado.
drwxr-xr-x 2 user user 4096 may 13 17:50 mi_directorio`}
          />
        </section>

        {/* 8.4 rm */}
        <section>
          <SectionHeading id="8-4-rm" number="8.4" title="Comando rm (unlink)" />
          <p className="mb-4">
            Borrar un archivo es en realidad desenlazarlo (<code className="text-[#f5a623]">unlink</code>) del sistema de archivos.
          </p>
          <CopyCodeBlock 
            filename="mi_rm.c" 
            language="C" 
            code={`#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    if (argc < 2) return 1;
    if (unlink(argv[1]) != 0) {
        perror("unlink");
        return 1;
    }
    printf("Archivo '%s' desenlazado.\\n", argv[1]);
    return 0;
}`} 
            compileCommand="gcc mi_rm.c -o mi_rm"
            runCommand="./mi_rm test.txt"
            output={`Archivo 'test.txt' desenlazado.`}
          />
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Al construir estos comandos, entendí que las herramientas del sistema son accesibles para cualquier programador mediante la API de POSIX. Comprendí que comandos como <code className="text-[#f5a623]">cd</code> no pueden ser programas independientes porque afectan al entorno de la shell padre, y que <code className="text-[#f5a623]">rm</code> en realidad desenlaza (<code className="text-[#f5a623]">unlink</code>) inodos en lugar de "borrar" mágicamente el archivo.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorarla?</strong> Podría mejorar estos comandos añadiéndoles soporte para banderas (flags) mediante <code className="text-[#f5a623]">getopt()</code>, por ejemplo, implementando <code className="text-[#f5a623]">mkdir -p</code> para crear directorios padres, o implementando <code className="text-[#f5a623]">rm -r</code> utilizando recursividad en directorios mediante la API de <code className="text-[#f5a623]">dirent.h</code>.
          </p>
        </ReflectionBox>

        <ReadMarker topicId="tema-8" />
      </article>
    </div>
  );
}
