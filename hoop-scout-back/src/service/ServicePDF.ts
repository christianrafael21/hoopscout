import jsPDF from 'jspdf';
import { RelatorioCompleto, EstatisticasRelatorio } from '../entity/Relatorio';

export class PDFService {
    static gerarPDFAvaliacao(dados: RelatorioCompleto): Buffer {
        const doc = new jsPDF();
        
        // Configurações
        const margin = 20;
        let yPosition = margin;
        const lineHeight = 8;
        const titleSize = 16;
        const headerSize = 14;
        const textSize = 12;

        // Função auxiliar para adicionar texto
        const addText = (text: string, size: number = textSize, isBold: boolean = false) => {
            doc.setFontSize(size);
            if (isBold) {
                doc.setFont(undefined, 'bold');
            } else {
                doc.setFont(undefined, 'normal');
            }
            doc.text(text, margin, yPosition);
            yPosition += lineHeight;
        };

        // Função auxiliar para adicionar linha
        const addLine = () => {
            yPosition += lineHeight / 2;
            doc.line(margin, yPosition, 190, yPosition);
            yPosition += lineHeight;
        };

        // Título
        addText('RELATÓRIO DE AVALIAÇÃO DE ATLETA', titleSize, true);
        yPosition += 5;
        addLine();

        // Data de geração
        addText(`Data de Geração: ${new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, textSize);
        yPosition += 5;

        // Dados do Atleta
        addText('DADOS DO ATLETA', headerSize, true);
        addText(`Nome: ${dados.nome_atleta}`);
        addText(`Email: ${dados.email_atleta}`);
        addText(`Idade: ${dados.idade} anos`);
        yPosition += 5;

        // Dados da Avaliação
        addText('DADOS DA AVALIAÇÃO', headerSize, true);
        addText(`ID da Avaliação: ${dados.id_avaliacao}`);
        addText(`Data da Avaliação: ${new Date(dados.data_avaliacao).toLocaleDateString('pt-BR')}`);
        addText(`Nota Média: ${dados.nota_media.toFixed(2)}/10`);
        yPosition += 5;

        // Dados Físicos
        addText('DADOS FÍSICOS', headerSize, true);
        addText(`Altura: ${dados.altura}m`);
        addText(`Peso: ${dados.peso}kg`);
        yPosition += 5;

        // Dados Técnicos
        addText('DADOS TÉCNICOS', headerSize, true);
        addText(`Tiro Livre: ${dados.tiro_livre}%`);
        addText(`Arremesso de 3 pontos: ${dados.arremesso_tres}%`);
        addText(`Arremesso Livre: ${dados.arremesso_livre}%`);
        addText(`Assistências: ${dados.assistencias}%`);
        yPosition += 5;

        // Dados do Coach
        addText('AVALIADOR', headerSize, true);
        addText(`Nome: ${dados.nome_coach}`);
        addText(`Email: ${dados.email_coach}`);
        yPosition += 10;

        // Rodapé
        addLine();
        addText('Sistema HoopScout - Relatório gerado automaticamente', 10);
        addText(`ID do Relatório: ${dados.id_relatorio}`, 10);

        // Retornar como Buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        return pdfBuffer;
    }

    static gerarPDFEstatisticas(dados: { id_atleta: number, nome_atleta?: string, estatisticas: EstatisticasRelatorio }): Buffer {
        const doc = new jsPDF();
        
        // Configurações
        const margin = 20;
        let yPosition = margin;
        const lineHeight = 8;
        const titleSize = 16;
        const headerSize = 14;
        const textSize = 12;

        // Função auxiliar para adicionar texto
        const addText = (text: string, size: number = textSize, isBold: boolean = false) => {
            doc.setFontSize(size);
            if (isBold) {
                doc.setFont(undefined, 'bold');
            } else {
                doc.setFont(undefined, 'normal');
            }
            doc.text(text, margin, yPosition);
            yPosition += lineHeight;
        };

        // Função auxiliar para adicionar linha
        const addLine = () => {
            yPosition += lineHeight / 2;
            doc.line(margin, yPosition, 190, yPosition);
            yPosition += lineHeight;
        };

        // Título
        addText('RELATÓRIO ESTATÍSTICO DO ATLETA', titleSize, true);
        yPosition += 5;
        addLine();

        // Data de geração
        addText(`Data de Geração: ${new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, textSize);
        yPosition += 5;

        // Dados do Atleta
        addText('ATLETA', headerSize, true);
        addText(`ID: ${dados.id_atleta}`);
        if (dados.nome_atleta) {
            addText(`Nome: ${dados.nome_atleta}`);
        }
        yPosition += 5;

        // Resumo Geral
        addText('RESUMO GERAL', headerSize, true);
        addText(`Total de Avaliações: ${dados.estatisticas.total_avaliacoes}`);
        addText(`Nota Média Geral: ${dados.estatisticas.media_nota_geral.toFixed(2)}/10`);
        yPosition += 5;

        // Médias - Dados Físicos
        addText('MÉDIAS - DADOS FÍSICOS', headerSize, true);
        addText(`Altura Média: ${dados.estatisticas.media_dados_fisicos.altura.toFixed(2)}m`);
        addText(`Peso Médio: ${dados.estatisticas.media_dados_fisicos.peso.toFixed(2)}kg`);
        yPosition += 5;

        // Médias - Dados Técnicos
        addText('MÉDIAS - DADOS TÉCNICOS', headerSize, true);
        addText(`Tiro Livre: ${dados.estatisticas.media_dados_tecnicos.tiro_livre.toFixed(1)}%`);
        addText(`Arremesso de 3 pontos: ${dados.estatisticas.media_dados_tecnicos.arremesso_tres.toFixed(1)}%`);
        addText(`Arremesso Livre: ${dados.estatisticas.media_dados_tecnicos.arremesso_livre.toFixed(1)}%`);
        addText(`Assistências: ${dados.estatisticas.media_dados_tecnicos.assistencias.toFixed(1)}%`);
        yPosition += 5;

        // Evolução
        addText('EVOLUÇÃO', headerSize, true);
        addText(`Primeira Avaliação: ${new Date(dados.estatisticas.evolucao.primeira_avaliacao).toLocaleDateString('pt-BR')}`);
        addText(`Última Avaliação: ${new Date(dados.estatisticas.evolucao.ultima_avaliacao).toLocaleDateString('pt-BR')}`);
        addText(`Melhoria na Nota: ${dados.estatisticas.evolucao.melhoria_nota > 0 ? '+' : ''}${dados.estatisticas.evolucao.melhoria_nota.toFixed(2)} pontos`);
        addText(`Percentual de Melhoria: ${dados.estatisticas.evolucao.melhoria_percentual > 0 ? '+' : ''}${dados.estatisticas.evolucao.melhoria_percentual.toFixed(1)}%`);
        yPosition += 10;

        // Rodapé
        addLine();
        addText('Sistema HoopScout - Relatório Estatístico gerado automaticamente', 10);

        // Retornar como Buffer
        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        return pdfBuffer;
    }
}
