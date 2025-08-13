import { QueryResult } from "pg";
import { DadosTecnicos } from "../entity/DadosTecnicos";
import connection from "../database/postgres";

export async function create(dados: Omit<DadosTecnicos, 'id_dados_tecnicos'>): Promise<number> {
    const { rows } = await connection.query<{ id_dados_tecnicos: number }>(`
        INSERT INTO dados_tecnicos (tiro_livre, arremesso_tres, arremesso_livre, assistencias)
        VALUES ($1, $2, $3, $4)
        RETURNING id_dados_tecnicos
    `, [dados.tiro_livre, dados.arremesso_tres, dados.arremesso_livre, dados.assistencias]);

    return rows[0].id_dados_tecnicos;
}

export async function getById(id: number): Promise<DadosTecnicos | null> {
    const { rows }: QueryResult<DadosTecnicos> = await connection.query(`
        SELECT * FROM dados_tecnicos
        WHERE id_dados_tecnicos = $1
    `, [id]);

    return rows[0] || null;
}

export async function update(id: number, dados: Partial<Omit<DadosTecnicos, 'id_dados_tecnicos'>>): Promise<void> {
    const updateFields = [];
    const values = [id];
    let paramCount = 2;

    if (dados.tiro_livre !== undefined) {
        updateFields.push(`tiro_livre = $${paramCount}`);
        values.push(dados.tiro_livre);
        paramCount++;
    }

    if (dados.arremesso_tres !== undefined) {
        updateFields.push(`arremesso_tres = $${paramCount}`);
        values.push(dados.arremesso_tres);
        paramCount++;
    }

    if (dados.arremesso_livre !== undefined) {
        updateFields.push(`arremesso_livre = $${paramCount}`);
        values.push(dados.arremesso_livre);
        paramCount++;
    }

    if (dados.assistencias !== undefined) {
        updateFields.push(`assistencias = $${paramCount}`);
        values.push(dados.assistencias);
        paramCount++;
    }

    if (updateFields.length > 0) {
        await connection.query(`
            UPDATE dados_tecnicos
            SET ${updateFields.join(', ')}
            WHERE id_dados_tecnicos = $1
        `, values);
    }
}

export async function remove(id: number): Promise<void> {
    await connection.query(`
        DELETE FROM dados_tecnicos
        WHERE id_dados_tecnicos = $1
    `, [id]);
}
