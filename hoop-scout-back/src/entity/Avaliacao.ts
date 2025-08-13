import { AvaliacaoView, HistoricoAvaliacaoView } from "../types/avaliacaoTypes";

export class HistoricoAvaliacao implements HistoricoAvaliacaoView {
  id_historico: number;
  data: Date;
}

export class Avaliacao implements AvaliacaoView {
  id_avaliacao: number;
  data: Date;
  id_atleta_ouro?: number;  // opcional
  id_dados_fisicos: number;
  id_dados_tecnicos: number;
  
  // Campos calculados (não estão no banco)
  nota_media?: number;
  dados_fisicos?: {
    idade: number;
    altura: number;
    peso: number;
  };
  dados_tecnicos?: {
    tiro_livre: number;
    arremesso_tres: number;
    arremesso_livre: number;
    assistencias: number;
  };
  atleta_ouro?: {
    peso_ideal: number;
    altura_ideal: number;
    tiro_ideal: number;
    assistencia_ideal: number;
    livre_ideal: number;
    tres_ideal: number;
  };
}
