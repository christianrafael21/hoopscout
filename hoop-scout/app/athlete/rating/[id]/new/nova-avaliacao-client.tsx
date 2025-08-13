'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AvaliacaoForm } from '@/app/components/avaliacao-form';
import { createAvaliacao } from '@/app/services/avaliacao.service';
import { AvaliacaoFormState } from '@/app/types/avaliacao';

interface NovaAvaliacaoClientProps {
  atletaId: string;
}

export function NovaAvaliacaoClient({ atletaId }: NovaAvaliacaoClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AvaliacaoFormState) => {
    try {
      setIsSubmitting(true);

      // Primeiro, criamos os dados físicos e técnicos
      console.log('Enviando dados físicos:', data.dadosFisicos);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const dadosFisicosResponse = await fetch('/api/avaliacao/dados-fisicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data.dadosFisicos),
      });

      console.log('Enviando dados técnicos:', data.dadosTecnicos);
      const dadosTecnicosResponse = await fetch('/api/avaliacao/dados-tecnicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data.dadosTecnicos),
      });

      if (!dadosFisicosResponse.ok || !dadosTecnicosResponse.ok) {
        throw new Error('Falha ao criar dados físicos ou técnicos');
      }

      const dadosFisicos = await dadosFisicosResponse.json();
      const dadosTecnicos = await dadosTecnicosResponse.json();

      console.log('Resposta dados físicos:', dadosFisicos);
      console.log('Resposta dados técnicos:', dadosTecnicos);

      if (!dadosFisicos.id_dados_fisicos || !dadosTecnicos.id_dados_tecnicos) {
        throw new Error(`IDs não retornados corretamente: 
          Físicos: ${JSON.stringify(dadosFisicos)}
          Técnicos: ${JSON.stringify(dadosTecnicos)}`);
      }

      // Agora criamos a avaliação com os IDs dos dados criados
      console.log('ID do atleta da URL:', atletaId);
      const id_atleta = parseInt(atletaId);
      console.log('ID do atleta convertido:', id_atleta);

      const avaliacaoData = {
        id_dados_fisicos: dadosFisicos.id_dados_fisicos,
        id_dados_tecnicos: dadosTecnicos.id_dados_tecnicos,
        id_atleta: id_atleta
      };

      console.log('Criando avaliação com:', avaliacaoData);
      await createAvaliacao(parseInt(atletaId), avaliacaoData);

      // Redireciona para a página de avaliações do atleta
      router.push(`/athlete/rating/${atletaId}`);
      router.refresh();
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      alert('Erro ao criar avaliação: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nova Avaliação</h1>
      </div>
      <AvaliacaoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
