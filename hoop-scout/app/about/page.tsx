import { Navbar } from "../components/navbar"
import Image from "next/image"
import Footer from "../components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      <Navbar />

      <main className="container mx-auto px-6 py-12 relative">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-white text-5xl font-bold mt-2">Sobre nós</h1>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              O <strong>Hoop Scout</strong> é um software inovador de análise de desempenho esportivo, projetado para
              avaliar o potencial de jovens atletas no basquete. Combinamos métricas avançadas e estatísticas detalhadas
              para fornecer uma visão precisa do desenvolvimento dos jogadores. Nosso objetivo não é determinar o futuro
              de um atleta, mas oferecer insights estratégicos para treinadores, olheiros e tomadores de decisão,
              auxiliando na construção de carreiras promissoras.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="relative p-6 bg-[#33198c] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 opacity-10 transform rotate-12 scale-150"></div>
                <div className="relative space-y-4">
                  <h3 className="text-white text-xl font-semibold">Atleta</h3>
                  <p className="text-gray-200">
                    Analisamos atributos físicos e técnicos dos jogadores, proporcionando feedbacks que ajudam no
                    aprimoramento contínuo e no alcance do nível profissional.
                  </p>
                </div>
              </div>

              <div className="relative p-6 bg-[#f97f48] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-orange-600 opacity-10 transform -rotate-12 scale-150"></div>
                <div className="relative space-y-4">
                  <h3 className="text-white text-xl font-semibold">Juiz</h3>
                  <p className="text-gray-200">
                    Auxiliamos treinadores e olheiros a tomarem decisões mais embasadas, oferecendo dados objetivos
                    sobre cada atleta e suas projeções de desempenho futuro.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image src="vecteezy_basketball_259788 (1).svg" alt="HoopScout Analytics" width={500} height={500} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

