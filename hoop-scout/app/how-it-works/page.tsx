import { Navbar } from "../../components/navbar"
import Image from "next/image"
import Footer from "../components/footer"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-white text-5xl font-bold mt-2">Como funciona?</h1>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                O HoopScout utiliza tecnologia avançada de análise de dados para avaliar o desempenho de jogadores de
                basquete. Nossa plataforma coleta e processa informações detalhadas sobre diversos aspectos do jogo,
                desde estatísticas básicas até métricas avançadas de performance.
              </p>

              <p>
                Através de nossa interface intuitiva, atletas podem registrar seus dados, acompanhar seu progresso e
                receber análises personalizadas. Juízes e avaliadores têm acesso a ferramentas específicas para avaliar
                jogadores, criar relatórios detalhados e identificar talentos promissores.
              </p>

              <p>
                Nossa metodologia combina análise estatística, inteligência artificial e conhecimento especializado em
                basquete para fornecer insights valiosos. Isso permite que atletas, treinadores e olheiros tomem
                decisões mais informadas sobre desenvolvimento e recrutamento.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="vecteezy_basketball_259696.svg"
              alt="Como funciona o HoopScout"
              width={500}
              height={500}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

