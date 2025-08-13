"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ExportarRelatorioProps {
    idAvaliacao?: number;
    idAtleta?: number;
    tipoRelatorio: 'avaliacao' | 'estatisticas';
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export default function ExportarRelatorio({ 
    idAvaliacao, 
    idAtleta, 
    tipoRelatorio, 
    className = "",
    variant = "outline",
    size = "sm"
}: ExportarRelatorioProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        setIsExporting(true);

        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            let url = '';
            if (tipoRelatorio === 'avaliacao' && idAvaliacao) {
                url = `http://localhost:8083/relatorio/avaliacao/${idAvaliacao}`;
            } else if (tipoRelatorio === 'estatisticas' && idAtleta) {
                url = `http://localhost:8083/relatorio/estatisticas/${idAtleta}`;
            } else {
                throw new Error('Parâmetros inválidos para exportação');
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                let errorMessage = 'Erro ao gerar relatório';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = `Erro ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            // Baixar como PDF real
            const pdfBlob = await response.blob();
            const url_download = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url_download;
            
            // Extrair nome do arquivo do header ou criar um padrão
            const contentDisposition = response.headers.get('Content-Disposition');
            let fileName = `relatorio_${tipoRelatorio}_${Date.now()}.pdf`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                if (fileNameMatch) {
                    fileName = fileNameMatch[1];
                }
            }
            
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url_download);

            // Mostrar mensagem de sucesso
            alert(`Relatório PDF gerado e baixado com sucesso!`);

        } catch (error: unknown) {
            console.error('Erro ao exportar relatório:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            alert(`Erro ao gerar relatório: ${errorMessage}`);
        } finally {
            setIsExporting(false);
        }
    };

    const getButtonText = () => {
        if (isExporting) {
            return 'Gerando PDF...';
        }
        return tipoRelatorio === 'avaliacao' ? 'Exportar Avaliação PDF' : 'Exportar Estatísticas PDF';
    };

    return (
        <Button 
            variant={variant} 
            size={size} 
            className={`${className} ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isExporting}
            onClick={handleExportPDF}
        >
            <FileText className="h-4 w-4 mr-2 text-red-500" />
            {getButtonText()}
        </Button>
    );
}
