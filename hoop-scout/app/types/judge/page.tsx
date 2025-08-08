import { Navbar } from "../../../components/navbar"
import Image from "next/image"
import Footer from "../../components/footer"

export default function JudgeTypePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-white text-5xl font-bold mt-2">Seja Treinador</h1>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Como treinador no HoopScout, você terá acesso a ferramentas especializadas para avaliação e análise de
              talentos. Nossa plataforma oferece recursos avançados para ajudar você a identificar e avaliar o potencial
              dos atletas de forma precisa e objetiva.
            </p>

            <ol className="space-y-4 text-gray-300 list-decimal pl-5">
              <li>Acesse perfis completos de atletas com estatísticas detalhadas</li>
              <li>Utilize ferramentas avançadas de análise de desempenho</li>
              <li>Crie relatórios personalizados de avaliação</li>
              <li>Compare atletas usando métricas padronizadas</li>
              <li>Acompanhe o desenvolvimento dos jogadores ao longo do tempo</li>
              <li>Compartilhe avaliações com outros profissionais da área</li>
            </ol>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/vecteezy_basketball_259688.svg"
              alt="Seja um Treinador HoopScout"
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

