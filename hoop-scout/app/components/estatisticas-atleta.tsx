"use client"

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getAvaliacoes } from '@/app/services/avaliacao.service';
import { Avaliacao } from '@/app/types/avaliacao';

interface EstatisticasData {
  avaliacoes: Avaliacao[];
  mediaDadosFisicos: {
    idade: number;
    altura: number;
    peso: number;
  };
  mediaDadosTecnicos: {
    tiro_livre: number;
    arremesso_tres: number;
    arremesso_livre: number;
    assistencias: number;
  };
  mediaNotas: number;
  evolucao: {
    fisico: {
      altura: { valor: number; percentual: number };
      peso: { valor: number; percentual: number };
    };
    tecnico: {
      tiro_livre: { valor: number; percentual: number };
      arremesso_tres: { valor: number; percentual: number };
      arremesso_livre: { valor: number; percentual: number };
      assistencias: { valor: number; percentual: number };
    };
    nota: { valor: number; percentual: number };
  };
}

async function getEstatisticasAtleta(idAtleta: number): Promise<EstatisticasData> {
  const avaliacoes = await getAvaliacoes(idAtleta);

  if (avaliacoes.length === 0) {
    return {
      avaliacoes: [],
      mediaDadosFisicos: { idade: 0, altura: 0, peso: 0 },
      mediaDadosTecnicos: {
        tiro_livre: 0,
        arremesso_tres: 0,
        arremesso_livre: 0,
        assistencias: 0,
      },
      mediaNotas: 0,
      evolucao: {
        fisico: {
          altura: { valor: 0, percentual: 0 },
          peso: { valor: 0, percentual: 0 }
        },
        tecnico: {
          tiro_livre: { valor: 0, percentual: 0 },
          arremesso_tres: { valor: 0, percentual: 0 },
          arremesso_livre: { valor: 0, percentual: 0 },
          assistencias: { valor: 0, percentual: 0 }
        },
        nota: { valor: 0, percentual: 0 }
      }
    };
  }

  // Calcular médias dos dados físicos
  const mediaDadosFisicos = {
    idade: avaliacoes.reduce((acc, av) => acc + (av.dados_fisicos?.idade || 0), 0) / avaliacoes.length,
    altura: avaliacoes.reduce((acc, av) => acc + (av.dados_fisicos?.altura || 0), 0) / avaliacoes.length,
    peso: avaliacoes.reduce((acc, av) => acc + (av.dados_fisicos?.peso || 0), 0) / avaliacoes.length,
  };

  // Calcular médias dos dados técnicos
  const mediaDadosTecnicos = {
    tiro_livre: avaliacoes.reduce((acc, av) => acc + (av.dados_tecnicos?.tiro_livre || 0), 0) / avaliacoes.length,
    arremesso_tres: avaliacoes.reduce((acc, av) => acc + (av.dados_tecnicos?.arremesso_tres || 0), 0) / avaliacoes.length,
    arremesso_livre: avaliacoes.reduce((acc, av) => acc + (av.dados_tecnicos?.arremesso_livre || 0), 0) / avaliacoes.length,
    assistencias: avaliacoes.reduce((acc, av) => acc + (av.dados_tecnicos?.assistencias || 0), 0) / avaliacoes.length,
  };

  // Calcular média das notas
  const mediaNotas = avaliacoes.reduce((acc, av) => acc + (av.nota_media || 0), 0) / avaliacoes.length;

  // Calcular evolução
  if (avaliacoes.length < 2) {
    return {
      avaliacoes,
      mediaDadosFisicos,
      mediaDadosTecnicos,
      mediaNotas,
      evolucao: {
        fisico: {
          altura: { valor: 0, percentual: 0 },
          peso: { valor: 0, percentual: 0 }
        },
        tecnico: {
          tiro_livre: { valor: 0, percentual: 0 },
          arremesso_tres: { valor: 0, percentual: 0 },
          arremesso_livre: { valor: 0, percentual: 0 },
          assistencias: { valor: 0, percentual: 0 }
        },
        nota: { valor: 0, percentual: 0 }
      }
    };
  }

  const primeiraAvaliacao = avaliacoes[avaliacoes.length - 1];
  const ultimaAvaliacao = avaliacoes[0];

  const evolucao = {
    fisico: {
      altura: {
        valor: ultimaAvaliacao.dados_fisicos.altura - primeiraAvaliacao.dados_fisicos.altura,
        percentual: ((ultimaAvaliacao.dados_fisicos.altura - primeiraAvaliacao.dados_fisicos.altura) / primeiraAvaliacao.dados_fisicos.altura) * 100
      },
      peso: {
        valor: ultimaAvaliacao.dados_fisicos.peso - primeiraAvaliacao.dados_fisicos.peso,
        percentual: ((ultimaAvaliacao.dados_fisicos.peso - primeiraAvaliacao.dados_fisicos.peso) / primeiraAvaliacao.dados_fisicos.peso) * 100
      }
    },
    tecnico: {
      tiro_livre: {
        valor: ultimaAvaliacao.dados_tecnicos.tiro_livre - primeiraAvaliacao.dados_tecnicos.tiro_livre,
        percentual: ((ultimaAvaliacao.dados_tecnicos.tiro_livre - primeiraAvaliacao.dados_tecnicos.tiro_livre) / primeiraAvaliacao.dados_tecnicos.tiro_livre) * 100
      },
      arremesso_tres: {
        valor: ultimaAvaliacao.dados_tecnicos.arremesso_tres - primeiraAvaliacao.dados_tecnicos.arremesso_tres,
        percentual: ((ultimaAvaliacao.dados_tecnicos.arremesso_tres - primeiraAvaliacao.dados_tecnicos.arremesso_tres) / primeiraAvaliacao.dados_tecnicos.arremesso_tres) * 100
      },
      arremesso_livre: {
        valor: ultimaAvaliacao.dados_tecnicos.arremesso_livre - primeiraAvaliacao.dados_tecnicos.arremesso_livre,
        percentual: ((ultimaAvaliacao.dados_tecnicos.arremesso_livre - primeiraAvaliacao.dados_tecnicos.arremesso_livre) / primeiraAvaliacao.dados_tecnicos.arremesso_livre) * 100
      },
      assistencias: {
        valor: ultimaAvaliacao.dados_tecnicos.assistencias - primeiraAvaliacao.dados_tecnicos.assistencias,
        percentual: ((ultimaAvaliacao.dados_tecnicos.assistencias - primeiraAvaliacao.dados_tecnicos.assistencias) / primeiraAvaliacao.dados_tecnicos.assistencias) * 100
      }
    },
    nota: {
      valor: ultimaAvaliacao.nota_media - primeiraAvaliacao.nota_media,
      percentual: ((ultimaAvaliacao.nota_media - primeiraAvaliacao.nota_media) / primeiraAvaliacao.nota_media) * 100
    }
  };

  return {
    avaliacoes,
    mediaDadosFisicos,
    mediaDadosTecnicos,
    mediaNotas,
    evolucao
  };
}

