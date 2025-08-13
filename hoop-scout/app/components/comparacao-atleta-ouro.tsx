'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface Avaliacao {
  dados_fisicos?: DadosFisicos;
  dados_tecnicos?: DadosTecnicos;
}

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

interface AtletaOuro {
  id_atleta_ouro: number;
  idade_categoria: number;
  peso_ideal: number;
  altura_ideal: number;
  tiro_ideal: number;
  assistencia_ideal: number;
  livre_ideal: number;
  tres_ideal: number;
}

interface ComparacaoData {
  mediaDadosFisicos: DadosFisicos;
  mediaDadosTecnicos: DadosTecnicos;
  atletaOuro?: AtletaOuro;
}

export function ComparacaoAtletaOuro({ idAtleta }: { idAtleta: number }) {
  const [dados, setDados] = useState<ComparacaoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComparacaoData() {
      try {
        console.log(`[DEBUG COMPARACAO] Iniciando busca para atleta ${idAtleta}`);
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // Buscar avaliações do atleta
        const avaliacoesResponse = await fetch(`http://localhost:8083/avaliacao/avaliacao/atleta/${idAtleta}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log(`[DEBUG COMPARACAO] Status da resposta: ${avaliacoesResponse.status}`);

        if (!avaliacoesResponse.ok) {
          const errorText = await avaliacoesResponse.text();
          console.log(`[DEBUG COMPARACAO] Erro na resposta:`, errorText);
          throw new Error(`Erro ao buscar avaliações: ${avaliacoesResponse.status}`);
        }

        const avaliacoes = await avaliacoesResponse.json();
        console.log(`[DEBUG COMPARACAO] Avaliações recebidas:`, avaliacoes);

        if (avaliacoes.length === 0) {
          setError('Atleta não possui avaliações para comparação');
          setLoading(false);
          return;
        }

        // Calcular médias do atleta
        const somaDadosFisicos = avaliacoes.reduce((acc: DadosFisicos, av: Avaliacao) => {
          if (av.dados_fisicos) {
            acc.idade += av.dados_fisicos.idade;
            acc.altura += av.dados_fisicos.altura;
            acc.peso += av.dados_fisicos.peso;
          }
          return acc;
        }, { idade: 0, altura: 0, peso: 0 });

        const somaDadosTecnicos = avaliacoes.reduce((acc: DadosTecnicos, av: Avaliacao) => {
          if (av.dados_tecnicos) {
            acc.tiro_livre += av.dados_tecnicos.tiro_livre;
            acc.arremesso_tres += av.dados_tecnicos.arremesso_tres;
            acc.arremesso_livre += av.dados_tecnicos.arremesso_livre || 0;
            acc.assistencias += av.dados_tecnicos.assistencias;
          }
          return acc;
        }, { tiro_livre: 0, arremesso_tres: 0, arremesso_livre: 0, assistencias: 0 });

        const mediaDadosFisicos = {
          idade: Math.round(somaDadosFisicos.idade / avaliacoes.length),
          altura: Number((somaDadosFisicos.altura / avaliacoes.length).toFixed(2)),
          peso: Number((somaDadosFisicos.peso / avaliacoes.length).toFixed(2))
        };

        const mediaDadosTecnicos = {
          tiro_livre: Number((somaDadosTecnicos.tiro_livre / avaliacoes.length).toFixed(2)),
          arremesso_tres: Number((somaDadosTecnicos.arremesso_tres / avaliacoes.length).toFixed(2)),
          arremesso_livre: Number((somaDadosTecnicos.arremesso_livre / avaliacoes.length).toFixed(2)),
          assistencias: Number((somaDadosTecnicos.assistencias / avaliacoes.length).toFixed(2))
        };

        // Determinar a categoria de idade correta para buscar o atleta ouro
        const determinarCategoriaIdade = (idade: number): number => {
          // Categorias baseadas nas divisões comuns do basquete
          // O atleta é comparado com a categoria ACIMA da sua idade
          if (idade <= 7) return 8;   // Até 7 anos -> categoria Sub-8
          if (idade <= 9) return 10;  // 8-9 anos -> categoria Sub-10  
          if (idade <= 11) return 12; // 10-11 anos -> categoria Sub-12
          if (idade <= 13) return 14; // 12-13 anos -> categoria Sub-14
          if (idade <= 14) return 15; // 14 anos -> categoria Sub-15
          if (idade <= 16) return 17; // 15-16 anos -> categoria Sub-17
          if (idade <= 17) return 18; // 17 anos -> categoria Sub-18
          if (idade <= 20) return 21; // 18-20 anos -> categoria Sub-21
          return 21; // Para idades acima de 20, usar a categoria mais alta
        };

        const categoriaIdade = determinarCategoriaIdade(mediaDadosFisicos.idade);
        console.log(`[DEBUG] Atleta tem ${mediaDadosFisicos.idade} anos, buscando categoria ${categoriaIdade}`);

        // Buscar atleta ouro da categoria correspondente
        try {
          const atletaOuroResponse = await fetch(`http://localhost:8083/avaliacao/atleta-ouro/idade/${categoriaIdade}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          console.log(`[DEBUG] Response status: ${atletaOuroResponse.status}`);
          
          let atletaOuro = undefined;
          if (atletaOuroResponse.ok) {
            atletaOuro = await atletaOuroResponse.json();
            console.log(`[DEBUG] Atleta ouro encontrado:`, atletaOuro);
          } else {
            const errorText = await atletaOuroResponse.text();
            console.log(`[DEBUG] Erro na resposta atleta ouro:`, errorText);
          }

          setDados({
            mediaDadosFisicos,
            mediaDadosTecnicos,
            atletaOuro
          });
        } catch (error) {
          console.log(`[DEBUG] Erro ao buscar atleta ouro:`, error);
          // Se não encontrar atleta ouro, ainda mostra os dados do atleta
          setDados({
            mediaDadosFisicos,
            mediaDadosTecnicos
          });
        }

        setLoading(false);
      } catch (error) {
        console.error(`[DEBUG COMPARACAO] Erro geral:`, error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
        setLoading(false);
      }
    }

    fetchComparacaoData();
  }, [idAtleta]);

  const formatarDadosRadar = () => {
    if (!dados) return [];

    const dadosRadar = [
      {
        subject: 'Tiro Livre',
        Atleta: dados.mediaDadosTecnicos.tiro_livre,
        AtletaOuro: dados.atletaOuro ? Number(dados.atletaOuro.livre_ideal) : 0
      },
      {
        subject: 'Arremesso 3',
        Atleta: dados.mediaDadosTecnicos.arremesso_tres,
        AtletaOuro: dados.atletaOuro ? Number(dados.atletaOuro.tres_ideal) : 0
      },
      {
        subject: 'Arremesso Livre',
        Atleta: dados.mediaDadosTecnicos.arremesso_livre,
        AtletaOuro: dados.atletaOuro ? Number(dados.atletaOuro.tiro_ideal) : 0
      },
      {
        subject: 'Assistências',
        Atleta: dados.mediaDadosTecnicos.assistencias,
        AtletaOuro: dados.atletaOuro ? Number(dados.atletaOuro.assistencia_ideal) : 0
      }
    ];

    return dadosRadar;
  };

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

  if (!dados) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          Comparação com Atleta Ouro 
          {dados.atletaOuro ? `(Categoria Sub-${dados.atletaOuro.idade_categoria})` : ''}
        </h3>
        
        {dados.atletaOuro ? (
          <div>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Atleta:</strong> {dados.mediaDadosFisicos.idade} anos | 
                <strong> Categoria de Comparação:</strong> Sub-{dados.atletaOuro.idade_categoria}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Radar */}
              <div className="h-[400px]">
                <h4 className="text-lg font-medium mb-4 text-center">Comparação Técnica</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={formatarDadosRadar()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Atleta" 
                      dataKey="Atleta" 
                      stroke="#1a75ff" 
                      fill="#1a75ff" 
                      fillOpacity={0.3} 
                      strokeWidth={2}
                    />
                    <Radar 
                      name="Atleta Ouro" 
                      dataKey="AtletaOuro" 
                      stroke="#ffd700" 
                      fill="#ffd700" 
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Comparação Detalhada */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Comparação Detalhada</h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
                    <div>Habilidade</div>
                    <div>Atleta</div>
                    <div>Padrão Ouro</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Tiro Livre</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.tiro_livre.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.livre_ideal).toFixed(1)}%</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Arremesso de 3</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.arremesso_tres.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.tres_ideal).toFixed(1)}%</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Arremesso Livre</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.arremesso_livre.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.tiro_ideal).toFixed(1)}%</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Assistências</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.assistencias.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.assistencia_ideal).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Dados Físicos - Padrão Ouro</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Altura Ideal:</span>
                      <span className="ml-2 font-medium">{Number(dados.atletaOuro.altura_ideal).toFixed(2)}m</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Peso Ideal:</span>
                      <span className="ml-2 font-medium">{Number(dados.atletaOuro.peso_ideal).toFixed(1)}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Não há atleta ouro cadastrado para a categoria de idade {dados.mediaDadosFisicos.idade} anos.
            </p>
            <p className="text-sm text-gray-400">
              Entre em contato com o administrador para cadastrar os dados de referência.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
