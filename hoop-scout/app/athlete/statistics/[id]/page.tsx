import { NavbarLogged } from "@/app/components/navbar-logged";
import Footer from "@/app/components/footer";
import EstatisticasAtletaCliente from '@/app/components/estatisticas-atleta-cliente';
import { ComparacaoAtletaOuro } from '@/app/components/comparacao-atleta-ouro';

export default async function EstatisticasAtletaPage({ 
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
          Estatísticas do Atleta
        </h1>
        
        <div className="space-y-8">
          <EstatisticasAtletaCliente idAtleta={parseInt(resolvedParams.id)} />
          <ComparacaoAtletaOuro idAtleta={parseInt(resolvedParams.id)} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
