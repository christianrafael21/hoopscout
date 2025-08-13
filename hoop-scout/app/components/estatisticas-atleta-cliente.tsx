'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface DadosFisicos {
  idade: number;
  altura: number;
  peso: number;
}

interface DadosTecnicos {
  tiro_livre: number;
  arremesso_tres: number;
  arremesso_livre: number;
  assistencias: number;
}

interface Avaliacao {
  dados_fisicos?: DadosFisicos;
  dados_tecnicos?: DadosTecnicos;
  data_avaliacao: string;
}

interface EstatisticasAtleta {
  avaliacoes: Avaliacao[];
  mediaDadosFisicos: DadosFisicos;
  mediaDadosTecnicos: DadosTecnicos;
}

async function getEstatisticasAtleta(idAtleta: number): Promise<EstatisticasAtleta> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Token não encontrado');
  }

  // Buscar as avaliações do atleta
  const response = await fetch(`http://localhost:8083/avaliacao/avaliacao/atleta/${idAtleta}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar estatísticas');
  }

  const avaliacoes = await response.json();
  console.log(`[DEBUG] Avaliações recebidas:`, avaliacoes);
  
  // Processar as avaliações para calcular as médias
  if (avaliacoes.length === 0) {
    return {
      avaliacoes: [],
      mediaDadosFisicos: { idade: 0, altura: 0, peso: 0 },
      mediaDadosTecnicos: { 
        tiro_livre: 0, 
        arremesso_tres: 0, 
        arremesso_livre: 0, 
        assistencias: 0 
      }
    };
  }

  // Calcular médias dos dados físicos
  const somaDadosFisicos = avaliacoes.reduce((acc: DadosFisicos, avaliacao: Avaliacao) => {
    console.log(`[DEBUG] Processando avaliação:`, avaliacao);
    if (avaliacao.dados_fisicos) {
      console.log(`[DEBUG] Dados físicos da avaliação:`, avaliacao.dados_fisicos);
      acc.idade += avaliacao.dados_fisicos.idade || 0;
      acc.altura += avaliacao.dados_fisicos.altura || 0;
      acc.peso += avaliacao.dados_fisicos.peso || 0;
    }
    return acc;
  }, { idade: 0, altura: 0, peso: 0 });

  console.log(`[DEBUG] Soma dos dados físicos:`, somaDadosFisicos);

  // Contar quantas avaliações têm dados físicos válidos
  const avaliacoesComDadosFisicos = avaliacoes.filter((av: Avaliacao) => 
    av.dados_fisicos && 
    av.dados_fisicos.idade && 
    av.dados_fisicos.altura && 
    av.dados_fisicos.peso
  ).length;

  console.log(`[DEBUG] Avaliações com dados físicos válidos: ${avaliacoesComDadosFisicos}/${avaliacoes.length}`);

  const mediaDadosFisicos = {
    idade: avaliacoesComDadosFisicos > 0 ? Math.round(somaDadosFisicos.idade / avaliacoesComDadosFisicos) : 0,
    altura: avaliacoesComDadosFisicos > 0 ? Number((somaDadosFisicos.altura / avaliacoesComDadosFisicos).toFixed(2)) : 0,
    peso: avaliacoesComDadosFisicos > 0 ? Number((somaDadosFisicos.peso / avaliacoesComDadosFisicos).toFixed(2)) : 0
  };

  console.log(`[DEBUG] Média dos dados físicos calculada:`, mediaDadosFisicos);

  // Calcular médias dos dados técnicos
  const somaDadosTecnicos = avaliacoes.reduce((acc: DadosTecnicos, avaliacao: Avaliacao) => {
    if (avaliacao.dados_tecnicos) {
      acc.tiro_livre += avaliacao.dados_tecnicos.tiro_livre;
      acc.arremesso_tres += avaliacao.dados_tecnicos.arremesso_tres;
      acc.arremesso_livre += avaliacao.dados_tecnicos.arremesso_livre || 0;
      acc.assistencias += avaliacao.dados_tecnicos.assistencias;
    }
    return acc;
  }, { tiro_livre: 0, arremesso_tres: 0, arremesso_livre: 0, assistencias: 0 });

  const mediaDadosTecnicos = {
    tiro_livre: Number((somaDadosTecnicos.tiro_livre / avaliacoes.length).toFixed(2)),
    arremesso_tres: Number((somaDadosTecnicos.arremesso_tres / avaliacoes.length).toFixed(2)),
    arremesso_livre: Number((somaDadosTecnicos.arremesso_livre / avaliacoes.length).toFixed(2)),
    assistencias: Number((somaDadosTecnicos.assistencias / avaliacoes.length).toFixed(2))
  };

  return {
    avaliacoes: avaliacoes.map((av: Avaliacao) => ({
      dados_fisicos: av.dados_fisicos,
      dados_tecnicos: av.dados_tecnicos,
      data_avaliacao: av.data_avaliacao
    })),
    mediaDadosFisicos,
    mediaDadosTecnicos
  };
}

export default function EstatisticasAtletaCliente({ idAtleta }: { idAtleta: number }) {
  const [estatisticas, setEstatisticas] = useState<EstatisticasAtleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEstatisticasAtleta(idAtleta)
      .then(data => {
        setEstatisticas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [idAtleta]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (!estatisticas) {
    return null;
  }

  return (
    <div className="space-y-6">
      {estatisticas.avaliacoes.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-500 text-center">Nenhuma avaliação encontrada.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
          <Card className="p-6 ">
            <h3 className="text-lg font-semibold mb-4">Dados Físicos</h3>
            <div className="space-y-4 ">
              <div>
                <p className="text-sm text-gray-800">Idade</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosFisicos.idade.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Altura</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosFisicos.altura > 0 
                    ? `${estatisticas.mediaDadosFisicos.altura.toFixed(2)}m`
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Peso</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosFisicos.peso > 0 
                    ? `${estatisticas.mediaDadosFisicos.peso.toFixed(1)}kg`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 ">
            <h3 className="text-lg font-semibold mb-4">Dados Técnicos</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-800">Lance Livre</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosTecnicos.tiro_livre.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Arremesso de 3 pontos</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosTecnicos.arremesso_tres.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Arremesso Livre</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosTecnicos.arremesso_livre.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Assistências</p>
                <p className="text-lg font-medium">
                  {estatisticas.mediaDadosTecnicos.assistencias.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 ">
            <h3 className="text-lg font-semibold mb-4">Resumo de Avaliações</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-800">Total de Avaliações</p>
                <p className="text-lg font-medium">
                  {estatisticas.avaliacoes.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-800">Última Avaliação</p>
                <p className="text-lg font-medium">
                  {estatisticas.avaliacoes.length > 0 
                    ? (() => {
                        try {
                          // Ordenar avaliações por data decrescente para pegar a mais recente
                          const avaliacaoMaisRecente = [...estatisticas.avaliacoes].sort((a, b) => 
                            new Date(b.data_avaliacao).getTime() - new Date(a.data_avaliacao).getTime()
                          )[0];
                          
                          const data = new Date(avaliacaoMaisRecente.data_avaliacao);
                          return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleDateString('pt-BR');
                        } catch {
                          return 'Erro na data';
                        }
                      })()
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
