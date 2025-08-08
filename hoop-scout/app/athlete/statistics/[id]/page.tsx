"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowUp, ChevronLeft, FileDown } from "lucide-react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Link from "next/link"
import { NavbarLogged } from "@/app/components/navbar-logged"
import { Footer } from "@/components/footer"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { User } from "@/app/models/User.model"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ChartDataItem {
  attribute: string,
  Valor?: number,
  Atleta?: number,
  Modelo?: number
}

export default function AthleteStatisticsPage() {
  const [athleteData, setAthleteData] = useState<ChartDataItem[]>([]);
  const [modelData, setModelData] = useState<ChartDataItem[]>([]);
  const [comparisonData, setComparisonData] = useState<ChartDataItem[]>([]);
  const params = useParams();
  const { id } = params;
  const pdfRef = useRef(null);

  const generatePdf = async () => {

    console.warn(pdfRef)
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2 }); // Captura o conteúdo em alta qualidade
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Relatorio.pdf");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  function percentageFormatter(percentage: string): number{
    return Number(percentage.slice(0, -1));
  }

  function heightFormatter(height: string): number{
    height = height.slice(0, -1);
    height = height.replace(",", ".");
    return parseFloat(height);
  }

  function weightFormatter(mass: string): number{
    return Number(mass.slice(0, -2))
  }

// Puxa os dados e formata para api de graficos
  const getData = async () => {
    const userString = localStorage.getItem('user');
    let user: User;
    if(userString){
      user = JSON.parse(userString);
      if(user.role === 'coach'){
        var athleteResponse = await fetch('http://localhost:8083/athlete/' + id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
      }
      else{
        var athleteResponse = await fetch('http://localhost:8083/athlete', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
      }


      const modelResponse = await fetch('http://localhost:8083/model', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      try {
        var athleteData = await athleteResponse.json();
        var modelData = await modelResponse.json();
      } catch (error) {
        alert("Erro ao obter dados");
        console.error(error);
      }
      //const athleteData = await athleteResponse.json();
      //const modelData = await modelResponse.json();

      if(athleteData.age){
        const auxModelData: ChartDataItem[] = [
          { attribute: "Idade", Valor: modelData.age },
          { attribute: "Altura", Valor: heightFormatter(modelData.height) },
          { attribute: "Peso", Valor: weightFormatter(modelData.weight) },
          { attribute: "Aproveitamento de Arremessos", Valor: percentageFormatter(modelData.shortShot) },
          { attribute: "Aproveitamento de 3 Pontos", Valor: percentageFormatter(modelData.longShot) },
          { attribute: "Aproveitamento de Lances Livres", Valor: percentageFormatter(modelData.freeThrow)},
        ];
        const auxAthleteData: ChartDataItem[] = [
          { attribute: "Idade", Valor: athleteData.age },
          { attribute: "Altura", Valor: heightFormatter(athleteData.height) },
          { attribute: "Peso", Valor: weightFormatter(athleteData.weight) },
          { attribute: "Aproveitamento de Arremessos", Valor:  percentageFormatter(athleteData.shortShot) },
          { attribute: "Aproveitamento de 3 Pontos", Valor:  percentageFormatter(athleteData.longShot) },
          { attribute: "Aproveitamento de Lances Livres", Valor: percentageFormatter(athleteData.freeThrow)},
        ];
        const auxComparisonData: ChartDataItem[] = [
          { attribute: "Idade", Atleta: athleteData.age, Modelo: modelData.age},
          { attribute: "Altura", Atleta: heightFormatter(athleteData.height), Modelo: heightFormatter(modelData.height) },
          { attribute: "Peso", Atleta: weightFormatter(athleteData.weight), Modelo: weightFormatter(modelData.weight) },
          { attribute: "Aproveitamento de Arremessos", Atleta: percentageFormatter(athleteData.shortShot), Modelo: percentageFormatter(modelData.shortShot) },
          { attribute: "Aproveitamento de 3 Pontos", Atleta: percentageFormatter(athleteData.longShot), Modelo: percentageFormatter(modelData.longShot) },
          { attribute: "Aproveitamento de Lances Livres", Atleta: percentageFormatter(athleteData.freeThrow), Modelo: percentageFormatter(modelData.freeThrow) },
        ];
    
        setModelData(auxModelData);
        setAthleteData(auxAthleteData);
        setComparisonData(auxComparisonData);
      }
      else{
        alert("Atleta ainda não avaliado!")
      }
    }
    else{
      alert("Necessário fazer login novamente");
      localStorage.clear();
      window.location.href = '/'
    }

  }

  useEffect(() => {
    getData();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />

      <main className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg p-6">
          {/* Cartões de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Pontos Hoje</p>
                  <h3 className="text-2xl font-bold mt-1">25</h3>
                </div>
                <ArrowUp className="text-green-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Assistências Hoje</p>
                  <h3 className="text-2xl font-bold mt-1">7</h3>
                </div>
                <ArrowUp className="text-green-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Rebotes por Jogo</p>
                  <h3 className="text-2xl font-bold mt-1">8.5</h3>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">% Arremessos</p>
                  <h3 className="text-2xl font-bold mt-1">48.2%</h3>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Avaliação Geral</p>
                  <h3 className="text-2xl font-bold mt-1">6.4</h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Seção de Gráficos */}
          <div ref={pdfRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Atributos Médios do Atleta */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">ATRIBUTOS MÉDIOS</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={athleteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attribute" hide/>
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Valor" fill="#1a75ff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico de Comparação entre os Atributos */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">COMPARAÇÃO DE ATRIBUTOS</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attribute" hide/>
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Atleta" fill="#1a75ff" />
                  <Bar dataKey="Modelo" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Atributos do Atleta Modelo */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">ATLETA MODELO</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attribute" hide/>
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Valor" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <Button variant="destructive" onClick={generatePdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
