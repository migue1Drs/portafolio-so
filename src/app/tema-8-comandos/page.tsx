import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { InteractiveTerminal } from "@/components/ui/InteractiveTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ReadMarker } from "@/components/ui/ReadMarker";

export default function Tema8Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 8"
        title="Implementación de Comandos POSIX en C"
        description="Construyendo nuestras propias versiones de herramientas clásicas (pwd, cd, mkdir, rm) mediante llamadas al sistema. La prueba definitiva de comprensión de la arquitectura del OS."
      />

      <article className="space-y-6 text-[#b0b8c4] leading-relaxed">

        <ScrollReveal>
          <p>
            Los comandos que usamos diariamente en la terminal de Linux no son magia; la mayoría son simplemente programas escritos en C que actúan como "envoltorios" o <em>wrappers</em> alrededor de las llamadas al sistema (<em>syscalls</em>). Al reimplementarlos, entendemos a profundidad cómo interactúa el espacio de usuario con el kernel.
          </p>
        </ScrollReveal>

        {/* 8.1 pwd */}
        <ScrollReveal>
          <SectionHeading id="8-1-pwd" number="8.1" title="Comando pwd (Print Working Directory)" />
          <p>
            El comando <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">pwd</code> imprime la ruta absoluta del directorio de trabajo actual. A nivel de kernel, esto se consulta usando la llamada <code className="text-[#f5a623]">getcwd()</code>.
          </p>
          <CopyCodeBlock filename="mi_pwd.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <limits.h> // Para PATH_MAX

int main() {
    // PATH_MAX define la longitud máxima de una ruta (usualmente 4096 bytes)
    char cwd[PATH_MAX];

    // getcwd() rellena el buffer con la ruta actual
    if (getcwd(cwd, sizeof(cwd)) != NULL) {
        printf("%s\\n", cwd);
    } else {
        perror("Error en getcwd");
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc -o mi_pwd mi_pwd.c"
            runCommand="./mi_pwd"
            output={`/home/migue1drs/Descargas/blog-SO/portafolio-so`}
          />
          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> El SO mantiene el "Directorio de Trabajo Actual" como parte del estado de cada proceso. La función <code className="text-[#f5a623]">getcwd()</code> viaja desde el inodo actual hacia arriba a través de los directorios padre (usando <code className="text-[#f5a623]">..</code>) hasta llegar a la raíz <code className="text-[#f5a623]">/</code>, reconstruyendo así la ruta absoluta de forma dinámica.
            </p>
            <p>
              <strong className="text-white">¿Cómo mejorar?</strong> En sistemas modernos, las rutas pueden exceder <code className="text-[#f5a623]">PATH_MAX</code>. Una implementación robusta utilizaría <code className="text-[#f5a623]">getcwd(NULL, 0)</code> (si está soportado por glibc), lo cual hace que la función asigne la memoria dinámicamente con <code className="text-[#f5a623]">malloc()</code> según sea necesario, evitando el desbordamiento de búfer.
            </p>
          </ReflectionBox>
        </ScrollReveal>

        {/* 8.2 cd */}
        <ScrollReveal>
          <SectionHeading id="8-2-cd" number="8.2" title="Comando cd (Change Directory)" />
          <p>
            A diferencia de comandos como <code className="text-[#f5a623]">ls</code> o <code className="text-[#f5a623]">mkdir</code>, <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">cd</code> es un comando muy especial. Se implementa usando la llamada <code className="text-[#f5a623]">chdir()</code>.
          </p>
          <CopyCodeBlock filename="mi_cd.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Uso: %s <directorio>\\n", argv[0]);
        return EXIT_FAILURE;
    }

    // Cambiar el directorio de trabajo del proceso
    if (chdir(argv[1]) != 0) {
        perror("Error al cambiar de directorio");
        return EXIT_FAILURE;
    }

    printf("Directorio cambiado exitosamente.\\n");
    
    // Verificamos el cambio
    char buf[1024];
    printf("Nuevo directorio: %s\\n", getcwd(buf, sizeof(buf)));

    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc -o mi_cd mi_cd.c"
            runCommand="./mi_cd /tmp && pwd"
            output={`Directorio cambiado exitosamente.
Nuevo directorio: /tmp
/home/migue1drs/Descargas/blog-SO/portafolio-so`}
          />
          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí (El gran secreto de cd)?</strong> ¡Nuestro <code className="text-[#f5a623]">mi_cd</code> aparentemente no funciona! Aunque dentro del programa en C cambiamos a <code className="text-[#f5a623]">/tmp</code>, al terminar el programa y volver a la terminal, seguimos en el directorio original. 
              Esto ocurre porque el "directorio de trabajo" es privado para cada proceso. La terminal hizo un <code className="text-[#f5a623]">fork()</code> y ejecutó nuestro programa. El hijo cambió su directorio, murió, y el padre (la terminal) jamás se inmutó. Por eso <code className="text-[#f5a623]">cd</code> <strong>debe ser un comando interno (built-in) de la shell</strong>, ¡no puede ser un archivo ejecutable externo!
            </p>
            <p>
              <strong className="text-white">¿Cómo mejorar?</strong> La única forma de que este código sea útil es si forma parte del bucle principal de nuestra propia terminal (shell) customizada, detectando el input "cd" y llamando a <code className="text-[#f5a623]">chdir()</code> sin usar <code className="text-[#f5a623]">fork()</code>.
            </p>
          </ReflectionBox>
        </ScrollReveal>

        {/* 8.3 mkdir */}
        <ScrollReveal>
          <SectionHeading id="8-3-mkdir" number="8.3" title="Comando mkdir" />
          <p>
            Crear un directorio requiere definir no solo el nombre, sino los permisos iniciales con los que se registrará su inodo en el sistema. Se utiliza <code className="text-[#f5a623]">mkdir()</code> definida en <code className="text-[#f5a623]">&lt;sys/stat.h&gt;</code>.
          </p>
          <CopyCodeBlock filename="mi_mkdir.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Uso: %s <nombre_directorio>\\n", argv[0]);
        return EXIT_FAILURE;
    }

    // 0755 es octal: rwxr-xr-x
    // Propietario (7): Lectura, Escritura, Ejecución
    // Grupo (5)      : Lectura, Ejecución
    // Otros (5)      : Lectura, Ejecución
    mode_t mode = 0755; 

    if (mkdir(argv[1], mode) != 0) {
        perror("Error al crear el directorio");
        return EXIT_FAILURE;
    }

    printf("Directorio '%s' creado con éxito.\\n", argv[1]);
    return EXIT_SUCCESS;
}`} 
            compileCommand="gcc -o mi_mkdir mi_mkdir.c"
            runCommand="./mi_mkdir test_dir && ls -ld test_dir"
            output={`Directorio 'test_dir' creado con éxito.