export function EstatisticasAtleta({ idAtleta }: { idAtleta: number }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasData | null>(null);

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
    return <div className="text-center py-8">Carregando estatísticas...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!estatisticas) {
    return <div className="text-center py-8">Nenhuma estatística encontrada.</div>;
  }

  return (
    <div className="space-y-8">
      {estatisticas.avaliacoes.length === 0 ? (
        <div className="text-center py-8">
          Este atleta ainda não possui avaliações.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dados Físicos */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Dados Físicos</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Idade Média</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosFisicos.idade.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Altura Média</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosFisicos.altura.toFixed(1)}cm
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Peso Médio</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosFisicos.peso.toFixed(1)}kg
                </div>
              </div>
            </div>
          </Card>

          {/* Dados Técnicos */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Dados Técnicos</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Tiro Livre</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosTecnicos.tiro_livre.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Arremesso de 3</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosTecnicos.arremesso_tres.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Arremesso Livre</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosTecnicos.arremesso_livre.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Assistências</div>
                <div className="text-2xl font-semibold">
                  {estatisticas.mediaDadosTecnicos.assistencias.toFixed(1)}
                </div>
              </div>
            </div>
          </Card>

          {/* Nota Média */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Nota Média</h2>
            <div className="text-4xl font-bold">
              {estatisticas.mediaNotas.toFixed(1)}
            </div>
          </Card>

          {/* Evolução */}
          <Card className="p-6 md:col-span-2 lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-4">Evolução</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Evolução Física */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Dados Físicos</h3>
                {renderEvolucao(
                  'Altura',
                  estatisticas.evolucao.fisico.altura.valor,
                  estatisticas.evolucao.fisico.altura.percentual,
                  'cm'
                )}
                {renderEvolucao(
                  'Peso',
                  estatisticas.evolucao.fisico.peso.valor,
                  estatisticas.evolucao.fisico.peso.percentual,
                  'kg'
                )}
              </div>

              {/* Evolução Técnica */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Dados Técnicos</h3>
                {renderEvolucao(
                  'Tiro Livre',
                  estatisticas.evolucao.tecnico.tiro_livre.valor,
                  estatisticas.evolucao.tecnico.tiro_livre.percentual,
                  '%'
                )}
                {renderEvolucao(
                  'Arremesso de 3',
                  estatisticas.evolucao.tecnico.arremesso_tres.valor,
                  estatisticas.evolucao.tecnico.arremesso_tres.percentual,
                  '%'
                )}
                {renderEvolucao(
                  'Arremesso Livre',
                  estatisticas.evolucao.tecnico.arremesso_livre.valor,
                  estatisticas.evolucao.tecnico.arremesso_livre.percentual,
                  '%'
                )}
                {renderEvolucao(
                  'Assistências',
                  estatisticas.evolucao.tecnico.assistencias.valor,
                  estatisticas.evolucao.tecnico.assistencias.percentual,
                  ''
                )}
              </div>

              {/* Evolução Nota */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Nota Geral</h3>
                {renderEvolucao(
                  'Nota',
                  estatisticas.evolucao.nota.valor,
                  estatisticas.evolucao.nota.percentual,
                  ''
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function renderEvolucao(label: string, valor: number, percentual: number, unidade: string) {
  const isPositive = percentual > 0;
  const color = isPositive ? 'text-green-500' : percentual < 0 ? 'text-red-500' : 'text-gray-500';
  const signal = isPositive ? '+' : '';

  return (
    <div className="mb-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>
        {signal}{valor.toFixed(1)}{unidade} ({signal}{percentual.toFixed(1)}%)
      </div>
    </div>
  );
}
