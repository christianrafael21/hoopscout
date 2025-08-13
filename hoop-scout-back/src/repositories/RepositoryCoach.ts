import { Athlete } from "../entity/Athlete";
import { QueryResult } from "pg";
import connection from "../database/postgres";

export async function getAllAthletes(): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT DISTINCT ON (u.id_usuario)
               u.id_usuario as "userId",
               u.primeiro_nome || ' ' || u.ultimo_nome as name,
               df.altura as height,
               df.peso as weight,
               df.idade as age,
               dt.tiro_livre as "freeThrow",
               dt.arremesso_tres as "longShot",
               dt.arremesso_livre as "shortShot",
               dt.assistencias as "assistsGame",
               a.data as "createdAt",
               TO_CHAR(a.data, 'DD/MM/YYYY') as "evaluationDate"
        FROM usuarios u
        LEFT JOIN atleta_avaliacao aa ON aa.id_atleta = u.id_usuario
        LEFT JOIN avaliacao a ON a.id_avaliacao = aa.id_avaliacao
        LEFT JOIN dados_fisicos df ON df.id_dados_fisicos = a.id_dados_fisicos
        LEFT JOIN dados_tecnicos dt ON dt.id_dados_tecnicos = a.id_dados_tecnicos
        WHERE u.tipo = 'ATLETA' 
        AND u.email NOT LIKE '%ouro%@hoopscout.com'
        AND u.primeiro_nome != 'Atleta'
        ORDER BY u.id_usuario, a.data DESC NULLS LAST;
    `);
    
    return athletes;
}

export async function getAthleteById(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT u.id_usuario as "userId",
               u.primeiro_nome || ' ' || u.ultimo_nome as name,
               df.altura as height,
               df.peso as weight,
               df.idade as age,
               dt.tiro_livre as "freeThrow",
               dt.arremesso_tres as "longShot",
               dt.arremesso_livre as "shortShot",
               dt.assistencias as "assistsGame",
               a.data as "createdAt"
        FROM usuarios u
        LEFT JOIN atleta_avaliacao aa ON aa.id_atleta = u.id_usuario
        LEFT JOIN avaliacao a ON a.id_avaliacao = aa.id_avaliacao
        LEFT JOIN dados_fisicos df ON df.id_dados_fisicos = a.id_dados_fisicos
        LEFT JOIN dados_tecnicos dt ON dt.id_dados_tecnicos = a.id_dados_tecnicos
        WHERE u.tipo = 'ATLETA' 
        AND u.id_usuario = $1
        AND u.email NOT LIKE '%ouro%@hoopscout.com'
        AND u.primeiro_nome != 'Atleta'
        ORDER BY a.data DESC NULLS LAST
        LIMIT 1;
    `,[id]);

    // Garante que sempre retorna um atleta, mesmo sem avaliação
    if (athletes.length === 0) {
        const { rows: users } = await connection.query(`
            SELECT 
                id_usuario as "userId",
                primeiro_nome || ' ' || ultimo_nome as name
            FROM usuarios
            WHERE tipo = 'ATLETA' AND id_usuario = $1
        `, [id]);

        if (users.length > 0) {
            return [{
                ...users[0],
                height: null,
                weight: null,
                age: null,
                freeThrow: null,
                longShot: null,
                shortShot: null,
                assistsGame: null,
                createdAt: null
            }];
        }
    }
    
    return athletes;
}

export async function updateAthleteGrade(rating: any, id: number): Promise<void> {
    // Primeiro insere os dados físicos
    const { rows: [dadosFisicos] } = await connection.query(`
        INSERT INTO dados_fisicos (idade, altura, peso)
        VALUES ($1, $2, $3)
        RETURNING id_dados_fisicos
    `, [rating.age, rating.height, rating.weight]);

    // Depois insere os dados técnicos
    const { rows: [dadosTecnicos] } = await connection.query(`
        INSERT INTO dados_tecnicos (tiro_livre, arremesso_tres, arremesso_livre, assistencias)
        VALUES ($1, $2, $3, $4)
        RETURNING id_dados_tecnicos
    `, [rating.freeThrow, rating.longShot, rating.shortShot, rating.assistsGame]);

    // Insere a avaliação principal
    const { rows: [avaliacao] } = await connection.query(`
        INSERT INTO avaliacao (data, id_dados_fisicos, id_dados_tecnicos)
        VALUES (CURRENT_DATE, $1, $2)
        RETURNING id_avaliacao
    `, [dadosFisicos.id_dados_fisicos, dadosTecnicos.id_dados_tecnicos]);

    // Relaciona a avaliação ao atleta
    await connection.query(`
        INSERT INTO atleta_avaliacao (id_atleta, id_avaliacao)
        VALUES ($1, $2)
    `, [id, avaliacao.id_avaliacao]);

    // Relaciona a avaliação ao coach
    await connection.query(`
        INSERT INTO coach_avaliacao (id_coach, id_avaliacao)
        VALUES ($1, $2)
    `, [rating.coachId, avaliacao.id_avaliacao]);
}
