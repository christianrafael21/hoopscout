import postgres from '../database/postgres';
import { Relatorio, RelatorioCompleto, EstatisticasRelatorio } from '../entity/Relatorio';

export const relatorioRepository = {
    async create(relatorio: Omit<Relatorio, 'id_relatorio'>): Promise<number> {
        const query = `
            INSERT INTO relatorio (data, id_avaliacao, dados_relatorio)
            VALUES ($1, $2, $3)
            RETURNING id_relatorio
        `;
        
        const result = await postgres.query(query, [
            relatorio.data,
            relatorio.id_avaliacao,
            JSON.stringify(relatorio.dados_relatorio)
        ]);
        
        return result.rows[0].id_relatorio;
    },

    async getRelatorioCompleto(idAvaliacao: number): Promise<RelatorioCompleto | null> {
        const query = `
            SELECT 
                av.id_avaliacao,
                av.data as data_avaliacao,
                COALESCE(r.nota_media, 0) as nota_media,
                
                -- Dados do atleta
                u_atleta.primeiro_nome || ' ' || u_atleta.ultimo_nome as nome_atleta,
                u_atleta.email as email_atleta,
                
                -- Dados físicos
                df.idade,
                df.altura,
                df.peso,
                
                -- Dados técnicos
                dt.tiro_livre,
                dt.arremesso_tres,
                dt.arremesso_livre,
                dt.assistencias,
                
                -- Dados do coach
                u_coach.primeiro_nome || ' ' || u_coach.ultimo_nome as nome_coach,
                u_coach.email as email_coach
                
            FROM avaliacao av
            INNER JOIN atleta_avaliacao aa ON av.id_avaliacao = aa.id_avaliacao
            INNER JOIN usuarios u_atleta ON aa.id_atleta = u_atleta.id_usuario
            INNER JOIN coach_avaliacao ca ON av.id_avaliacao = ca.id_avaliacao
            INNER JOIN usuarios u_coach ON ca.id_coach = u_coach.id_usuario
            LEFT JOIN dados_fisicos df ON av.id_dados_fisicos = df.id_dados_fisicos
            LEFT JOIN dados_tecnicos dt ON av.id_dados_tecnicos = dt.id_dados_tecnicos
            LEFT JOIN resultado r ON av.id_avaliacao = r.id_avaliacao
            WHERE av.id_avaliacao = $1
        `;
        
        const result = await postgres.query(query, [idAvaliacao]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        return {
            id_relatorio: 0, // Será definido ao criar o relatório
            data: new Date(),
            id_avaliacao: row.id_avaliacao,
            dados_relatorio: {},
            nome_atleta: row.nome_atleta,
            email_atleta: row.email_atleta,
            idade: row.idade || 0,
            data_avaliacao: row.data_avaliacao,
            nota_media: parseFloat(row.nota_media) || 0,
            altura: parseFloat(row.altura) || 0,
            peso: parseFloat(row.peso) || 0,
            tiro_livre: row.tiro_livre || 0,
            arremesso_tres: row.arremesso_tres || 0,
            arremesso_livre: row.arremesso_livre || 0,
            assistencias: row.assistencias || 0,
            nome_coach: row.nome_coach,
            email_coach: row.email_coach
        };
    },

    async getEstatisticasAtleta(idAtleta: number): Promise<EstatisticasRelatorio | null> {
        const query = `
            SELECT 
                COUNT(*) as total_avaliacoes,
                AVG(COALESCE(r.nota_media, 0)) as media_nota_geral,
                AVG(df.altura) as media_altura,
                AVG(df.peso) as media_peso,
                AVG(dt.tiro_livre) as media_tiro_livre,
                AVG(dt.arremesso_tres) as media_arremesso_tres,
                AVG(dt.arremesso_livre) as media_arremesso_livre,
                AVG(dt.assistencias) as media_assistencias,
                MIN(av.data) as primeira_avaliacao,
                MAX(av.data) as ultima_avaliacao
            FROM avaliacao av
            INNER JOIN atleta_avaliacao aa ON av.id_avaliacao = aa.id_avaliacao
            LEFT JOIN dados_fisicos df ON av.id_dados_fisicos = df.id_dados_fisicos
            LEFT JOIN dados_tecnicos dt ON av.id_dados_tecnicos = dt.id_dados_tecnicos
            LEFT JOIN resultado r ON av.id_avaliacao = r.id_avaliacao
            WHERE aa.id_atleta = $1
        `;
        
        const result = await postgres.query(query, [idAtleta]);
        
        if (result.rows.length === 0 || result.rows[0].total_avaliacoes === '0') {
            return null;
        }
        
        const row = result.rows[0];
        
        // Calcular melhoria na nota (última vs primeira avaliação)
        const melhoriaQuery = `
            WITH avaliacoes_ordenadas AS (
                SELECT 
                    COALESCE(r.nota_media, 0) as nota_media,
                    av.data,
                    ROW_NUMBER() OVER (ORDER BY av.data ASC) as primeira,
                    ROW_NUMBER() OVER (ORDER BY av.data DESC) as ultima
                FROM avaliacao av
                INNER JOIN atleta_avaliacao aa ON av.id_avaliacao = aa.id_avaliacao
                LEFT JOIN resultado r ON av.id_avaliacao = r.id_avaliacao
                WHERE aa.id_atleta = $1 AND r.nota_media IS NOT NULL
            ),
            primeira_ultima AS (
                SELECT 
                    MAX(CASE WHEN primeira = 1 THEN nota_media END) as primeira_nota,
                    MAX(CASE WHEN ultima = 1 THEN nota_media END) as ultima_nota
                FROM avaliacoes_ordenadas
            )
            SELECT primeira_nota, ultima_nota FROM primeira_ultima
        `;
        
        const melhoriaResult = await postgres.query(melhoriaQuery, [idAtleta]);
        let melhoria_nota = 0;
        let melhoria_percentual = 0;
        
        if (melhoriaResult.rows.length > 0) {
            const { primeira_nota, ultima_nota } = melhoriaResult.rows[0];
            if (primeira_nota && ultima_nota) {
                melhoria_nota = ultima_nota - primeira_nota;
                melhoria_percentual = primeira_nota > 0 ? (melhoria_nota / primeira_nota) * 100 : 0;
            }
        }
        
        return {
            total_avaliacoes: parseInt(row.total_avaliacoes),
            media_nota_geral: parseFloat(row.media_nota_geral) || 0,
            media_dados_fisicos: {
                altura: parseFloat(row.media_altura) || 0,
                peso: parseFloat(row.media_peso) || 0
            },
            media_dados_tecnicos: {
                tiro_livre: parseFloat(row.media_tiro_livre) || 0,
                arremesso_tres: parseFloat(row.media_arremesso_tres) || 0,
                arremesso_livre: parseFloat(row.media_arremesso_livre) || 0,
                assistencias: parseFloat(row.media_assistencias) || 0
            },
            evolucao: {
                primeira_avaliacao: row.primeira_avaliacao,
                ultima_avaliacao: row.ultima_avaliacao,
                melhoria_nota,
                melhoria_percentual
            }
        };
    },

    async getById(id: number): Promise<Relatorio | null> {
        const query = `
            SELECT id_relatorio, data, id_avaliacao, dados_relatorio
            FROM relatorio 
            WHERE id_relatorio = $1
        `;
        
        const result = await postgres.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        return {
            id_relatorio: row.id_relatorio,
            data: row.data,
            id_avaliacao: row.id_avaliacao,
            dados_relatorio: JSON.parse(row.dados_relatorio)
        };
    },

    async getRelatoriosPorAtleta(idAtleta: number): Promise<Relatorio[]> {
        const query = `
            SELECT r.id_relatorio, r.data, r.id_avaliacao, r.dados_relatorio
            FROM relatorio r
            INNER JOIN avaliacao av ON r.id_avaliacao = av.id_avaliacao
            INNER JOIN atleta_avaliacao aa ON av.id_avaliacao = aa.id_avaliacao
            WHERE aa.id_atleta = $1
            ORDER BY r.data DESC
        `;
        
        const result = await postgres.query(query, [idAtleta]);
        
        return result.rows.map(row => ({
            id_relatorio: row.id_relatorio,
            data: row.data,
            id_avaliacao: row.id_avaliacao,
            dados_relatorio: JSON.parse(row.dados_relatorio)
        }));
    }
};
