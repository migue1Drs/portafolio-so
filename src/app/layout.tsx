import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ProgressProvider } from "@/lib/progress-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portafolio | Sistemas Operativos",
  description: "Portafolio interactivo de evidencias de la materia de Sistemas Operativos. Desarrollado en Linux con C, explorando procesos, memoria, IPC y señales.",
  keywords: ["Sistemas Operativos", "Linux", "C", "Programación", "IPC", "Hilos", "Procesos", "Memoria", "Ingeniería"],
  authors: [{ name: "Miguel Suárez" }, { name: "Luis Gonzalez" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-[#111111] text-[#c9d1d9] custom-scrollbar`}
    >
      <body className="flex flex-col min-h-screen bg-[#111111] custom-scrollbar">
        <ProgressProvider>
          <Navbar />

          {/* Content area + Sidebar row */}
          <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
            {/* Main content */}
            <main className="flex-1 w-full bg-[#111111] min-w-0">
              <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-16 md:pb-24">
                {children}
              </div>
            </main>

            {/* Sidebar — only on large screens, border contained here */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-16 h-[calc(100vh-4rem)] border-l border-[#333333]">
                <Sidebar />
              </div>
            </div>
          </div>

          {/* Footer — truly full-width, outside the content/sidebar row */}
          <Footer />
        </ProgressProvider>
      </body>
    </html>
  );
}
