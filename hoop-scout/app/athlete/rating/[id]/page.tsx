"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NavbarLogged } from "../../../components/navbar-logged"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Footer from "../../../components/footer"
import { User } from "@/app/models/User.model"
import { useParams } from "next/navigation"

interface AthleteData {
  name?: string;
  height?: string;
  weight?: string;
  age?: number;
  assistsGame?: number;
  longShot?: string;
  shortShot?: string;
  freeThrow?: string;
}

export default function AthleteRatingPage() {
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          alert('Token não encontrado');
          return;
        }

        const response = await fetch(`http://localhost:8083/athlete/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAthleteData(data);

          // Preenche os campos se houver dados
          if (data) {
            const altura = document.querySelector('input[placeholder="Altura (m)"]') as HTMLInputElement;
            const peso = document.querySelector('input[placeholder="Peso (kg)"]') as HTMLInputElement;
            const idade = document.querySelector('input[placeholder="Idade"]') as HTMLInputElement;
            const assists = document.querySelector('input[placeholder="Assistências por Jogo"]') as HTMLInputElement;
            const threePointPercentage = document.querySelector('input[placeholder="Aproveitamento de Arremessos 3 pontos(%)"]') as HTMLInputElement;
            const twoPointPercentage = document.querySelector('input[placeholder="Aproveitamento de Arremessos 2 Pontos (%)"]') as HTMLInputElement;
            const freeThrowPercentage = document.querySelector('input[placeholder="Aproveitamento de Lances Livres (%)"]') as HTMLInputElement;

            if (data.height) altura.value = data.height;
            if (data.weight) peso.value = data.weight;
            if (data.age) idade.value = data.age.toString();
            if (data.assistsGame) assists.value = data.assistsGame.toString();
            if (data.longShot) threePointPercentage.value = data.longShot;
            if (data.shortShot) twoPointPercentage.value = data.shortShot;
            if (data.freeThrow) freeThrowPercentage.value = data.freeThrow;
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do atleta:', error);
      }
    };

    fetchAthleteData();
  }, [id]);
  
  async function salvarDados() {
    const altura = document.querySelector('input[placeholder="Altura (m)"]') as HTMLInputElement;
    const peso = document.querySelector('input[placeholder="Peso (kg)"]') as HTMLInputElement;
    const idade = document.querySelector('input[placeholder="Idade"]') as HTMLInputElement;
    const assists = document.querySelector('input[placeholder="Assistências por Jogo"]') as HTMLInputElement;
    const threePointPercentage = document.querySelector('input[placeholder="Aproveitamento de Arremessos 3 pontos(%)"]') as HTMLInputElement;
    const twoPointPercentage = document.querySelector('input[placeholder="Aproveitamento de Arremessos 2 Pontos (%)"]') as HTMLInputElement;
    const freeThrowPercentage = document.querySelector('input[placeholder="Aproveitamento de Lances Livres (%)"]') as HTMLInputElement;

    const userString = localStorage.getItem('user');
    const user: User = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('jwtToken')

    if (!user) {
      alert('Usuário não encontrado');
      return;
    }

    const response = await fetch('http://localhost:8083/grade/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        height: altura.value,
        weight: peso.value,
        age: idade.value,
        assistsGame: assists.value,
        longShot: threePointPercentage.value,
        shortShot: twoPointPercentage.value,
        freeThrow: freeThrowPercentage.value
      })
    });

    if (response.ok) {
      alert('Atleta salvo com sucesso!');
      window.location.href = '/dashboard';
    } else {
      alert('Erro ao salvar atleta');
    }

  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />

      <main className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Avaliação</h2>
            <h1 className="text-3xl font-bold">{athleteData.name || 'Carregando...'}</h1>
            <p className="text-gray-500">Avalie este atleta</p>
          </div>



          {/* Physical Attributes Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Atributos Físicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Altura (ex: 1.80m)" type="string" className="h-12" />
              <Input placeholder="Peso (ex: 75kg)" type="string" className="h-12" />
              <Input placeholder="Idade (até 18 anos)" type="number" className="h-12" />
            </div>
          </div>

          {/* Game Statistics Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Estatísticas de Jogo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Assistências por Jogo (ex: 5)" type="number" className="h-12" />
              <Input placeholder="Aproveitamento 3 pontos (ex: 40%)" type="string" className="h-12" />
              <Input placeholder="Aproveitamento 2 Pontos (ex: 60%)" type="string" className="h-12" />
              <Input placeholder="Lance Livre (ex: 80%)" type="string" className="h-12" />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 px-8" onClick={salvarDados}>Salvar Atleta</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

