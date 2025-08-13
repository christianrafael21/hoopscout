import { QueryResult } from "pg";
import { Avaliacao, HistoricoAvaliacao } from "../entity/Avaliacao";
import connection from "../database/postgres";

export async function create(dados: Omit<Avaliacao, 'id_avaliacao' | 'nota_media' | 'dados_fisicos' | 'dados_tecnicos' | 'atleta_ouro'>): Promise<number> {
    const { rows } = await connection.query<{ id_avaliacao: number }>(`
        INSERT INTO avaliacao (data, id_atleta_ouro, id_dados_fisicos, id_dados_tecnicos)
        VALUES (NOW(), $1, $2, $3)
        RETURNING id_avaliacao
    `, [dados.id_atleta_ouro, dados.id_dados_fisicos, dados.id_dados_tecnicos]);

    return rows[0].id_avaliacao;
}

export async function createHistorico(data: Date): Promise<number> {
    const { rows } = await connection.query<{ id_historico: number }>(`
        INSERT INTO historico_avaliacoes (data)
        VALUES ($1)
        RETURNING id_historico
    `, [data]);

    return rows[0].id_historico;
}

export async function vincularHistorico(id_avaliacao: number, id_historico: number): Promise<void> {
    await connection.query(`
        INSERT INTO avaliacao_historico (id_avaliacao, id_historico)
        VALUES ($1, $2)
    `, [id_avaliacao, id_historico]);
}

export async function vincularCoach(id_avaliacao: number, id_coach: number): Promise<void> {
    await connection.query(`
        INSERT INTO coach_avaliacao (id_coach, id_avaliacao)
        VALUES ($1, $2)
    `, [id_coach, id_avaliacao]);
}

export async function vincularAtleta(id_avaliacao: number, id_atleta: number): Promise<void> {
    await connection.query(`
        INSERT INTO atleta_avaliacao (id_atleta, id_avaliacao)
        VALUES ($1, $2)
    `, [id_atleta, id_avaliacao]);
}

export async function getById(id: number): Promise<Avaliacao | null> {
    const { rows }: QueryResult<Avaliacao> = await connection.query(`
        SELECT * FROM avaliacao
        WHERE id_avaliacao = $1
    `, [id]);

    return rows[0] || null;
}

export async function getByAtleta(id_atleta: number): Promise<Avaliacao[]> {
    const { rows }: QueryResult<Avaliacao> = await connection.query(`
        SELECT a.* FROM avaliacao a
        INNER JOIN atleta_avaliacao aa ON a.id_avaliacao = aa.id_avaliacao
        WHERE aa.id_atleta = $1
        ORDER BY a.data DESC
    `, [id_atleta]);

    return rows;
}

export async function getHistoricoByAtleta(id_atleta: number): Promise<HistoricoAvaliacao[]> {
    const { rows }: QueryResult<HistoricoAvaliacao> = await connection.query(`
        SELECT h.* FROM historico_avaliacoes h
        INNER JOIN avaliacao_historico ah ON h.id_historico = ah.id_historico
        INNER JOIN avaliacao a ON ah.id_avaliacao = a.id_avaliacao
        INNER JOIN atleta_avaliacao aa ON a.id_avaliacao = aa.id_avaliacao
        WHERE aa.id_atleta = $1
        ORDER BY h.data DESC
    `, [id_atleta]);

    return rows;
}

export async function verificarPermissaoCoach(id_avaliacao: number, id_coach: number): Promise<boolean> {
    const { rows } = await connection.query(`
        SELECT 1 FROM coach_avaliacao
        WHERE id_avaliacao = $1 AND id_coach = $2
    `, [id_avaliacao, id_coach]);

    return rows.length > 0;
}

export async function update(id: number, dados: Partial<Omit<Avaliacao, 'id_avaliacao' | 'nota_media' | 'dados_fisicos' | 'dados_tecnicos' | 'atleta_ouro'>>): Promise<void> {
    const updateFields = [];
    const params: any[] = [];

    if (dados.data !== undefined) {
        updateFields.push(`data = $${params.length + 1}`);
        params.push(dados.data instanceof Date ? dados.data : new Date(dados.data));
    }

    if (dados.id_atleta_ouro !== undefined) {
        updateFields.push(`id_atleta_ouro = $${params.length + 1}`);
        params.push(dados.id_atleta_ouro);
    }

    if (dados.id_dados_fisicos !== undefined) {
        updateFields.push(`id_dados_fisicos = $${params.length + 1}`);
        params.push(dados.id_dados_fisicos);
    }

    if (dados.id_dados_tecnicos !== undefined) {
        updateFields.push(`id_dados_tecnicos = $${params.length + 1}`);
        params.push(dados.id_dados_tecnicos);
    }

    if (updateFields.length > 0) {
        params.push(id);
        await connection.query(`
            UPDATE avaliacao
            SET ${updateFields.join(', ')}
            WHERE id_avaliacao = $${params.length}
        `, params);
    }
}

export async function remove(id: number): Promise<void> {
    await connection.query(`
        DELETE FROM avaliacao
        WHERE id_avaliacao = $1
    `, [id]);
}
