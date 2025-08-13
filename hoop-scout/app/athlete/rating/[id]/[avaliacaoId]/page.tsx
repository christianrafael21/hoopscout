import { getAvaliacao, getHistoricoAvaliacao } from '@/app/services/avaliacao.service';
import { Avaliacao } from '@/app/types/avaliacao';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NavbarLogged } from "@/app/components/navbar-logged";
import Footer from "@/app/components/footer";
import ExportarRelatorio from '@/app/components/exportar-relatorio';

async function getAvaliacaoDetalhes(idAtleta: number, idAvaliacao: number): Promise<{
  avaliacao: Avaliacao | undefined;
  historico: Avaliacao[];
}> {
  try {
    const [avaliacao, historico] = await Promise.all([
      getAvaliacao(idAtleta, idAvaliacao),
      getHistoricoAvaliacao(idAtleta, idAvaliacao)
    ]);

    return { avaliacao, historico };
  } catch (error) {
    console.error('Erro ao buscar detalhes da avaliação:', error);
    return { avaliacao: undefined, historico: [] };
  }
}

export default async function DetalhesAvaliacaoPage({ 
  params 
}: { 
  params: { id: string; avaliacaoId: string } 
}) {
  const { avaliacao, historico } = await getAvaliacaoDetalhes(
    parseInt(params.id),
    parseInt(params.avaliacaoId)
  );

  if (!avaliacao) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <NavbarLogged />
        <main className="container mx-auto px-6 py-12">
          <Card className="p-6">
            <p className="text-center text-gray-500">
              Avaliação não encontrada.
            </p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Avaliação #{avaliacao.id_avaliacao}
            </h1>
            <p className="text-gray-400">
              Realizada em {formatarData(avaliacao.data)}
            </p>
          </div>
          <div className="flex gap-3">
            <ExportarRelatorio 
              idAvaliacao={avaliacao.id_avaliacao}
              tipoRelatorio="avaliacao"
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            />
            <Link href={`/athlete/rating/${params.id}`}>
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Dados Físicos */}
            {avaliacao.dados_fisicos && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dados Físicos</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Idade</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_fisicos.idade} anos
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Altura</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_fisicos.altura} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Peso</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_fisicos.peso} kg
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Dados Técnicos */}
            {avaliacao.dados_tecnicos && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Dados Técnicos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Tiro Livre</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_tecnicos.tiro_livre}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Arremesso de 3</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_tecnicos.arremesso_tres}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Arremesso Livre</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_tecnicos.arremesso_livre}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Assistências</p>
                    <p className="text-lg font-medium">
                      {avaliacao.dados_tecnicos.assistencias}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Nota Média */}
            {avaliacao.nota_media && (
              <Card className="p-6 bg-blue-50">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                  Nota Final
                </h2>
                <p className="text-3xl font-bold text-blue-600">
                  {avaliacao.nota_media.toFixed(1)}
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  Esta nota é calculada com base nos dados físicos e técnicos do atleta
                </p>
              </Card>
            )}
          </div>

          {/* Histórico de Alterações */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Histórico de Alterações</h2>
            {historico.length === 0 ? (
              <p className="text-gray-500 text-center">
                Nenhuma alteração registrada.
              </p>
            ) : (
              <div className="space-y-4">
                {historico.map((versao, index) => (
                  <div
                    key={`historico-${index}`}
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      {formatarData(versao.data)}
                    </p>
                    {versao.dados_fisicos && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Dados Físicos:</p>
                        <div className="grid grid-cols-3 gap-2 text-sm mt-1">
                          <p>Idade: {versao.dados_fisicos.idade} anos</p>
                          <p>Altura: {versao.dados_fisicos.altura} cm</p>
                          <p>Peso: {versao.dados_fisicos.peso} kg</p>
                        </div>
                      </div>
                    )}
                    {versao.dados_tecnicos && (
                      <div>
                        <p className="text-sm font-medium">Dados Técnicos:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                          <p>Tiro Livre: {versao.dados_tecnicos.tiro_livre}%</p>
                          <p>Arremesso 3: {versao.dados_tecnicos.arremesso_tres}%</p>
                          <p>Arremesso Livre: {versao.dados_tecnicos.arremesso_livre}%</p>
                          <p>Assistências: {versao.dados_tecnicos.assistencias}</p>
                        </div>
                      </div>
                    )}
                    {versao.nota_media && (
                      <p className="text-sm font-medium mt-2">
                        Nota: {versao.nota_media.toFixed(1)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
