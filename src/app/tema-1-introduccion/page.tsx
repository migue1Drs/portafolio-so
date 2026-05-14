import { PageHeader } from "@/components/ui/PageHeader";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function Tema1Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 1"
        title="Introducción al sistema operativo Linux"
        description="Fundamentos teóricos de los Sistemas Operativos, su arquitectura, clasificación y evolución hasta los sistemas modernos y móviles."
      />

      <article className="space-y-8 text-[#b0b8c4] leading-relaxed">
        {/* 1.1 Introducción */}
        <section>
          <SectionHeading id="1-1-introduccion" number="1.1" title="Introducción a los Sistemas Operativos" />
          <p className="mb-4">
            Un <strong className="text-white">sistema operativo (SO)</strong> es el software fundamental de todo dispositivo de cómputo. Actúa como el administrador principal de los recursos del hardware y proporciona una interfaz para la interacción del usuario.
          </p>
          <p className="mb-4">
            Sus responsabilidades principales se dividen en varias áreas críticas:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
            <li><strong className="text-[#f5a623]">Administración de procesos:</strong> Gestiona las entidades en ejecución evitando conflictos como interbloqueos y asegurando la sincronización.</li>
            <li><strong className="text-[#f5a623]">Administración de memoria:</strong> Aísla procesos, asigna espacios de memoria dinámicamente y protege el acceso.</li>
            <li><strong className="text-[#f5a623]">Seguridad y Recursos:</strong> Implementa políticas de acceso controlado, equidad y eficiencia en el uso del hardware.</li>
          </ul>
        </section>

        {/* 1.2 Clasificación */}
        <section>
          <SectionHeading id="1-2-clasificacion" number="1.2" title="Clasificación de los sistemas operativos" />
          <p className="mb-4">
            A lo largo de la historia, los SO han evolucionado adaptándose a diferentes arquitecturas y necesidades. Podemos clasificarlos de la siguiente manera:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <SpotlightCard className="bg-[#161b22] border border-[#30363d] p-6 hover:border-[#8b949e] transition-colors">
              <h3 className="text-white font-bold mb-3">Por Lotes y Tiempo Real</h3>
              <p className="text-sm text-[#8b949e]">
                Los sistemas <strong className="text-white">por lotes</strong> agrupaban trabajos similares para evitar tiempos muertos del procesador (ej. SCOPE). Los sistemas de <strong className="text-white">tiempo real</strong> priorizan el cumplimiento estricto de tiempos de respuesta sobre la interacción del usuario (ej. RTLinux, VxWorks).
              </p>
            </SpotlightCard>
            
            <SpotlightCard className="bg-[#161b22] border border-[#30363d] p-6 hover:border-[#8b949e] transition-colors">
              <h3 className="text-white font-bold mb-3">Multitarea y Paralelos</h3>
              <p className="text-sm text-[#8b949e]">
                La <strong className="text-white">multitarea</strong> permite ejecución concurrente alternando tareas mediante la planificación de procesos e hilos. Los sistemas <strong className="text-white">paralelos</strong> explotan múltiples procesadores reales para aumentar el rendimiento simultáneo.
              </p>
            </SpotlightCard>
            
            <SpotlightCard className="bg-[#161b22] border border-[#30363d] p-6 hover:border-[#8b949e] transition-colors">
              <h3 className="text-white font-bold mb-3">Distribuidos y de Red</h3>
              <p className="text-sm text-[#8b949e]">
                En los <strong className="text-white">distribuidos</strong>, múltiples equipos procesan tareas de forma transparente al usuario, tolerando fallos. En los de <strong className="text-white">red</strong>, los equipos conservan su autonomía pero comparten recursos como servidores web o archivos.
              </p>
            </SpotlightCard>
            
            <SpotlightCard className="bg-[#161b22] border border-[#30363d] p-6 hover:border-[#8b949e] transition-colors">
              <h3 className="text-white font-bold mb-3">Dispositivos Móviles</h3>
              <p className="text-sm text-[#8b949e]">
                Optimizados para recursos limitados y pantallas táctiles. Destacan <strong className="text-white">iOS</strong> (basado en XNU/Mac OS X), el extinto <strong className="text-white">Symbian</strong> y <strong className="text-white">Android</strong> (basado en el kernel de Linux y fuertemente dependiente de máquinas virtuales).
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* 1.3 Evidencias */}
        <section>
          <SectionHeading id="1-3-evidencias" number="1.3" title="Evidencias y Ejecución en el Sistema" />
          <p className="mb-4">
            Para comprobar la naturaleza <strong className="text-white">multitarea</strong> e identificar el núcleo del sistema sobre el que trabajamos, ejecutamos los siguientes comandos:
          </p>

          <LinuxTerminal
            command="uname -a && cat /etc/os-release | grep PRETTY"
            output={`Linux migue1drs-pc 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux
PRETTY_NAME="Ubuntu 24.04 LTS"`}
            title="bash — Información del OS y Kernel"
          />

          <p className="my-4">
            Al ser un SO de propósito general moderno, soporta multitarea gestionando múltiples procesos concurrentemente. Podemos verificar la cantidad de procesos que nuestro SO administra en este momento:
          </p>

          <LinuxTerminal
            command="ps -e | wc -l"
            output={`342`}
            title="bash — Conteo de procesos actuales"
          />

          <p className="my-4">
            Y para observar los procesadores lógicos disponibles para tareas <strong className="text-white">paralelas/concurrentes</strong>:
          </p>

          <LinuxTerminal
            command="nproc && lscpu | grep 'Core(s) per socket'"
            output={`8
Core(s) per socket:  4`}
            title="bash — Información de procesamiento"
          />
        </section>

        <ReflectionBox>
          <p className="mb-3">
            <strong className="text-white">¿Qué aprendí?</strong> Aprendí a clasificar los sistemas operativos según sus paradigmas y cómo han evolucionado desde el simple procesamiento por lotes hasta los modernos SO para móviles.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorar?</strong> Podría investigar más a fondo cómo interactúan el núcleo y la capa de middleware.
          </p>
        </ReflectionBox>

        <ReadMarker topicId="tema-1" />
      </article>
    </div>
  );
}
