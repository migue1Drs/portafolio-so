import { PageHeader } from "@/components/ui/PageHeader";

export default function PrologoPage() {
  return (
    <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto w-full">
      <PageHeader
        number="Prólogo"
        title="Portafolio de Evidencias — Sistemas Operativos"
        description="Este portafolio documenta el aprendizaje adquirido a lo largo del curso de Sistemas Operativos, con énfasis en la práctica con el sistema GNU/Linux."
      />

      <article className="prose-custom space-y-8">
        {/* Titulo & Autor */}
        <div className="bg-[#1c1c1c] border border-[#333333] rounded-sm p-8 text-center">
          <h2 className="text-2xl text-white font-extrabold tracking-tight mb-2">
            Portafolio de Evidencias
          </h2>
          <p className="text-[#f5a623] text-lg font-bold uppercase tracking-widest mb-4">
            Sistemas Operativos
          </p>
          <div className="w-16 h-0.5 bg-[#f5a623] mx-auto mb-4"></div>
          <div className="text-[#a0a0a0] text-sm space-y-1">
            <p><strong className="text-white">Autores:</strong></p>
            <p>Gonzalez Giron Luis Eduardo</p>
            <p>Suárez Dolores Miguel</p>
          </div>
          <p className="text-[#888888] text-xs mt-1">
            Mayo 2026
          </p>
        </div>

        {/* Prologo texto */}
        <div className="space-y-6 text-[#b0b8c4] leading-relaxed">
          <p>
            El presente portafolio de evidencias tiene como finalidad recopilar, documentar y reflexionar 
            sobre cada una de las prácticas realizadas durante el curso de <strong className="text-white">Sistemas Operativos</strong>. 
            A lo largo de estas páginas se presenta el trabajo desarrollado en los principales temas del 
            curso, basados en las notas <em>&quot;Un Vistazo a los Sistemas Operativos&quot;</em>.
          </p>

          <p>
            Cada sección incluye una explicación teórica del tema, el código fuente de las prácticas 
            desarrolladas en lenguaje C sobre el sistema operativo Linux, las capturas de la salida en 
            terminal que evidencian la ejecución correcta de los programas, y una reflexión personal 
            sobre lo aprendido y las posibles mejoras.
          </p>

          <p>
            Los temas abordados comprenden desde la introducción al sistema operativo Linux, pasando 
            por la gestión de procesos e hilos, los mecanismos de comunicación entre procesos (IPC), 
            la administración de memoria, la arquitectura del sistema de archivos, hasta el manejo de 
            señales. Estos representan los pilares fundamentales para entender cómo un sistema operativo 
            moderno administra los recursos del hardware.
          </p>

          <div className="bg-[#1a1a2e] border border-[#30363d] rounded-sm p-6 my-8">
            <h3 className="text-[#f5a623] font-bold text-sm uppercase tracking-widest mb-4">
              Estructura del portafolio
            </h3>
            <ul className="space-y-2 text-sm text-[#a0a0a0]">
              <li className="flex items-start gap-2">
                <span className="text-[#f5a623] mt-0.5">▸</span>
                <span><strong className="text-white">Tema 1:</strong> Introducción al sistema operativo Linux</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a623] mt-0.5">▸</span>
                <span><strong className="text-white">Tema 2:</strong> Procesos e Hilos — fork(), wait(), exit(), hilos POSIX</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a623] mt-0.5">▸</span>
                <span><strong className="text-white">Tema 3:</strong> Mecanismos de comunicación entre procesos (IPC) — pipes, FIFOs, semáforos, memoria compartida, colas de mensajes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a623] mt-0.5">▸</span>
                <span><strong className="text-white">Tema 5:</strong> Administración de memoria</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a623] mt-0.5">▸</span>
                <span><strong className="text-white">Tema 6:</strong> Arquitectura del sistema de archivos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f5a623] mt-0.5">▸</span>
                <span><strong className="text-white">Tema 7:</strong> Señales</span>
              </li>
            </ul>
          </div>

          <p>
            Este blog fue desarrollado con tecnologías modernas de desarrollo web (Next.js / React) 
            con el objetivo de presentar un portafolio profesional, visualmente atractivo y funcional. 
            Cada práctica incluye código real ejecutado en un entorno Linux, con sus respectivas salidas 
            de terminal y análisis reflexivo.
          </p>
        </div>
      </article>
    </div>
  );
}
