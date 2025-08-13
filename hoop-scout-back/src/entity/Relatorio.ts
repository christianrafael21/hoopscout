export interface Relatorio {
    id_relatorio: number;
    data: Date;
    id_avaliacao: number;
    dados_relatorio: any; // JSON com os dados do relatório
}

export interface RelatorioCompleto extends Relatorio {
    // Dados do atleta
    nome_atleta: string;
    email_atleta: string;
    idade: number;
    
    // Dados da avaliação
    data_avaliacao: Date;
    nota_media: number;
    
    // Dados físicos
    altura: number;
    peso: number;
    
    // Dados técnicos
    tiro_livre: number;
    arremesso_tres: number;
    arremesso_livre: number;
    assistencias: number;
    
    // Dados do coach avaliador
    nome_coach: string;
    email_coach: string;
}

export interface EstatisticasRelatorio {
    total_avaliacoes: number;
    media_nota_geral: number;
    media_dados_fisicos: {
        altura: number;
        peso: number;
    };
    media_dados_tecnicos: {
        tiro_livre: number;
        arremesso_tres: number;
        arremesso_livre: number;
        assistencias: number;
    };
    evolucao: {
        primeira_avaliacao: Date;
        ultima_avaliacao: Date;
        melhoria_nota: number;
        melhoria_percentual: number;
    };
}
