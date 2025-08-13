import { relatorioRepository } from '../repositories/RepositoryRelatorio';
import { Relatorio, RelatorioCompleto, EstatisticasRelatorio } from '../entity/Relatorio';

export const relatorioService = {
    async gerarRelatorioCompleto(idAvaliacao: number): Promise<RelatorioCompleto> {
        const dadosCompletos = await relatorioRepository.getRelatorioCompleto(idAvaliacao);
        
        if (!dadosCompletos) {
            throw { type: 'Not Found', message: 'Avaliação não encontrada para gerar relatório' };
        }

        // Gerar nome do arquivo
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const nomeArquivo = `relatorio_${dadosCompletos.nome_atleta.replace(/\s/g, '_')}_${timestamp}.pdf`;

        // Criar dados do relatório
        const dadosRelatorio = {
            timestamp: new Date().toISOString(),
            versao: '1.0',
            tipo: 'PDF',
            nome_arquivo: nomeArquivo,
            dados_atleta: {
                nome: dadosCompletos.nome_atleta,
                email: dadosCompletos.email_atleta,
                idade: dadosCompletos.idade
            },
            dados_avaliacao: {
                data: dadosCompletos.data_avaliacao,
                nota_media: dadosCompletos.nota_media,
                dados_fisicos: {
                    altura: dadosCompletos.altura,
                    peso: dadosCompletos.peso
                },
                dados_tecnicos: {
                    tiro_livre: dadosCompletos.tiro_livre,
                    arremesso_tres: dadosCompletos.arremesso_tres,
                    arremesso_livre: dadosCompletos.arremesso_livre,
                    assistencias: dadosCompletos.assistencias
                }
            },
            dados_coach: {
                nome: dadosCompletos.nome_coach,
                email: dadosCompletos.email_coach
            }
        };

        // Salvar relatório no banco
        const relatorio: Omit<Relatorio, 'id_relatorio'> = {
            data: new Date(),
            id_avaliacao: idAvaliacao,
            dados_relatorio: dadosRelatorio
        };

        const idRelatorio = await relatorioRepository.create(relatorio);

        return {
            ...dadosCompletos,
            id_relatorio: idRelatorio,
            data: relatorio.data,
            dados_relatorio: dadosRelatorio
        };
    },

    async gerarRelatorioEstatisticas(idAtleta: number): Promise<any> {
        const estatisticas = await relatorioRepository.getEstatisticasAtleta(idAtleta);
        
        if (!estatisticas) {
            throw { type: 'Not Found', message: 'Nenhuma avaliação encontrada para este atleta' };
        }

        // Buscar dados básicos do atleta
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const nomeArquivo = `estatisticas_atleta_${idAtleta}_${timestamp}.pdf`;

        return {
            nome_arquivo: nomeArquivo,
            dados: {
                timestamp: new Date().toISOString(),
                id_atleta: idAtleta,
                estatisticas: estatisticas,
                formato: 'PDF'
            }
        };
    },

    async formatarParaPDF(dados: RelatorioCompleto): Promise<any> {
        return {
            relatorio: {
                id: dados.id_relatorio,
                data_geracao: dados.data,
                tipo: 'PDF',
                titulo: `Relatório de Avaliação - ${dados.nome_atleta}`
            },
            atleta: {
                nome: dados.nome_atleta,
                email: dados.email_atleta,
                idade: dados.idade
            },
            avaliacao: {
                id: dados.id_avaliacao,
                data: dados.data_avaliacao,
                nota_media: dados.nota_media,
                dados_fisicos: {
                    altura: `${dados.altura}m`,
                    peso: `${dados.peso}kg`
                },
                dados_tecnicos: {
                    tiro_livre: `${dados.tiro_livre}%`,
                    arremesso_tres: `${dados.arremesso_tres}%`,
                    arremesso_livre: `${dados.arremesso_livre}%`,
                    assistencias: `${dados.assistencias}%`
                }
            },
            coach: {
                nome: dados.nome_coach,
                email: dados.email_coach
            },
            instrucoes: "Este arquivo JSON contém os dados estruturados para geração de PDF. Utilize uma biblioteca como jsPDF ou similar para converter em PDF real."
        };
    },

    async getRelatorioById(id: number): Promise<Relatorio> {
        const relatorio = await relatorioRepository.getById(id);
        
        if (!relatorio) {
            throw { type: 'Not Found', message: 'Relatório não encontrado' };
        }

        return relatorio;
    },

    async getRelatoriosPorAtleta(idAtleta: number): Promise<Relatorio[]> {
        return await relatorioRepository.getRelatoriosPorAtleta(idAtleta);
    }
};
