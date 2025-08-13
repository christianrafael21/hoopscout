// Tipos de usuário
export enum UserType {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  ATLETA = 'ATLETA'
}

export interface User {
  id_usuario: number;
  tipo: UserType;
  email: string;
  primeiro_nome: string;
  ultimo_nome: string;
  id_categoria?: number;
}

// Dados físicos e técnicos
export interface DadosFisicos {
  id_dados_fisicos: number;
  idade: number;
  altura: number;
  peso: number;
}

export interface DadosTecnicos {
  id_dados_tecnicos: number;
  tiro_livre: number;
  arremesso_tres: number;
  arremesso_livre: number;
  assistencias: number;
}

// Atleta ouro (valores ideais/referência)
export interface AtletaOuro {
  id_atleta_ouro: number;
  idade_categoria: number;
  peso_ideal: number;
  altura_ideal: number;
  tiro_ideal: number;
  assistencia_ideal: number;
  livre_ideal: number;
  tres_ideal: number;
}

// Avaliação completa
export interface Avaliacao {
  id_avaliacao: number;
  data: string; // formato ISO
  id_atleta_ouro?: number;
  id_dados_fisicos: number;
  id_dados_tecnicos: number;
  nota_media?: number;
  dados_fisicos?: DadosFisicos;
  dados_tecnicos?: DadosTecnicos;
  atleta_ouro?: AtletaOuro;
}

// Histórico de avaliações
export interface HistoricoAvaliacao {
  id_historico: number;
  data: string; // formato ISO
}

// Estado da avaliação atual (para o formulário)
export interface AvaliacaoFormState {
  dadosFisicos: {
    idade: number;
    altura: number;
    peso: number;
  };
  dadosTecnicos: {
    tiro_livre: number;
    arremesso_tres: number;
    arremesso_livre: number;
    assistencias: number;
  };
  id_atleta_ouro?: number;
}

// Requisições de API
export interface CreateAvaliacaoRequest {
  id_dados_fisicos: number;
  id_dados_tecnicos: number;
  id_atleta_ouro?: number;
}

export interface UpdateAvaliacaoRequest {
  id_dados_fisicos?: number;
  id_dados_tecnicos?: number;
  id_atleta_ouro?: number;
}
