import { NavbarLogged } from "@/app/components/navbar-logged";
import Footer from "@/app/components/footer";
import { AvaliacoesClient } from './avaliacoes-client';

export default async function AvaliacoesAtletaPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />
      <AvaliacoesClient atletaId={resolvedParams.id} />
      <Footer />
    </div>
  );
}
