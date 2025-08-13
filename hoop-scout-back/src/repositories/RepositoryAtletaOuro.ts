import { QueryResult } from "pg";
import { AtletaOuro } from "../entity/AtletaOuro";
import connection from "../database/postgres";

export async function create(dados: Omit<AtletaOuro, 'id_atleta_ouro'>): Promise<number> {
    const { rows } = await connection.query<{ id_atleta_ouro: number }>(`
        INSERT INTO atleta_ouro (
            idade_categoria, peso_ideal, altura_ideal, 
            tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_atleta_ouro
    `, [
        dados.idade_categoria, dados.peso_ideal, dados.altura_ideal,
        dados.tiro_ideal, dados.assistencia_ideal, dados.livre_ideal,
        dados.tres_ideal
    ]);

    return rows[0].id_atleta_ouro;
}

export async function getById(id: number): Promise<AtletaOuro | null> {
    const { rows }: QueryResult<AtletaOuro> = await connection.query(`
        SELECT * FROM atleta_ouro
        WHERE id_atleta_ouro = $1
    `, [id]);

    return rows[0] || null;
}

export async function getByIdadeCategoria(idade: number): Promise<AtletaOuro | null> {
    const { rows }: QueryResult<AtletaOuro> = await connection.query(`
        SELECT * FROM atleta_ouro
        WHERE idade_categoria = $1
    `, [idade]);

    return rows[0] || null;
}

export async function update(id: number, dados: Partial<Omit<AtletaOuro, 'id_atleta_ouro'>>): Promise<void> {
    const updateFields = [];
    const values = [id];
    let paramCount = 2;

    const campos = [
        'idade_categoria', 'peso_ideal', 'altura_ideal',
        'tiro_ideal', 'assistencia_ideal', 'livre_ideal', 'tres_ideal'
    ] as const;

    for (const campo of campos) {
        if (dados[campo] !== undefined) {
            updateFields.push(`${campo} = $${paramCount}`);
            values.push(dados[campo]);
            paramCount++;
        }
    }

    if (updateFields.length > 0) {
        await connection.query(`
            UPDATE atleta_ouro
            SET ${updateFields.join(', ')}
            WHERE id_atleta_ouro = $1
        `, values);
    }
}

export async function remove(id: number): Promise<void> {
    await connection.query(`
        DELETE FROM atleta_ouro
        WHERE id_atleta_ouro = $1
    `, [id]);
}
