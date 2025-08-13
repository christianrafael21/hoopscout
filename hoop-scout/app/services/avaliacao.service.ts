import { Avaliacao, CreateAvaliacaoRequest, UpdateAvaliacaoRequest } from '../types/avaliacao';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

export async function getAvaliacoes(idAtleta: number): Promise<Avaliacao[]> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/avaliacao/avaliacao/atleta/${idAtleta}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Falha ao buscar avaliações');
  }
  
  return response.json();
}

export async function getAvaliacao(idAtleta: number, idAvaliacao: number): Promise<Avaliacao> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/avaliacao/avaliacao/${idAvaliacao}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Falha ao buscar avaliação');
  }
  
  return response.json();
}

export async function createAvaliacao(idAtleta: number, data: CreateAvaliacaoRequest): Promise<Avaliacao> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const bodyData = { ...data, id_atleta: idAtleta };
  if (!data.id_dados_fisicos || !data.id_dados_tecnicos) {
    throw new Error('ID dos dados físicos e técnicos são obrigatórios');
  }

  console.log('Enviando dados para criar avaliação:', bodyData);
  
  // Criar um objeto com apenas os campos necessários
  const payload = {
    id_dados_fisicos: data.id_dados_fisicos,
    id_dados_tecnicos: data.id_dados_tecnicos,
    id_atleta: idAtleta // Enviar o ID do atleta explicitamente
  };

  console.log('Payload da avaliação:', payload);

  const response = await fetch(`${API_URL}/avaliacao/avaliacao`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro do backend ao criar avaliação:', errorText);
    if (errorText.includes('<!DOCTYPE html>')) {
      throw new Error('Erro de comunicação com o servidor. Por favor, tente novamente.');
    }
    throw new Error(`Falha ao criar avaliação: ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Resposta da criação de avaliação:', result);
  return result;
}

export async function updateAvaliacao(
  idAtleta: number, 
  idAvaliacao: number, 
  data: UpdateAvaliacaoRequest
): Promise<Avaliacao> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/avaliacao/avaliacao/${idAvaliacao}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ ...data, id_atleta: idAtleta }),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao atualizar avaliação');
  }
  
  return response.json();
}

export async function deleteAvaliacao(idAtleta: number, idAvaliacao: number): Promise<void> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/avaliacao/avaliacao/${idAvaliacao}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Falha ao deletar avaliação');
  }
}

// Busca o histórico de uma avaliação específica
export async function getHistoricoAvaliacao(idAtleta: number, idAvaliacao: number): Promise<Avaliacao[]> {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/avaliacao/historico/${idAtleta}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Falha ao buscar histórico da avaliação');
  }
  
  return response.json();
}
