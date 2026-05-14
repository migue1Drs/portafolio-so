import { PageHeader } from "@/components/ui/PageHeader";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ReadMarker } from "@/components/ui/ReadMarker";
import { TopicQuiz } from "@/components/ui/TopicQuiz";
import { TEMA1_QUIZ } from "@/lib/quiz-data";

export default function Tema1Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 1"
        title="Introducción a los Sistemas Operativos"
        description="Fundamentos teóricos de los Sistemas Operativos, su arquitectura, clasificación y evolución hasta los sistemas modernos y móviles."
      />

      <article className="space-y-10 text-[#b0b8c4] leading-relaxed">
        {/* 1.1 Introducción */}
        <section>
          <SectionHeading id="1-1-introduccion" number="1.1" title="Introducción" />
          <p className="mb-4">
            Un <strong className="text-white">sistema operativo (SO)</strong> es un conjunto de programas encargado de administrar los recursos de un dispositivo de cómputo. Proporciona una interfaz que permite la interacción del usuario y un núcleo (kernel) responsable de la comunicación con el hardware.
          </p>
          <p className="mb-4">Existen varias definiciones clave:</p>
          <ol className="list-decimal list-inside space-y-2 mb-6 ml-2">
            <li>Software que controla el hardware.</li>
            <li>Programa que controla la ejecución de otros programas y actúa como interfaz.</li>
            <li>Administrador de recursos (procesadores, almacenamiento, dispositivos E/S, datos).</li>
          </ol>
          <p className="mb-4">
            Sus responsabilidades principales abarcan:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 ml-2">
            <li><strong className="text-white">Administración de procesos:</strong> Evitar conflictos como sincronización incorrecta, falta de exclusión mutua o interbloqueos.</li>
            <li><strong className="text-white">Administración de memoria:</strong> Aislar procesos, asignar espacios y controlar el acceso.</li>
            <li><strong className="text-white">Seguridad y Recursos:</strong> Políticas como no compartición o compartición controlada, equidad y eficiencia.</li>
          </ul>
        </section>

        {/* 1.2 Clasificación */}
        <section>
          <SectionHeading id="1-2-clasificacion" number="1.2" title="Clasificación de los sistemas operativos" />
          <p className="mb-6">
            A lo largo de la historia, los SO se han clasificado según su uso y arquitectura:
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold mb-2">1.2.1 Sistemas operativos por lotes</h3>
              <p>Procesan grandes cantidades de trabajos agrupados con poca o ninguna interacción del usuario, reduciendo tiempos muertos del procesador. Ejemplo: SCOPE, EXEC II.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">1.2.2 Sistemas operativos de tiempo real</h3>
              <p>Priorizan la ejecución correcta y oportuna (comportamiento determinista) sobre la interacción del usuario. Se usan en control de tráfico aéreo, sector automotriz, etc. Ejemplos: VxWorks, FreeRTOS, QNX.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">1.2.3 Sistemas operativos de multitarea</h3>
              <p>Soportan la ejecución concurrente de múltiples tareas alternando su ejecución mediante planificación. Puede ser a nivel de procesos o hilos (threads). Ejemplos: UNIX, macOS, Windows, GNU/Linux.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">1.2.4 Sistemas operativos distribuidos</h3>
              <p>Distribuyen trabajos entre múltiples procesadores, viéndose como una única entidad para el usuario. Pueden ser <strong className="text-white">fuertemente acoplados</strong> (comparten memoria/reloj) o <strong className="text-white">débilmente acoplados</strong>. Destacan por su tolerancia a fallos. Ejemplos: Amoeba, Mach.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">1.2.5 Sistemas operativos de red</h3>
              <p>Interconectan computadoras que conservan su autonomía, compartiendo recursos como archivos o impresoras. Ejemplos: Windows Server, Novell NetWare.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-2">1.2.6 Sistemas operativos paralelos</h3>
              <p>Explotan arquitecturas multiprocesador o multinúcleo ejecutando procesos simultáneamente, lo que requiere mecanismos eficientes de sincronización.</p>
            </div>

            <div>
              <h3 className="text-[#f5a623] font-bold mb-3 mt-6">1.2.7 Sistemas operativos para dispositivos móviles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#161b22] border border-[#30363d] p-4 rounded">
                  <h4 className="text-white font-bold">Symbian</h4>
                  <p className="text-sm mt-2">Dominante en la era Nokia. Su núcleo y procesos operaban en un espacio protegido (C++). Fue superado por su complejidad de desarrollo.</p>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] p-4 rounded">
                  <h4 className="text-white font-bold">iOS (iPhone OS)</h4>
                  <p className="text-sm mt-2">Basado en Mac OS X (XNU). Arquitectura en capas: Aplicaciones, Middleware (Cocoa Touch, Media, Core Services) y Kernel. Interfaz puramente multitáctil.</p>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] p-4 rounded">
                  <h4 className="text-white font-bold">BlackBerry</h4>
                  <p className="text-sm mt-2">Kernel basado en Java (arquitectura ARM), con una fuerte administración de memoria dividida.</p>
                </div>
                <div className="bg-[#161b22] border border-[#30363d] p-4 rounded">
                  <h4 className="text-white font-bold">Android</h4>
                  <p className="text-sm mt-2">Basado en el kernel de GNU/Linux. Inicialmente usó Dalvik y luego ART. Destaca por su código abierto, conectividad avanzada y uso extendido globalmente.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ejecución (Requisito) */}
        <section>
          <SectionHeading id="1-3-ejecucion" number="1.3" title="Evidencia de Ejecución" />
          <p className="mb-4">
            Para comprobar las capacidades de nuestro sistema operativo Linux actual como un entorno <strong>multitarea</strong> y moderno, ejecutamos comandos para verificar la información del núcleo (kernel) y los procesos activos:
          </p>

          <LinuxTerminal
            command="uname -a && ps -e | wc -l"
            output={`Linux migue1drs-pc 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux
342`}
            title="bash — Kernel y Procesos"
          />
        </section>

        <ReflectionBox>
          <p className="mb-3">
            <strong className="text-white">¿Qué aprendí?</strong> Aprendí a conceptualizar correctamente qué es un sistema operativo y a clasificarlo según sus paradigmas y usos históricos (por lotes, tiempo real, paralelos). Además, comprendí las diferencias arquitectónicas clave entre sistemas móviles como iOS (XNU) y Android (kernel Linux + máquina virtual).
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorarla?</strong> Podría mejorarla profundizando en cómo se implementa la máquina virtual de Android (ART) frente a Dalvik para entender cómo gestionan la memoria y afectan el consumo de batería del dispositivo, e intentar crear un script que monitorice recursos en tiempo real.
          </p>
        </ReflectionBox>

        <TopicQuiz topicId="tema-1" title="Test — Introducción a los SO" questions={TEMA1_QUIZ} />

        <ReadMarker topicId="tema-1" />
      </article>
    </div>
  );
}
