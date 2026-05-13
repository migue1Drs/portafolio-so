import { PageHeader } from "@/components/ui/PageHeader";
import { LinuxTerminal } from "@/components/ui/LinuxTerminal";
import { ReflectionBox } from "@/components/ui/ReflectionBox";
import { ReadMarker } from "@/components/ui/ReadMarker";

export default function Tema1Page() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Tema 1"
        title="Introducción al sistema operativo Linux"
        description="Fundamentos del sistema operativo GNU/Linux: su arquitectura, el kernel, la shell y los comandos esenciales para la administración del sistema."
      />

      <article className="space-y-8 text-[#b0b8c4] leading-relaxed">
        <section>
          <h2 className="text-xl text-white font-bold mb-4 border-b border-[#333333] pb-2">
            ¿Qué es Linux?
          </h2>
          <p className="mb-4">
            Linux es un <strong className="text-white">sistema operativo de código abierto</strong> basado en Unix. 
            Fue creado por <strong className="text-white">Linus Torvalds</strong> en 1991 y es mantenido por una 
            comunidad global de desarrolladores. El término &quot;Linux&quot; técnicamente se refiere al <em>kernel</em>, 
            mientras que el sistema completo se conoce como <strong className="text-white">GNU/Linux</strong>, ya que 
            incluye herramientas del proyecto GNU.
          </p>
          <p className="mb-4">
            A diferencia de sistemas operativos propietarios, Linux ofrece total transparencia en su funcionamiento 
            interno, lo que lo convierte en la herramienta ideal para el estudio de Sistemas Operativos.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-white font-bold mb-4 border-b border-[#333333] pb-2">
            Arquitectura del sistema
          </h2>
          <p className="mb-4">
            La arquitectura de Linux se organiza en capas:
          </p>
          <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm p-6 my-6">
            <div className="space-y-3 text-sm font-mono">
              <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-white font-bold">
                Aplicaciones de Usuario (programas, scripts, utilidades)
              </div>
              <div className="text-center text-[#f5a623]">↓</div>
              <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-white font-bold">
                Shell (bash, zsh) — Intérprete de Comandos
              </div>
              <div className="text-center text-[#f5a623]">↓</div>
              <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-white font-bold">
                Llamadas al Sistema (System Calls API)
              </div>
              <div className="text-center text-[#f5a623]">↓</div>
              <div className="bg-[#1a1a2e] border border-[#f5a623] rounded p-3 text-center text-[#f5a623] font-bold">
                Kernel de Linux (gestión de procesos, memoria, I/O, filesystem)
              </div>
              <div className="text-center text-[#f5a623]">↓</div>
              <div className="bg-[#2d333b] border border-[#444c56] rounded p-3 text-center text-white font-bold">
                Hardware (CPU, RAM, Discos, Periféricos)
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl text-white font-bold mb-4 border-b border-[#333333] pb-2">
            Comandos básicos de Linux
          </h2>
          <p className="mb-4">
            La terminal es la principal herramienta de interacción con Linux. Algunos comandos fundamentales incluyen:
          </p>

          <LinuxTerminal
            command="uname -a"
            output={`Linux migue1drs-pc 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux`}
            title="bash — información del sistema"
          />

          <LinuxTerminal
            command="ls -la /proc/self"
            output={`total 0
dr-xr-xr-x  9 migue1drs migue1drs 0 mayo  7 12:00 .
dr-xr-xr-x 298 root      root      0 mayo  7 08:00 ..
-r--r--r--  1 migue1drs migue1drs 0 mayo  7 12:00 cmdline
-r--r--r--  1 migue1drs migue1drs 0 mayo  7 12:00 status
lrwxrwxrwx  1 migue1drs migue1drs 0 mayo  7 12:00 exe -> /usr/bin/ls
lrwxrwxrwx  1 migue1drs migue1drs 0 mayo  7 12:00 cwd -> /home/migue1drs`}
            title="bash — sistema de archivos /proc"
          />

          <LinuxTerminal
            command="cat /etc/os-release | head -5"
            output={`PRETTY_NAME="Ubuntu 24.04 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04 LTS (Noble Numbat)"
ID=ubuntu`}
            title="bash — versión de distribución"
          />
        </section>

        <section>
          <h2 className="text-xl text-white font-bold mb-4 border-b border-[#333333] pb-2">
            El sistema de archivos virtual /proc
          </h2>
          <p className="mb-4">
            Linux expone información del kernel en tiempo real a través del pseudo-sistema de archivos <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">/proc</code>. 
            Cada proceso en ejecución tiene un directorio en <code className="bg-[#2d333b] px-2 py-0.5 rounded text-[#f5a623] text-sm">/proc/[PID]</code> que contiene 
            información como su estado, los archivos que tiene abiertos, la memoria que consume, etc.
          </p>

          <LinuxTerminal
            command="cat /proc/cpuinfo | head -10"
            output={`processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 142
model name	: Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz
stepping	: 10
microcode	: 0xf4
cpu MHz		: 800.000
cache size	: 6144 KB
physical id	: 0`}
            title="bash — información del CPU"
          />
        </section>

        <ReflectionBox>
          <p className="mb-3">
            <strong className="text-white">¿Qué aprendí?</strong> En esta primera práctica comprendí la arquitectura 
            fundamental de Linux y cómo el kernel actúa como intermediario entre el hardware y las aplicaciones de usuario 
            a través de las llamadas al sistema. El pseudo-sistema de archivos <code className="text-[#f5a623]">/proc</code> fue 
            una revelación, ya que permite acceder a información interna del sistema operativo como si fuera un archivo normal.
          </p>
          <p>
            <strong className="text-white">¿Cómo podría mejorar?</strong> Podría profundizar en la exploración de 
            <code className="text-[#f5a623]"> /sys</code> y <code className="text-[#f5a623]">/dev</code>, que son otros 
            pseudo-sistemas de archivos que exponen información de hardware. También sería útil escribir scripts de shell 
            que automaticen la recopilación de métricas del sistema.
          </p>
        </ReflectionBox>

        <ReadMarker topicId="tema-1" />
      </article>
    </div>
  );
}
