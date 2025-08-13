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
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // Buscar avaliações do atleta
        const avaliacoesResponse = await fetch(`http://localhost:8083/avaliacao/avaliacao/atleta/${idAtleta}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!avaliacoesResponse.ok) {
          throw new Error('Erro ao buscar avaliações');
        }

        const avaliacoes = await avaliacoesResponse.json();

        if (avaliacoes.length === 0) {
          setError('Atleta não possui avaliações para comparação');
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
          if (idade <= 8) return 8;   // Mini (até 8 anos)
          if (idade <= 10) return 10; // Pre-mini (9-10 anos)
          if (idade <= 12) return 12; // Sub-12 (11-12 anos)
          if (idade <= 14) return 14; // Sub-14 (13-14 anos)
          if (idade <= 15) return 15; // Sub-15 (15 anos)
          if (idade <= 17) return 17; // Sub-17 (16-17 anos)
          if (idade <= 18) return 18; // Sub-18 (18 anos)
          if (idade <= 21) return 21; // Sub-21 (19-21 anos)
          return 21; // Para idades acima de 21, usar a categoria mais alta
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
            console.log(`[DEBUG] Erro na resposta:`, errorText);
          }

          setDados({
            mediaDadosFisicos,
            mediaDadosTecnicos,
            atletaOuro
          });
        } catch {
          // Se não encontrar atleta ouro, ainda mostra os dados do atleta
          setDados({
            mediaDadosFisicos,
            mediaDadosTecnicos
          });
        }

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
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
        AtletaOuro: dados.atletaOuro?.livre_ideal || 0
      },
      {
        subject: 'Arremesso 3',
        Atleta: dados.mediaDadosTecnicos.arremesso_tres,
        AtletaOuro: dados.atletaOuro?.tres_ideal || 0
      },
      {
        subject: 'Arremesso Livre',
        Atleta: dados.mediaDadosTecnicos.arremesso_livre,
        AtletaOuro: dados.atletaOuro?.tiro_ideal || 0
      },
      {
        subject: 'Assistências',
        Atleta: dados.mediaDadosTecnicos.assistencias,
        AtletaOuro: dados.atletaOuro?.assistencia_ideal || 0
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
                    <div className="font-medium text-yellow-600">{dados.atletaOuro.livre_ideal.toFixed(1)}%</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Arremesso de 3</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.arremesso_tres.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{dados.atletaOuro.tres_ideal.toFixed(1)}%</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Arremesso Livre</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.arremesso_livre.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{dados.atletaOuro.tiro_ideal.toFixed(1)}%</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                    <div>Assistências</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.assistencias.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{dados.atletaOuro.assistencia_ideal.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Dados Físicos - Padrão Ouro</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Altura Ideal:</span>
                      <span className="ml-2 font-medium">{dados.atletaOuro.altura_ideal.toFixed(2)}m</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Peso Ideal:</span>
                      <span className="ml-2 font-medium">{dados.atletaOuro.peso_ideal.toFixed(1)}kg</span>
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
