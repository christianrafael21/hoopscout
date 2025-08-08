import { Navbar } from "../../../components/navbar"
import Image from "next/image"
import Footer from "../../components/footer"

export default function AthleteTypePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-white text-5xl font-bold mt-2">Seja Atleta</h1>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Como atleta no HoopScout, você terá acesso a ferramentas avançadas de análise de desempenho e
              desenvolvimento profissional. Nossa plataforma foi projetada para ajudar você a alcançar seu máximo
              potencial no basquete.
            </p>

            <ol className="space-y-4 text-gray-300 list-decimal pl-5">
              <li>Crie seu perfil detalhado com estatísticas e vídeos de jogos</li>
              <li>Receba análises personalizadas do seu desempenho em quadra</li>
              <li>Compare suas métricas com padrões da indústria e outros atletas</li>
              <li>Acompanhe seu progresso com gráficos e relatórios detalhados</li>
              <li>Ganhe visibilidade com olheiros e programas de basquete</li>
              <li>Obtenha recomendações específicas para seu desenvolvimento</li>
            </ol>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/vecteezy_basketball_259792.svg"
              alt="Seja um Atleta HoopScout"
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

