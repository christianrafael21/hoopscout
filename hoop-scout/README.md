# 🏀 Hoop Scout - Frontend

Uma plataforma moderna para avaliação e análise de performance de atletas de basquete, desenvolvida como trabalho prático para a disciplina de Banco de Dados da UFJF.

## 📋 Visão Geral

O Hoop Scout Frontend é uma aplicação React/Next.js que oferece uma interface intuitiva para técnicos e atletas acompanharem o desenvolvimento esportivo através de:

- **Dashboard Interativo**: Visualização consolidada de atletas e suas métricas
- **Sistema de Avaliações**: Registro detalhado de dados físicos e técnicos
- **Análise Comparativa**: Gráficos de comparação com atletas padrão-ouro
- **Relatórios Visuais**: Charts e estatísticas de evolução
- **Gestão de Perfis**: Controle de usuários técnicos e atletas

## ⚡ Tecnologias

- **Framework**: Next.js 15 com React 19
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts (RadarChart, BarChart)
- **Componentes**: Radix UI
- **Validação**: Zod + React Hook Form
- **Geração PDF**: jsPDF + html2canvas
- **Ícones**: Lucide React

## 🚀 Funcionalidades Principais

### 📊 Dashboard de Técnicos
- Listagem de atletas com expansão de detalhes
- Gráficos radar para visualização de habilidades
- Acesso rápido às funcionalidades de avaliação
- Estatísticas resumidas de performance

### 📈 Sistema de Avaliação
- **Dados Físicos**: Idade, altura, peso
- **Dados Técnicos**: Tiro livre, arremesso de 3, arremesso livre, assistências
- **Validação de Idade**: Limite máximo de 18 anos
- **Categorização Automática**: Sub-15 (≤14 anos) e Sub-18 (15-18 anos)

### 📊 Análise Comparativa
- **Gráfico Radar**: Comparação de habilidades técnicas
- **Gráfico de Barras**: Comparação de dados físicos
- **Percentual de Atingimento**: Cálculo automático vs. padrão ouro
- **Recomendações**: Sugestões de melhoria baseadas na categoria

### 📈 Estatísticas e Relatórios
- **Evolução Temporal**: Acompanhamento da progressão do atleta
- **Dados Mais Recentes**: Exibição da última avaliação para idade, altura e peso
- **Médias Técnicas**: Cálculo de médias das habilidades técnicas
- **Exportação PDF**: Geração de relatórios visuais

### 🎯 Gestão de Atletas Padrão-Ouro
- Interface para definição de métricas ideais por categoria
- Parâmetros físicos e técnicos de referência
- Base para análises comparativas

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Backend da aplicação rodando

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/christianrafael21/hoopscout.git
   cd hoop-scout
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Crie um arquivo .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8083
   ```

4. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
app/
├── components/           # Componentes reutilizáveis
│   ├── avaliacao-form.tsx
│   ├── comparacao-atleta-ouro.tsx
│   ├── estatisticas-atleta-cliente.tsx
│   └── ...
├── athlete/             # Páginas específicas de atletas
│   ├── statistics/[id]/ # Estatísticas do atleta
│   ├── rating/[id]/     # Avaliações do atleta
│   └── comparison/[id]/ # Comparação com padrão ouro
├── dashboard/           # Dashboard principal
├── api/                 # API routes (proxy para backend)
└── types/              # Definições de tipos TypeScript
```

## 🎨 Principais Componentes

### ComparacaoAtletaOuro
- Componente principal para análise comparativa
- Gráficos interativos (Radar + Barras)
- Cálculos de percentual de atingimento
- Recomendações personalizadas

### EstatisticasAtletaCliente
- Exibição de evolução temporal
- Dados físicos mais recentes
- Métricas técnicas médias

### AvaliacaoForm
- Formulário de avaliação com validação
- Integração com Zod para validação de dados
- Submissão para APIs de dados físicos e técnicos

## 🔧 Configurações Importantes

### Categorização de Idades
- **Sub-15**: Atletas com 14 anos ou menos
- **Sub-18**: Atletas entre 15 e 18 anos
- **Limite**: Idade máxima de 18 anos

### APIs Integradas
- `/api/avaliacao/dados-fisicos` - Dados físicos
- `/api/avaliacao/dados-tecnicos` - Dados técnicos  
- `/api/atleta-ouro` - Atletas padrão-ouro

## 👥 Desenvolvedores

- **Christian Rafael de Oliveira Coelho**
- **Caio Machado Bertelli**
- **Lucas Martins Oliveira**
- **Breno Lino Prado**
- **Gabriel Campos Lima Alves**
- **Vitor Leal**

## 📄 Licença

Projeto acadêmico desenvolvido para a disciplina de Banco de Dados da UFJF.

---
**Frontend URL**: http://localhost:3000  
**Backend Repository**: [hoop-scout-back](https://github.com/lucasmartinso/hoop-scout-back)
