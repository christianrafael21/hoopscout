'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface Avaliacao {
  id_avaliacao?: number;
  data: Date | string;
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

        // Debug: verificar as datas das avaliações conforme chegam do backend
        console.log(`[DEBUG COMPARACAO] Datas das avaliações (como recebidas):`, 
          avaliacoes.map((av: Avaliacao, index: number) => ({
            index,
            id: av.id_avaliacao,
            data: av.data,
            idade: av.dados_fisicos?.idade,
            data_formatted: new Date(av.data).toLocaleDateString()
          }))
        );

        // Ordenar avaliações por data (mais recente primeiro) e por ID como critério de desempate
        const avaliacoesOrdenadas = avaliacoes.sort((a: Avaliacao, b: Avaliacao) => {
          const dataA = new Date(a.data);
          const dataB = new Date(b.data);
          
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

        console.log(`[DEBUG COMPARACAO] Avaliações após ordenação (com critério de desempate):`, 
          avaliacoesOrdenadas.map((av: Avaliacao, index: number) => ({
            index,
            id: av.id_avaliacao,
            data: av.data,
            idade: av.dados_fisicos?.idade,
            data_formatted: new Date(av.data).toLocaleDateString()
          }))
        );

        // Usar apenas a avaliação mais recente para dados físicos (idade atual)
        const avaliacaoMaisRecente = avaliacoesOrdenadas[0];
        const dadosFisicosMaisRecente = avaliacaoMaisRecente.dados_fisicos;

        if (!dadosFisicosMaisRecente) {
          setError('Avaliação mais recente não possui dados físicos');
          setLoading(false);
          return;
        }

        console.log(`[DEBUG COMPARACAO] Dados físicos mais recentes:`, dadosFisicosMaisRecente);

        // Para dados técnicos, calcular média de todas as avaliações
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
          idade: dadosFisicosMaisRecente.idade || 0, // Usar idade atual, não média
          altura: Number(dadosFisicosMaisRecente.altura) || 0, // Converter para número e usar fallback
          peso: Number(dadosFisicosMaisRecente.peso) || 0 // Converter para número e usar fallback
        };

        console.log(`[DEBUG COMPARACAO] Dados físicos processados:`, mediaDadosFisicos);

        const mediaDadosTecnicos = {
          tiro_livre: Number((somaDadosTecnicos.tiro_livre / avaliacoes.length).toFixed(2)),
          arremesso_tres: Number((somaDadosTecnicos.arremesso_tres / avaliacoes.length).toFixed(2)),
          arremesso_livre: Number((somaDadosTecnicos.arremesso_livre / avaliacoes.length).toFixed(2)),
          assistencias: Number((somaDadosTecnicos.assistencias / avaliacoes.length).toFixed(2))
        };

        // Determinar a categoria de idade correta para buscar o atleta ouro
        const determinarCategoriaIdade = (idade: number): number => {
          // Regras específicas: apenas SUB-15 e SUB-18
          if (idade <= 14) return 15; // Todos até 14 anos -> categoria Sub-15
          if (idade <= 18) return 18; // Todos de 15-18 anos -> categoria Sub-18
          throw new Error('Idade não permitida no sistema'); // Acima de 18 não pode
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

  const formatarDadosFisicos = () => {
    if (!dados || !dados.atletaOuro) return [];

    // Validar valores para evitar NaN - conversão mais robusta
    const alturaAtleta = Number(dados.mediaDadosFisicos.altura) || 0;
    const pesoAtleta = Number(dados.mediaDadosFisicos.peso) || 0;
    const alturaOuro = Number(dados.atletaOuro.altura_ideal) || 0;
    const pesoOuro = Number(dados.atletaOuro.peso_ideal) || 0;

    console.log(`[DEBUG] Dados físicos formatados:`, {
      alturaAtleta,
      pesoAtleta,
      alturaOuro,
      pesoOuro,
      dadosOriginais: {
        altura: dados.mediaDadosFisicos.altura,
        peso: dados.mediaDadosFisicos.peso,
        alturaIdeal: dados.atletaOuro.altura_ideal,
        pesoIdeal: dados.atletaOuro.peso_ideal
      }
    });

    return [
      {
        name: 'Altura (m)',
        Atleta: alturaAtleta,
        AtletaOuro: alturaOuro
      },
      {
        name: 'Peso (kg)', 
        Atleta: pesoAtleta,
        AtletaOuro: pesoOuro
      }
    ];
  };

  const calcularPercentualAtingimento = (valorAtleta: number, valorOuro: number): number => {
    // Validar valores para evitar NaN
    if (!valorAtleta || !valorOuro || valorOuro === 0) return 0;
    return Math.min((valorAtleta / valorOuro) * 100, 100);
  };

  const getCorPercentual = (percentual: number): string => {
    if (percentual >= 90) return 'text-green-600 bg-green-100';
    if (percentual >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Gráfico de Radar - Habilidades Técnicas */}
              <div className="h-[400px]">
                <h4 className="text-lg font-medium mb-4 text-center">Habilidades Técnicas</h4>
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

              {/* Gráfico de Barras - Dados Físicos */}
              <div className="h-[400px]">
                <h4 className="text-lg font-medium mb-4 text-center">Comparação Física</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatarDadosFisicos()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="Atleta" 
                      fill="#1a75ff" 
                      name="Atleta"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="AtletaOuro" 
                      fill="#ffd700" 
                      name="Padrão Ouro"
                      radius={[4, 4, 0, 0]}
                    />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Comparação Detalhada */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Análise Detalhada</h4>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                    <div>Habilidade</div>
                    <div>Atleta</div>
                    <div>Padrão Ouro</div>
                    <div>Atingimento</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
                    <div>Tiro Livre</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.tiro_livre.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.livre_ideal).toFixed(1)}%</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getCorPercentual(calcularPercentualAtingimento(dados.mediaDadosTecnicos.tiro_livre, Number(dados.atletaOuro.livre_ideal)))}`}>
                      {calcularPercentualAtingimento(dados.mediaDadosTecnicos.tiro_livre, Number(dados.atletaOuro.livre_ideal)).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
                    <div>Arremesso de 3</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.arremesso_tres.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.tres_ideal).toFixed(1)}%</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getCorPercentual(calcularPercentualAtingimento(dados.mediaDadosTecnicos.arremesso_tres, Number(dados.atletaOuro.tres_ideal)))}`}>
                      {calcularPercentualAtingimento(dados.mediaDadosTecnicos.arremesso_tres, Number(dados.atletaOuro.tres_ideal)).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
                    <div>Arremesso Livre</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.arremesso_livre.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.tiro_ideal).toFixed(1)}%</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getCorPercentual(calcularPercentualAtingimento(dados.mediaDadosTecnicos.arremesso_livre, Number(dados.atletaOuro.tiro_ideal)))}`}>
                      {calcularPercentualAtingimento(dados.mediaDadosTecnicos.arremesso_livre, Number(dados.atletaOuro.tiro_ideal)).toFixed(0)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
                    <div>Assistências</div>
                    <div className="font-medium">{dados.mediaDadosTecnicos.assistencias.toFixed(1)}%</div>
                    <div className="font-medium text-yellow-600">{Number(dados.atletaOuro.assistencia_ideal).toFixed(1)}%</div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getCorPercentual(calcularPercentualAtingimento(dados.mediaDadosTecnicos.assistencias, Number(dados.atletaOuro.assistencia_ideal)))}`}>
                      {calcularPercentualAtingimento(dados.mediaDadosTecnicos.assistencias, Number(dados.atletaOuro.assistencia_ideal)).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Comparação Física</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Altura:</span>
                      <span className="font-medium">
                        {Number(dados.mediaDadosFisicos.altura).toFixed(2) || '0.00'}m vs {Number(dados.atletaOuro.altura_ideal).toFixed(2) || '0.00'}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peso:</span>
                      <span className="font-medium">
                        {Number(dados.mediaDadosFisicos.peso).toFixed(1) || '0.0'}kg vs {Number(dados.atletaOuro.peso_ideal).toFixed(1) || '0.0'}kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Interpretação & Objetivos</h5>
                  <div className="space-y-2 text-sm text-green-700">
                    <p>
                      <strong>Categoria:</strong> {dados.mediaDadosFisicos.idade <= 14 
                        ? "Sub-15 - Foco no desenvolvimento técnico e crescimento físico."
                        : "Sub-18 - Refinamento técnico e condicionamento físico avançado."
                      }
                    </p>
                    <div className="mt-3">
                      <strong>Próximos Passos:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {dados.mediaDadosTecnicos.tiro_livre < Number(dados.atletaOuro.livre_ideal) && (
                          <li>Melhorar precisão no tiro livre (meta: {Number(dados.atletaOuro.livre_ideal)}%)</li>
                        )}
                        {dados.mediaDadosTecnicos.arremesso_tres < Number(dados.atletaOuro.tres_ideal) && (
                          <li>Desenvolver arremesso de 3 pontos (meta: {Number(dados.atletaOuro.tres_ideal)}%)</li>
                        )}
                        {dados.mediaDadosFisicos.altura < Number(dados.atletaOuro.altura_ideal) && (
                          <li>Continuar desenvolvimento físico (altura ideal: {Number(dados.atletaOuro.altura_ideal).toFixed(2)}m)</li>
                        )}
                      </ul>
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
