# 🏀 Hoop Scout - Backend API

API REST robusta para sistema de avaliação e análise de performance de atletas de basquete, desenvolvida para a disciplina de Banco de Dados da UFJF.

## 📋 Visão Geral

O Hoop Scout Backend é uma API Node.js/TypeScript que oferece endpoints seguros e estruturados para:

- **Autenticação JWT**: Sistema de login seguro para técnicos e atletas
- **Gestão de Avaliações**: CRUD completo para dados físicos e técnicos
- **Análise Comparativa**: Algoritmos de comparação com atletas padrão-ouro
- **Relatórios PDF**: Geração automatizada de relatórios visuais
- **Categorização Inteligente**: Sistema automático de categorias por idade
- **Arquitetura Limpa**: Seguindo princípios SOLID e Clean Code

## ⚡ Tecnologias e Conceitos

- **Runtime**: Node.js 18+
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL com TypeORM
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: Joi para schemas
- **Segurança**: Bcrypt para hash de senhas
- **CORS**: Configurado para cross-origin
- **PDF**: jsPDF para geração de relatórios
- **Middleware**: Autenticação, validação e tratamento de erros

## 🏗️ Arquitetura

### Estrutura de Camadas
```
src/
├── controller/     # Controllers (HTTP handlers)
├── service/        # Lógica de negócio
├── repositories/   # Acesso a dados
├── entity/         # Entidades do banco
├── middlewares/    # Middlewares de auth e validação
├── routes/         # Definição de rotas
├── schemas/        # Schemas de validação
└── types/          # Tipos TypeScript
```

### Princípios Aplicados
- **SOLID**: Responsabilidade única, inversão de dependência
- **Clean Code**: Código limpo e bem documentado
- **Separation of Concerns**: Separação clara entre camadas
- **Error Handling**: Tratamento centralizado de erros

## 🚀 Principais Funcionalidades

### 🔐 Sistema de Autenticação
- **JWT Tokens**: Autenticação stateless
- **Bcrypt**: Hash seguro de senhas
- **Middlewares Específicos**: authCoachMiddleware, authAthleteMiddleware
- **Autorização**: Controle de acesso por tipo de usuário

### � Gestão de Avaliações
- **Dados Físicos**: Idade, altura, peso com validação
- **Dados Técnicos**: Métricas de performance em quadra
- **Categorização Automática**: Sub-15 (≤14 anos) e Sub-18 (15-18 anos)
- **Histórico Completo**: Acompanhamento temporal das avaliações

### 🎯 Atletas Padrão-Ouro
- **Configuração Flexível**: Definição de métricas ideais por categoria
- **Comparação Automática**: Algoritmos de análise comparativa
- **Base de Referência**: Dados para análises de performance

### 📈 Relatórios e Estatísticas
- **PDF Automatizado**: Geração de relatórios visuais
- **Consultas Otimizadas**: CTE e JOINs para performance
- **Dados Mais Recentes**: Queries que priorizam última avaliação
- **Histórico Completo**: Acesso a toda evolução do atleta

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/lucasmartinso/hoop-scout-back.git
   cd hoop-scout-back
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   ```bash
   # Configure o PostgreSQL e crie o banco
   # Execute o script sql/db.sql para criar as tabelas
   psql -U postgres -d hoop_scout -f sql/db.sql
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   # Copie o arquivo .env.example para .env
   cp .env.example .env
   
   # Configure as variáveis no arquivo .env:
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/hoop_scout
   JWT_SECRET=seu_jwt_secret_muito_seguro
   PORT=8083
   ```

5. **Execute a aplicação**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm run build
   npm start
   ```

## 🛣️ Rotas da API

### 👥 Usuários

```yml
POST /signup
    - Criação de conta na plataforma
    - Body: { "email": "email@domain.com", "name": "Nome", "password": "senha", "type": "coach|athlete" }
```

```yml 
POST /login
    - Autenticação de usuário
    - Body: { "email": "email@domain.com", "password": "senha" }
    - Response: { "token": "jwt_token", "user": {...} }
```

```yml
GET /user/profile (🔒 autenticado)
    - Informações do perfil do usuário
    - Headers: { "Authorization": "Bearer ${token}" }
```

```yml 
PUT /user/edit (🔒 autenticado)
    - Edição de perfil
    - Headers: { "Authorization": "Bearer ${token}" }
    - Body: { "email": "novo@email.com", "name": "Novo Nome" }
```

### 🧑‍🏫 Técnicos (Coach)

```yml
GET /all/athletes (🔒 coach)
    - Lista todos os atletas com dados mais recentes
    - Headers: { "Authorization": "Bearer ${token}" }
    - Response: Array de atletas com última avaliação
```

```yml 
GET /athlete/:id (🔒 coach)
    - Informações específicas de um atleta
    - Headers: { "Authorization": "Bearer ${token}" }
    - Params: id (number)
```

```yml 
POST /grade/:id (🔒 coach)
    - Avaliação de performance do atleta (LEGACY - usar rotas /avaliacao)
    - Headers: { "Authorization": "Bearer ${token}" }
    - Params: id (number)
    - Body: { dados físicos e técnicos }
```

### ⛹️ Atletas

```yml
GET /athlete (🔒 athlete)
    - Informações do atleta logado
    - Headers: { "Authorization": "Bearer ${token}" }
```

```yml
GET /probability (🔒 athlete)
    - Cálculo de probabilidade profissional
    - Headers: { "Authorization": "Bearer ${token}" }
```

```yml
GET /model (🔒 athlete)
    - Atleta modelo para comparação
    - Headers: { "Authorization": "Bearer ${token}" }
