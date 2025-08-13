import { useState } from 'react';
import { NavbarLogged } from "@/app/components/navbar-logged";
import Footer from "@/app/components/footer";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AtletaOuro {
  idade_categoria: number;
  peso_ideal: number;
  altura_ideal: number;
  tiro_ideal: number;
  assistencia_ideal: number;
  livre_ideal: number;
  tres_ideal: number;
}

export default function AtletaOuroPage() {
  const [loading, setLoading] = useState(false);
  const [atletaOuro, setAtletaOuro] = useState<AtletaOuro>({
    idade_categoria: 0,
    peso_ideal: 0,
    altura_ideal: 0,
    tiro_ideal: 0,
    assistencia_ideal: 0,
    livre_ideal: 0,
    tres_ideal: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/atleta-ouro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(atletaOuro),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar atleta ouro');
      }

      alert('Atleta ouro salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar atleta ouro:', error);
      alert('Erro ao salvar atleta ouro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AtletaOuro) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAtletaOuro((prev) => ({
      ...prev,
      [field]: Number(e.target.value),
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <NavbarLogged />
      <main className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Atleta Ouro
          </h1>
          <p className="text-gray-400">
            Configure os valores ideais para cada categoria
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categoria</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="idade_categoria" className="text-sm font-medium">
                    Idade da Categoria
                  </label>
                  <Input
                    id="idade_categoria"
                    type="number"
                    required
                    min={0}
                    max={18}
                    value={atletaOuro.idade_categoria}
                    onChange={handleChange('idade_categoria')}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Dados Físicos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dados Físicos Ideais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="altura_ideal" className="text-sm font-medium">
                    Altura (cm)
                  </label>
                  <Input
                    id="altura_ideal"
                    type="number"
                    required
                    step="0.01"
                    value={atletaOuro.altura_ideal}
                    onChange={handleChange('altura_ideal')}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="peso_ideal" className="text-sm font-medium">
                    Peso (kg)
                  </label>
                  <Input
                    id="peso_ideal"
                    type="number"
                    required
                    step="0.01"
                    value={atletaOuro.peso_ideal}
                    onChange={handleChange('peso_ideal')}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Dados Técnicos */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dados Técnicos Ideais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tiro_ideal" className="text-sm font-medium">
                    Tiro Livre (%)
                  </label>
                  <Input
                    id="tiro_ideal"
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={atletaOuro.tiro_ideal}
                    onChange={handleChange('tiro_ideal')}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tres_ideal" className="text-sm font-medium">
                    Arremesso de 3 (%)
                  </label>
                  <Input
                    id="tres_ideal"
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={atletaOuro.tres_ideal}
                    onChange={handleChange('tres_ideal')}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="livre_ideal" className="text-sm font-medium">
                    Arremesso Livre (%)
                  </label>
                  <Input
                    id="livre_ideal"
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={atletaOuro.livre_ideal}
                    onChange={handleChange('livre_ideal')}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="assistencia_ideal" className="text-sm font-medium">
                    Assistências
                  </label>
                  <Input
                    id="assistencia_ideal"
                    type="number"
                    required
                    min={0}
                    value={atletaOuro.assistencia_ideal}
                    onChange={handleChange('assistencia_ideal')}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Valores Ideais'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
