import { NavbarLogged } from "@/app/components/navbar-logged";
import Footer from "@/app/components/footer";
import EstatisticasAtletaCliente from '@/app/components/estatisticas-atleta-cliente';
import { ComparacaoAtletaOuro } from '@/app/components/comparacao-atleta-ouro';
import ExportarRelatorio from '@/app/components/exportar-relatorio';

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Estatísticas do Atleta
          </h1>
          <ExportarRelatorio 
            idAtleta={parseInt(resolvedParams.id)}
            tipoRelatorio="estatisticas"
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          />
        </div>
        
        <div className="space-y-8">
          <EstatisticasAtletaCliente idAtleta={parseInt(resolvedParams.id)} />
          <ComparacaoAtletaOuro idAtleta={parseInt(resolvedParams.id)} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
