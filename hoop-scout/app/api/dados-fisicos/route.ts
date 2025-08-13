import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const data = await request.json();
    const token = cookieStore.get('jwtToken')?.value;

    console.log('Dados físicos sendo enviados:', data);

    const response = await fetch(`${API_URL}/dados-fisicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Falha ao criar dados físicos: ${errorData.message || JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao criar dados físicos:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao criar dados físicos' }), 
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'ID dos dados físicos é obrigatório' }), 
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/dados-fisicos/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar dados físicos');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar dados físicos:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao buscar dados físicos' }), 
      { status: 500 }
    );
  }
}
