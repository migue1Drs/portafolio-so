import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TEMA6_QUIZ } from "@/lib/quiz-data";

export default function Tema6Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 6"
        title="Arquitectura del Sistema de Archivos"
        description="Estudio de la estructura lógica de los sistemas de archivos (ext2, ext3, ext4), gestión de inodos, superbloques y dispositivos de E/S en UNIX/Linux."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* 6.1 */}
        <section>
          <SectionHeading id="6-1-introduccion" number="6.1" title="Introducción" />
          <p className="mb-4">
            El sistema de archivos en UNIX/Linux posee una estructura jerárquica y proporciona consistencia, protección y manejo dinámico de datos. El kernel trabaja a un nivel lógico, utilizando controladores (drivers) para traducir estas operaciones lógicas a direcciones físicas en el disco.
          </p>
          <p>
            Cada dispositivo es identificado mediante dos números: el <strong className="text-[#f5a623]">Major Number</strong> (tipo de dispositivo) y el <strong className="text-[#f5a623]">Minor Number</strong> (unidad específica).
          </p>
        </section>

        {/* 6.2 */}
        <section>
          <SectionHeading id="6-2-estructura-logica" number="6.2" title="Estructura lógica del sistema de archivos" />
          <p className="mb-6">
            Un sistema de archivos estándar (como ext4) se divide en cuatro secciones fundamentales:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { title: "1. Boot", desc: "Contiene el código de arranque para inicializar el SO." },
              { title: "2. Superbloque", desc: "Describe el estado global: tamaño, espacio libre, etc." },
              { title: "3. Lista de Inodos", desc: "Metadatos de cada archivo (permisos, dueño, etc.)." },
              { title: "4. Bloques de Datos", desc: "Donde reside el contenido real de los archivos." },
            ].map((item, i) => (
              <div key={i} className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl hover:border-[#f5a623] transition-colors">
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-[#8b949e]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6.2.1 */}
        <section>
          <SectionHeading id="6-2-1-superbloque" number="6.2.1" title="El superbloque" />
          <p className="mb-4">
            Contiene información crítica como el tamaño del sistema, lista de bloques libres e inodos disponibles. El kernel mantiene una copia en memoria y utiliza procesos como <code className="text-[#58a6ff]">sync_supers</code> para actualizar el disco.
          </p>
          
          <h3 className="text-white font-bold mt-8 mb-4 italic">Estadísticas del Sistema de Archivos (statvfs)</h3>
          <CopyCodeBlock 
            filename="info_vfs.c" 
            language="C" 
            code={`#include <stdio.h>
#include <stdlib.h>
#include <sys/statvfs.h>

int main() {
 struct statvfs vfs;
 char *ruta = "/";
 
 if (statvfs(ruta, &vfs) != 0) {
  perror("statvfs");
  return 1;
 }
 
 printf("Información de: %s\\n", ruta);
 printf("Tamaño de bloque: %ld bytes\\n", vfs.f_bsize);
 printf("Bloques totales: %lu\\n", (unsigned long)vfs.f_blocks);
 printf("Bloques libres: %lu\\n", (unsigned long)vfs.f_bfree);
 printf("Inodos libres: %lu\\n", (unsigned long)vfs.f_ffree);
 printf("ID del S.A.: %#lx\\n", (unsigned long)vfs.f_fsid);
 
 return 0;
}`} 
            compileCommand="gcc info_vfs.c -o vfs_info"
            runCommand="./vfs_info"
            output={`Información de: /
Tamaño de bloque: 4096 bytes
Bloques totales: 61027555
Bloques libres: 15728640
Inodos libres: 3276800
ID del S.A.: 0x5a4f21d3`}
          />
        </section>

        {/* 6.2.2 */}
        <section>
          <SectionHeading id="6-2-2-inodos" number="6.2.2" title="Nodos índices (inodos)" />
          <p className="mb-4">
            Cada archivo tiene asociado un inodo que contiene: propietario, derechos de acceso, tamaño y localización física. <strong className="text-white">Importante:</strong> El nombre del archivo NO reside en el inodo, sino en el directorio.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Obtener metadatos con stat()</h3>
          <CopyCodeBlock 
            filename="stat_file.c" 
            language="C" 
            code={`#include <stdio.h>
#include <sys/stat.h>
#include <time.h>

int main(int argc, char *argv[]) {
 struct stat sb;
 if (argc < 2) return 1;
 
 if (stat(argv[1], &sb) == -1) return 1;
 
 printf("Inodo: %ld\\n", (long)sb.st_ino);
 printf("Tamaño: %lld bytes\\n", (long long)sb.st_size);
 printf("Enlaces: %ld\\n", (long)sb.st_nlink);
 printf("Último acceso: %s", ctime(&sb.st_atime));
 
 return 0;
}`} 
            compileCommand="gcc stat_file.c -o stat_info"
            runCommand="./stat_info stat_file.c"
            output={`Inodo: 1258291
Tamaño: 452 bytes
Enlaces: 1
Último acceso: Wed May 13 17:45:00 2026`}
          />
        </section>

        {/* 6.3 */}
        <section>
          <SectionHeading id="6-3-tipos-archivos" number="6.3" title="Tipos de archivos en Linux" />
          <div className="space-y-6">
            <div className="bg-[#161b22] border-l-4 border-[#3fb950] p-4">
              <h4 className="text-white font-bold">1. Ordinarios (Regulares)</h4>
              <p className="text-sm">Contienen bytes de datos organizados linealmente. El nombre es solo una etiqueta que apunta a un inodo.</p>
            </div>
            <div className="bg-[#161b22] border-l-4 border-[#58a6ff] p-4">
              <h4 className="text-white font-bold">2. Directorios</h4>
              <p className="text-sm">Archivos especiales que mapean nombres de archivos a números de inodo. El kernel tiene derecho exclusivo de escritura.</p>
            </div>
            <div className="bg-[#161b22] border-l-4 border-[#f5a623] p-4">
              <h4 className="text-white font-bold">3. Dispositivos (Especiales)</h4>
              <p className="text-sm">Permiten la comunicación con el hardware. Pueden ser de <strong className="text-white">bloque</strong> (discos) o <strong className="text-white">carácter</strong> (teclados, terminales).</p>
            </div>
            <div className="bg-[#161b22] border-l-4 border-[#ff5f56] p-4">
              <h4 className="text-white font-bold">4. Comunicación (Pipes)</h4>
              <p className="text-sm">Archivos transitorios usados para IPC. Los datos son FIFO (First-In, First-Out).</p>
            </div>
          </div>
        </section>

        {/* 6.4 */}
        <section>
          <SectionHeading id="6-4-dispositivos" number="6.4" title="Dispositivos de Entrada y Salida" />
          <p className="mb-6">
            Los dispositivos se gestionan a través de <code className="text-[#58a6ff]">/dev</code>. Los dispositivos de bloque usan un <strong className="text-white">buffer caché</strong> para acelerar transferencias, mientras que los de carácter procesan flujos de bytes directamente.
          </p>

          <h3 className="text-white font-bold mt-8 mb-4 italic">Uso de ioctl() para control de dispositivos</h3>
          <CopyCodeBlock 
            filename="terminal_size.c" 
            language="C" 
            code={`#include <stdio.h>
#include <sys/ioctl.h>
#include <unistd.h>

int main() {
 struct winsize w;
 if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &w) == -1) return 1;
 
 printf("Terminal: %d filas x %d columnas\\n", w.ws_row, w.ws_col);
 return 0;
}`} 
            compileCommand="gcc terminal_size.c -o term_sz"
            runCommand="./term_sz"
            output={`Terminal: 24 filas x 80 columnas`}
          />

          <h3 className="text-white font-bold mt-8 mb-4 italic">Identificación: Major y Minor Numbers</h3>
          <CopyCodeBlock 
            filename="major_minor.c" 
            language="C" 
            code={`#include <stdio.h>
#include <sys/sysmacros.h>
#include <sys/stat.h>

int main() {
 struct stat sb;
 if (stat("/dev/sda", &sb) == -1) {
  perror("stat /dev/sda"); return 1;
 }
 
 printf("Dispositivo: /dev/sda\\n");
 printf("Major Number: %u\\n", major(sb.st_rdev));
 printf("Minor Number: %u\\n", minor(sb.st_rdev));
 return 0;
}`} 
            compileCommand="gcc major_minor.c -o majmin"
            runCommand="./majmin"
            output={`Dispositivo: /dev/sda
Major Number: 8
Minor Number: 0`}
          />
        </section>

        <ReflectionBox>
          <p className="mb-2">
            <strong className="text-white">¿Qué aprendí?</strong> Descubrí que en Linux "todo es un archivo", incluso el hardware. La separación entre el nombre del archivo (en el directorio) y sus metadatos (en el inodo) es fundamental para entender cómo funcionan los enlaces duros. También aprendí a usar <code className="text-[#f5a623]">ioctl</code> para obtener información directa del hardware, como el tamaño de la terminal o datos de red.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorar?</strong> Me gustaría profundizar en el código fuente de los drivers del kernel para entender exactamente cómo el Major Number se convierte en una llamada a una función específica del controlador. También planeo investigar los sistemas de archivos modernos como <strong className="text-white">Btrfs</strong> o <strong className="text-white">ZFS</strong> y sus diferencias con ext4.
          </p>
        </ReflectionBox>

        <TopicQuiz
          topicId="tema-6"
          title="Test — Sistema de Archivos"
          questions={TEMA6_QUIZ}
        />

        <ReadMarker topicId="tema-6" />

      </article>
    </div>
  );
}
