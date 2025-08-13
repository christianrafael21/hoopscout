import { QueryResult } from "pg";
import { DadosFisicos } from "../entity/DadosFisicos";
import connection from "../database/postgres";

export async function create(dados: Omit<DadosFisicos, 'id_dados_fisicos'>): Promise<number> {
    const { rows } = await connection.query<{ id_dados_fisicos: number }>(`
        INSERT INTO dados_fisicos (idade, altura, peso)
        VALUES ($1, $2, $3)
        RETURNING id_dados_fisicos
    `, [dados.idade, dados.altura, dados.peso]);

    return rows[0].id_dados_fisicos;
}

export async function getById(id: number): Promise<DadosFisicos | null> {
    const { rows }: QueryResult<DadosFisicos> = await connection.query(`
        SELECT * FROM dados_fisicos
        WHERE id_dados_fisicos = $1
    `, [id]);

    return rows[0] || null;
}

export async function update(id: number, dados: Partial<Omit<DadosFisicos, 'id_dados_fisicos'>>): Promise<void> {
    const updateFields = [];
    const values = [id];
    let paramCount = 2;

    if (dados.idade !== undefined) {
        updateFields.push(`idade = $${paramCount}`);
        values.push(dados.idade);
        paramCount++;
    }

    if (dados.altura !== undefined) {
        updateFields.push(`altura = $${paramCount}`);
        values.push(dados.altura);
        paramCount++;
    }

    if (dados.peso !== undefined) {
        updateFields.push(`peso = $${paramCount}`);
        values.push(dados.peso);
        paramCount++;
    }

    if (updateFields.length > 0) {
        await connection.query(`
            UPDATE dados_fisicos
            SET ${updateFields.join(', ')}
            WHERE id_dados_fisicos = $1
        `, values);
    }
}

export async function remove(id: number): Promise<void> {
    await connection.query(`
        DELETE FROM dados_fisicos
        WHERE id_dados_fisicos = $1
    `, [id]);
}