drwxr-xr-x 2 migue1 migue1 4096 may  7 14:00 test_dir`}
          />
          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> Los permisos en UNIX siempre se pasan en base octal (ej. <code className="text-[#f5a623]">0755</code>). Además, el permiso otorgado por <code className="text-[#f5a623]">mkdir()</code> es modificado por la máscara <code className="text-[#f5a623]">umask</code> del sistema (<code className="text-[#f5a623]">mode & ~umask</code>). La "x" (ejecución) en un directorio significa permiso para <em>entrar</em> a él (hacer cd), no para ejecutarlo.
            </p>
            <p>
              <strong className="text-white">¿Cómo mejorar?</strong> Implementar la bandera <code className="text-[#f5a623]">-p</code> (padres). Actualmente, si intentamos crear <code className="text-[#f5a623]">a/b/c</code> y <code className="text-[#f5a623]">a/b</code> no existe, fallará. Podríamos programar una función que parsee la ruta y cree los directorios intermedios usando llamadas recursivas o iterativas.
            </p>
          </ReflectionBox>
        </ScrollReveal>

        {/* 8.4 rm / unlink */}
        <ScrollReveal>
          <SectionHeading id="8-4-rm" number="8.4" title="Comando rm (usando unlink)" />
          <p>
            En Linux no existe una llamada al sistema llamada "delete" o "remove". Los archivos son simplemente punteros (enlaces) hacia inodos en el disco. Para borrar, desenlazamos (<code className="text-[#f5a623]">unlink</code>) el nombre del inodo.
          </p>
          <CopyCodeBlock filename="mi_rm.c" language="C" code={`#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Uso: %s <archivo>\\n", argv[0]);
        return EXIT_FAILURE;
    }

    // unlink elimina el nombre del sistema de archivos
    if (unlink(argv[1]) != 0) {
        perror("Error al borrar el archivo");
        return EXIT_FAILURE;
    }

    printf("El archivo '%s' ha sido desenlazado.\\n", argv[1]);
    return EXIT_SUCCESS;
}`} 
            compileCommand="touch test_file.txt && gcc -o mi_rm mi_rm.c"
            runCommand="./mi_rm test_file.txt"
            output={`El archivo 'test_file.txt' ha sido desenlazado.`}
          />
          <ReflectionBox>
            <p className="mb-2">
              <strong className="text-white">¿Qué aprendí?</strong> El concepto de "borrar" en Linux es fascinante. <code className="text-[#f5a623]">unlink()</code> solo reduce el "contador de enlaces" (link count) del inodo. Si tienes dos hard links al mismo archivo y usas <code className="text-[#f5a623]">rm</code> en uno, los datos siguen vivos bajo el otro nombre. Los bloques de disco solo se liberan cuando el contador de enlaces llega a 0 <strong>Y</strong> ningún proceso tiene el archivo abierto en memoria.
            </p>
            <p>
              <strong className="text-white">¿Cómo mejorar?</strong> Este programa solo sirve para archivos. Para hacer un clon real de <code className="text-[#f5a623]">rm</code>, se debe usar la función <code className="text-[#f5a623]">stat()</code> primero para comprobar si el objetivo es un archivo regular o un directorio. Si es un directorio, debe usar <code className="text-[#f5a623]">rmdir()</code> en lugar de <code className="text-[#f5a623]">unlink()</code>, o implementar recursividad si le pasamos una bandera tipo <code className="text-[#f5a623]">-r</code>.
            </p>
          </ReflectionBox>
        </ScrollReveal>

        <ReadMarker topicId="tema-8" />

      </article>
    </div>
  );
}
