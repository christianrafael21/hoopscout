export interface DadosFisicosView {
    idade: number;
    altura: number;
    peso: number;
}

export interface DadosTecnicosView {
    tiro_livre: number;
    arremesso_tres: number;
    arremesso_livre: number;
    assistencias: number;
}

export interface AtletaOuroView {
    peso_ideal: number;
    altura_ideal: number;
    tiro_ideal: number;
    assistencia_ideal: number;
    livre_ideal: number;
    tres_ideal: number;
}

export interface AvaliacaoView {
    id_avaliacao: number;
    data: Date;
    id_atleta_ouro?: number;
    id_dados_fisicos: number;
    id_dados_tecnicos: number;
    nota_media?: number;
    dados_fisicos?: DadosFisicosView;
    dados_tecnicos?: DadosTecnicosView;
    atleta_ouro?: AtletaOuroView;
}

export interface HistoricoAvaliacaoView {
    id_historico: number;
    data: Date;
}
