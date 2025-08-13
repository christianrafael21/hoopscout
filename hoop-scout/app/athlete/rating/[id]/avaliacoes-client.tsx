'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avaliacao } from '@/app/types/avaliacao';

interface AvaliacoesClientProps {
  atletaId: string;
}

export function AvaliacoesClient({ atletaId }: AvaliacoesClientProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvaliacoes() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Usuário não autenticado');
          return;
        }

        const response = await fetch(`http://localhost:8083/avaliacao/avaliacao/atleta/${atletaId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar avaliações');
        }

        const data = await response.json();
        setAvaliacoes(data);
      } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchAvaliacoes();
  }, [atletaId]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-white">Carregando avaliações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-center text-red-500">
          Erro ao carregar avaliações: {error}
        </p>
      </Card>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Avaliações</h1>
        <Link href={`/athlete/rating/${atletaId}/new`}>
          <Button className='bg-blue-500 hover:bg-blue-600 text-white'>Nova Avaliação</Button>
        </Link>
      </div>

      {avaliacoes.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-black">
            Nenhuma avaliação encontrada para este atleta.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {avaliacoes.map((avaliacao) => (
            <Card key={avaliacao.id_avaliacao} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">
                    Avaliação {avaliacao.id_avaliacao}
                  </h3>
                  <p className="text-sm text-black">
                    {formatarData(avaliacao.data)}
                  </p>
                </div>
                {avaliacao.nota_media && (
                  <div className="bg-blue-300 text-black px-2 py-1 rounded">
                    Nota: {avaliacao.nota_media.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {avaliacao.dados_fisicos && (
                  <div>
                    <h4 className="font-medium mb-2">Dados Físicos</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-black">Idade</p>
                        <p className="text-gray-800">{avaliacao.dados_fisicos.idade} anos</p>
                      </div>
                      <div>
                        <p className="text-black">Altura</p>
                        <p className="text-gray-800">{avaliacao.dados_fisicos.altura} cm</p>
                      </div>
                      <div>
                        <p className="text-black">Peso</p>
                        <p className="text-gray-800">{avaliacao.dados_fisicos.peso} kg</p>
                      </div>
                    </div>
                  </div>
                )}

                {avaliacao.dados_tecnicos && (
                  <div>
                    <h4 className="font-medium mb-2">Dados Técnicos</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-black">Tiro Livre</p>
                        <p className="text-gray-800">{avaliacao.dados_tecnicos.tiro_livre}%</p>
                      </div>
                      <div>
                        <p className="text-black">Arremesso 3</p>
                        <p className="text-gray-800">{avaliacao.dados_tecnicos.arremesso_tres}%</p>
                      </div>
                      <div>
                        <p className="text-black">Arremesso Livre</p>
                        <p className="text-gray-800">{avaliacao.dados_tecnicos.arremesso_livre}%</p>
                      </div>
                      <div>
                        <p className="text-black">Assistências</p>
                        <p className="text-gray-800">{avaliacao.dados_tecnicos.assistencias}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="mt-4">
                <Link href={`/athlete/rating/${atletaId}/${avaliacao.id_avaliacao}`}>
                  <Button variant="outline" className="w-full">
                    Ver Detalhes
                  </Button>
                </Link>
              </div> */}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
