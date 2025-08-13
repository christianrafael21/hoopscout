import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const data = await request.json();

    const response = await fetch(`${API_URL}/atleta-ouro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Falha ao criar atleta ouro');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao criar atleta ouro:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao criar atleta ouro' }), 
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const { searchParams } = new URL(request.url);
    const idade = searchParams.get('idade');

    if (!idade) {
      return new NextResponse(
        JSON.stringify({ error: 'Idade da categoria é obrigatória' }), 
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/atleta-ouro/${idade}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar atleta ouro');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao buscar atleta ouro:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Erro ao buscar atleta ouro' }), 
      { status: 500 }
    );
  }
}