```

### 📊 Sistema de Avaliações

#### Dados Físicos
```yml
POST /avaliacao/dados-fisicos (🔒 coach)
    - Criação de dados físicos
    - Body: { "idade": number, "altura": number, "peso": number }
```

```yml
GET /avaliacao/dados-fisicos/:id (🔒 autenticado)
PUT /avaliacao/dados-fisicos/:id (🔒 coach)
DELETE /avaliacao/dados-fisicos/:id (🔒 coach)
```

#### Dados Técnicos
```yml
POST /avaliacao/dados-tecnicos (🔒 coach)
    - Criação de dados técnicos
    - Body: { "tiro_livre": number, "arremesso_tres": number, "arremesso_livre": number, "assistencias": number }
```

```yml
GET /avaliacao/dados-tecnicos/:id (🔒 autenticado)
PUT /avaliacao/dados-tecnicos/:id (🔒 coach)
DELETE /avaliacao/dados-tecnicos/:id (🔒 coach)
```

#### Atletas Padrão-Ouro
```yml
POST /avaliacao/atleta-ouro (🔒 coach)
    - Definição de atleta padrão-ouro
    - Body: { "idade_categoria": number, "peso_ideal": number, "altura_ideal": number, ... }
```

```yml
GET /avaliacao/atleta-ouro/idade/:idade (🔒 autenticado)
    - Busca atleta ouro por categoria de idade
    - Params: idade (number) - retorna categoria adequada (Sub-15 ou Sub-18)
```

#### Avaliações Completas
```yml
POST /avaliacao/avaliacao (🔒 coach)
    - Criação de avaliação completa
    - Body: { "id_atleta": number, "data": date, "id_dados_fisicos": number, "id_dados_tecnicos": number }
```

```yml
GET /avaliacao/avaliacao/atleta/:id_atleta (🔒 autenticado)
    - Todas as avaliações de um atleta
```

```yml
GET /avaliacao/avaliacao/historico/:id_atleta (🔒 autenticado)
    - Histórico detalhado de avaliações
```

### 📄 Relatórios

```yml
GET /relatorio/avaliacao/:idAvaliacao (🔒 autenticado)
    - Gerar relatório PDF de avaliação específica
    - Response: PDF Buffer
```

```yml
GET /relatorio/estatisticas/:idAtleta (🔒 autenticado)
    - Gerar relatório estatístico do atleta
    - Response: PDF Buffer
```

```yml
GET /relatorio/atleta/:idAtleta (🔒 autenticado)
    - Listar relatórios de um atleta
    - Response: Array de relatórios
```

## 🏗️ Estrutura do Banco de Dados

### Principais Entidades
- **User**: Usuários (técnicos e atletas)
- **Athlete**: Informações dos atletas
- **Coach**: Informações dos técnicos
- **Avaliacao**: Avaliações realizadas
- **DadosFisicos**: Dados físicos dos atletas
- **DadosTecnicos**: Dados técnicos dos atletas
- **AtletaOuro**: Padrões de referência por categoria
- **Relatorio**: Relatórios gerados

### Recursos Avançados
- **CTE (Common Table Expression)**: Para consultas otimizadas
- **LEFT JOINs**: Para dados mais recentes
- **Triggers**: Para cálculos automáticos
- **Indexes**: Para performance de consultas

## 🔧 Configurações e Validações

### Schemas de Validação (Joi)
- **userSchema**: Validação de criação de usuário
- **avaliacaoSchema**: Validação de avaliações
- **dadosFisicosSchema**: Validação de dados físicos
- **dadosTecnicosSchema**: Validação de dados técnicos

### Regras de Negócio
- **Idade Máxima**: 18 anos
- **Categorização**: Sub-15 (≤14) e Sub-18 (15-18)
- **Dados Obrigatórios**: Validação de campos essenciais
- **Permissões**: Técnicos podem criar/editar, atletas apenas visualizar

## 🛡️ Segurança

- **JWT**: Tokens seguros com expiração
- **Bcrypt**: Hash de senhas com salt
- **CORS**: Configurado para origens específicas
- **Validação**: Middleware de validação em todas as rotas
- **Error Handling**: Tratamento centralizado sem exposição de dados sensíveis

## 👥 Desenvolvedores

- **Lucas Martins Oliveira** - Arquitetura e Backend
- **Christian Rafael de Oliveira Coelho** - Integração e APIs
- **Caio Machado Bertelli** - Banco de Dados

## 📊 Deploy

**Render URL**: https://hoop-scout-api.onrender.com  
**Porta Local**: 8083  
**Frontend**: [hoop-scout](https://github.com/christianrafael21/hoopscout)

---
*API desenvolvida seguindo padrões REST e princípios de Clean Architecture*
    
```yml 
GET /athlete (autentify)
    - Route to acess personal info athlete
    - headers: { "Authorization": `Bearer ${token}` }
    - body:{}
```

```yml 
GET /probability (autentify)
    - Route to get probability to be professional
    - headers: {}
    - params: id: number
    - body: {}
```


## 🏁 Running the application locally

First, make the clone repository in your machine:

```
git clone https://github.com/lucasmartinso/hoop-scout-back.git
```

After, inside the folder, run the comand to install the dependencies.

```
npm install
```
Config the .env, .env.test and .env.development based on .env.example

To finish the process, to init the server
```
npm start or npm run dev
```

:stop_sign: Don't forget to repeat the sequence above with [repository-do-front](https://github.com/brenolino/hoop-scout) that contains the interface of aplication, to test the project per complet.
