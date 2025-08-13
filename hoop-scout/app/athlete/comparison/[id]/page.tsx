import { NavbarLogged } from "@/app/components/navbar-logged";
import Footer from "@/app/components/footer";
import { ComparacaoAtletaOuro } from '@/app/components/comparacao-atleta-ouro';

export default async function ComparacaoAtletaPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-white mb-6">
          Comparação com Atleta Ouro
        </h1>
        
        <div className="mb-4">
          <p className="text-gray-300">
            Compare o desempenho do atleta com os padrões ideais estabelecidos para sua categoria de idade.
          </p>
        </div>
        
        <ComparacaoAtletaOuro idAtleta={parseInt(resolvedParams.id)} />
      </main>
      <Footer />
    </div>
  );
}
