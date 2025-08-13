import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('jwtToken')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Token de autenticação não encontrado' },
        { status: 401 }
      );
    }

    console.log('Dados técnicos sendo enviados:', data);

    const response = await fetch(`${API_URL}/avaliacao/dados-tecnicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro do backend:', errorData);
      throw new Error(`Falha ao criar dados técnicos: ${errorData}`);
    }

    const result = await response.json();
    console.log('Resposta do backend (dados técnicos):', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao criar dados técnicos:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
