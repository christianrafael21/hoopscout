import { NovaAvaliacaoClient } from './nova-avaliacao-client';

export default async function NovaAvaliacaoPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  
  return (
    <NovaAvaliacaoClient atletaId={resolvedParams.id} />
  );
}
