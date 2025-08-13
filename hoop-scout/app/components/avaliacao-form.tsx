"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AvaliacaoFormState } from '../types/avaliacao';

const avaliacaoSchema = z.object({
  dadosFisicos: z.object({
    idade: z.number().min(0).max(18).describe("Idade deve estar entre 0 e 18 anos"),
    altura: z.number().min(1.0).max(2.5).describe("Altura deve estar entre 1.0m e 2.5m"),
    peso: z.number().min(30).max(150).describe("Peso deve estar entre 30kg e 150kg"),
  }),
  dadosTecnicos: z.object({
    tiro_livre: z.number().min(0).max(100),
    arremesso_tres: z.number().min(0).max(100),
    arremesso_livre: z.number().min(0).max(100),
    assistencias: z.number().min(0).max(100),
  }),
  id_atleta_ouro: z.number().optional(),
});

interface AvaliacaoFormProps {
  initialData?: AvaliacaoFormState;
  onSubmit: (data: AvaliacaoFormState) => void;
  isSubmitting?: boolean;
}

export function AvaliacaoForm({ initialData, onSubmit, isSubmitting }: AvaliacaoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AvaliacaoFormState>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: initialData || {
      dadosFisicos: {
        idade: 0,
        altura: 0,
        peso: 0,
      },
      dadosTecnicos: {
        tiro_livre: 0,
        arremesso_tres: 0,
        arremesso_livre: 0,
        assistencias: 0,
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dados Físicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="idade" className="text-sm font-medium">
              Idade (até 18 anos)
            </label>
            <div>
              <Input
                id="idade"
                type="number"
                placeholder="Ex: 16"
                {...register('dadosFisicos.idade', { valueAsNumber: true })}
              />
              {errors.dadosFisicos?.idade?.message && (
                <span className="text-sm text-red-500">{errors.dadosFisicos.idade.message}</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="altura" className="text-sm font-medium">
              Altura (metros, ex: 1.80)
            </label>
            <Input
              id="altura"
              type="number"
              step="0.01"
              placeholder="Ex: 1.80"
              {...register('dadosFisicos.altura', { valueAsNumber: true })}
              error={errors.dadosFisicos?.altura?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="peso" className="text-sm font-medium">
              Peso (kg, entre 30 e 150)
            </label>
            <Input
              id="peso"
              type="number"
              step="0.01"
              placeholder="Ex: 75.5"
              {...register('dadosFisicos.peso', { valueAsNumber: true })}
              error={errors.dadosFisicos?.peso?.message}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dados Técnicos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="tiro_livre" className="text-sm font-medium">
              Tiro Livre (%)
            </label>
            <Input
              id="tiro_livre"
              type="number"
              step="0.1"
              {...register('dadosTecnicos.tiro_livre', { valueAsNumber: true })}
              error={errors.dadosTecnicos?.tiro_livre?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="arremesso_tres" className="text-sm font-medium">
              Arremesso de 3 (%)
            </label>
            <Input
              id="arremesso_tres"
              type="number"
              step="0.1"
              {...register('dadosTecnicos.arremesso_tres', { valueAsNumber: true })}
              error={errors.dadosTecnicos?.arremesso_tres?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="arremesso_livre" className="text-sm font-medium">
              Arremesso Livre (%)
            </label>
            <Input
              id="arremesso_livre"
              type="number"
              step="0.1"
              {...register('dadosTecnicos.arremesso_livre', { valueAsNumber: true })}
              error={errors.dadosTecnicos?.arremesso_livre?.message}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="assistencias" className="text-sm font-medium">
              Assistências
            </label>
            <Input
              id="assistencias"
              type="number"
              step="1"
              {...register('dadosTecnicos.assistencias', { valueAsNumber: true })}
              error={errors.dadosTecnicos?.assistencias?.message}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end ">
        <Button type="submit" className='bg-green-500 hover:bg-green-600 text-white' disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
        </Button>
      </div>
    </form>
  );
}
