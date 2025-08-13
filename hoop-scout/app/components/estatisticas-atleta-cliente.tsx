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
  id_avaliacao?: number;
  data_avaliacao?: string; // Data formatada vinda do backend
  data?: string; // Data ISO original
  dados_fisicos?: DadosFisicos;
  dados_tecnicos?: DadosTecnicos;
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
  console.log(`[DEBUG ESTATISTICAS] Avaliações recebidas:`, avaliacoes);
  
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

  // Ordenar avaliações por data (mais recente primeiro) e ID como critério de desempate
  const avaliacoesOrdenadas = avaliacoes.sort((a: Avaliacao, b: Avaliacao) => {
    const dataA = new Date(a.data || a.data_avaliacao || 0);
    const dataB = new Date(b.data || b.data_avaliacao || 0);
    
    // Primeiro critério: data mais recente
    const diffData = dataB.getTime() - dataA.getTime();
    if (diffData !== 0) {
      return diffData;
    }
    
    // Critério de desempate: ID maior (mais recente)
    const idA = a.id_avaliacao || 0;
    const idB = b.id_avaliacao || 0;
    return idB - idA;
  });

  console.log(`[DEBUG ESTATISTICAS] Avaliações ordenadas:`, 
    avaliacoesOrdenadas.map((av: Avaliacao, index: number) => ({
      index,
      id: av.id_avaliacao,
      data: av.data || av.data_avaliacao,
      idade: av.dados_fisicos?.idade
    }))
  );

  // Usar dados físicos da avaliação mais recente para idade (dados atuais)
  const avaliacaoMaisRecente = avaliacoesOrdenadas[0];
  const dadosFisicosMaisRecente = avaliacaoMaisRecente?.dados_fisicos;
  
  console.log(`[DEBUG ESTATISTICAS] Dados físicos mais recentes:`, dadosFisicosMaisRecente);

  // Calcular médias dos dados físicos (mas usar idade atual da avaliação mais recente)
  const somaDadosFisicos = avaliacoes.reduce((acc: DadosFisicos, avaliacao: Avaliacao) => {
    console.log(`[DEBUG ESTATISTICAS] Processando avaliação:`, avaliacao);
    if (avaliacao.dados_fisicos) {
      console.log(`[DEBUG ESTATISTICAS] Dados físicos da avaliação:`, avaliacao.dados_fisicos);
      
      // Para altura e peso, calcular média de todas as avaliações
      if (avaliacao.dados_fisicos.altura && !isNaN(Number(avaliacao.dados_fisicos.altura))) {
        acc.altura += Number(avaliacao.dados_fisicos.altura);
      }
      if (avaliacao.dados_fisicos.peso && !isNaN(Number(avaliacao.dados_fisicos.peso))) {
        acc.peso += Number(avaliacao.dados_fisicos.peso);
      }
      // Idade não entra na soma porque vamos usar apenas a mais recente
    } else {
      console.log(`[DEBUG ESTATISTICAS] Avaliação sem dados físicos`);
    }
    return acc;
  }, { idade: 0, altura: 0, peso: 0 });

  console.log(`[DEBUG ESTATISTICAS] Soma dos dados físicos:`, somaDadosFisicos);

  // Contar quantas avaliações têm dados físicos válidos para altura e peso
  const avaliacoesComAltura = avaliacoes.filter((av: Avaliacao) => 
    av.dados_fisicos && av.dados_fisicos.altura && !isNaN(Number(av.dados_fisicos.altura))
  ).length;
  
  const avaliacoesComPeso = avaliacoes.filter((av: Avaliacao) => 
    av.dados_fisicos && av.dados_fisicos.peso && !isNaN(Number(av.dados_fisicos.peso))
  ).length;

  console.log(`[DEBUG ESTATISTICAS] Contadores: altura=${avaliacoesComAltura}, peso=${avaliacoesComPeso}/${avaliacoes.length}`);

  const mediaDadosFisicos = {
    idade: dadosFisicosMaisRecente ? Number(dadosFisicosMaisRecente.idade) || 0 : 0, // Usar idade atual, não média
    altura: avaliacoesComAltura > 0 ? Number((somaDadosFisicos.altura / avaliacoesComAltura).toFixed(2)) : 0,
    peso: avaliacoesComPeso > 0 ? Number((somaDadosFisicos.peso / avaliacoesComPeso).toFixed(2)) : 0
  };

  console.log(`[DEBUG ESTATISTICAS] Dados físicos processados:`, mediaDadosFisicos);

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
      id_avaliacao: av.id_avaliacao,
      dados_fisicos: av.dados_fisicos,
      dados_tecnicos: av.dados_tecnicos,
      data_avaliacao: av.data_avaliacao,
      data: av.data // Manter também a data original para casos onde data_avaliacao não estiver disponível
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
                          console.log(`[DEBUG] Todas as avaliações:`, estatisticas.avaliacoes);
                          
                          // Buscar a avaliação mais recente com data válida
                          const avaliacoesComData = estatisticas.avaliacoes.filter(av => av.data_avaliacao || av.data);
                          console.log(`[DEBUG] Avaliações com data:`, avaliacoesComData);
                          
                          if (avaliacoesComData.length === 0) {
                            console.log(`[DEBUG] Nenhuma avaliação com data encontrada`);
                            return 'N/A';
                          }
                          
                          // Ordenar por data e pegar a mais recente
                          const avaliacaoMaisRecente = [...avaliacoesComData].sort((a, b) => {
                            // Usar data_avaliacao se disponível, senão usar data
                            const dataStrA = a.data_avaliacao || a.data;
                            const dataStrB = b.data_avaliacao || b.data;
                            
                            if (!dataStrA || !dataStrB) return 0;
                            
                            const dateA = new Date(dataStrA);
                            const dateB = new Date(dataStrB);
                            return dateB.getTime() - dateA.getTime();
                          })[0];
                          
                          console.log(`[DEBUG] Avaliação mais recente:`, avaliacaoMaisRecente);
                          
                          // Se temos data_avaliacao formatada (DD/MM/YYYY), usar ela diretamente
                          if (avaliacaoMaisRecente.data_avaliacao && 
                              avaliacaoMaisRecente.data_avaliacao.includes('/')) {
                            console.log(`[DEBUG] Usando data formatada do backend:`, avaliacaoMaisRecente.data_avaliacao);
                            return avaliacaoMaisRecente.data_avaliacao;
                          }
                          
                          // Fallback: processar data ISO se necessário
                          const dataStr = avaliacaoMaisRecente.data_avaliacao || avaliacaoMaisRecente.data;
                          console.log(`[DEBUG] Processando data:`, dataStr);
                          
                          if (!dataStr) {
                            return 'N/A';
                          }
                          
                          const data = new Date(dataStr);
                          if (isNaN(data.getTime())) {
                            console.error(`[DEBUG] Data inválida:`, dataStr);
                            return 'Data inválida';
                          }
                          
                          return data.toLocaleDateString('pt-BR');
                        } catch (error) {
                          console.error(`[DEBUG] Erro ao processar data:`, error);
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
