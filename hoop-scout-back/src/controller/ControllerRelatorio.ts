import { Request, Response } from 'express';
import { relatorioService } from '../service/ServiceRelatorio';
import { PDFService } from '../service/ServicePDF';

export const relatorioController = {
    // Gerar relatório PDF de uma avaliação específica
    async gerarRelatorioAvaliacao(req: Request, res: Response): Promise<void> {
        try {
            const { idAvaliacao } = req.params;

            const relatorio = await relatorioService.gerarRelatorioCompleto(parseInt(idAvaliacao));

            // Gerar PDF real
            const pdfBuffer = PDFService.gerarPDFAvaliacao(relatorio);
            
            // Configurar headers para download de PDF
            const nomeArquivo = `relatorio_avaliacao_${relatorio.nome_atleta.replace(/\s/g, '_')}_${Date.now()}.pdf`;
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            
            // Enviar o PDF
            res.send(pdfBuffer);

        } catch (error: any) {
            if (error.type === 'Not Found') {
                res.status(404).json({ error: error.message });
            } else {
                console.error('Erro ao gerar relatório:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    },

    // Gerar relatório PDF estatístico de um atleta
    async gerarRelatorioEstatisticas(req: Request, res: Response): Promise<void> {
        try {
            const { idAtleta } = req.params;

            const estatisticas = await relatorioService.gerarRelatorioEstatisticas(parseInt(idAtleta));

            // Gerar PDF real
            const pdfBuffer = PDFService.gerarPDFEstatisticas({
                id_atleta: parseInt(idAtleta),
                estatisticas: estatisticas.dados.estatisticas
            });
            
            // Configurar headers para download de PDF
            const nomeArquivo = `estatisticas_atleta_${idAtleta}_${Date.now()}.pdf`;
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            
            // Enviar o PDF
            res.send(pdfBuffer);

        } catch (error: any) {
            if (error.type === 'Not Found') {
                res.status(404).json({ error: error.message });
            } else {
                console.error('Erro ao gerar relatório de estatísticas:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    },

    // Listar relatórios de um atleta
    async listarRelatoriosAtleta(req: Request, res: Response): Promise<void> {
        try {
            const { idAtleta } = req.params;

            const relatorios = await relatorioService.getRelatoriosPorAtleta(parseInt(idAtleta));

            res.json({
                success: true,
                data: relatorios,
                total: relatorios.length
            });

        } catch (error: any) {
            console.error('Erro ao listar relatórios:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    // Obter relatório por ID
    async obterRelatorio(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const relatorio = await relatorioService.getRelatorioById(parseInt(id));

            res.json({
                success: true,
                data: relatorio
            });

        } catch (error: any) {
            if (error.type === 'Not Found') {
                res.status(404).json({ error: error.message });
            } else {
                console.error('Erro ao obter relatório:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }
};
