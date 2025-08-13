import { QueryResult } from "pg";
import connection from "../database/postgres";
import { Athlete } from "../entity/Athlete";

export async function getProbabilityCalc(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT df.altura as height, df.peso as weight, df.idade as age,
               dt.tiro_livre as "freeThrow", dt.arremesso_tres as "longShot", 
               dt.arremesso_livre as "shortShot", dt.assistencias as "assistsGame",
               u.primeiro_nome || ' ' || u.ultimo_nome as name
        FROM usuarios u
        INNER JOIN atleta_avaliacao aa ON aa.id_atleta = u.id_usuario
        INNER JOIN avaliacao a ON a.id_avaliacao = aa.id_avaliacao
        INNER JOIN dados_fisicos df ON df.id_dados_fisicos = a.id_dados_fisicos
        INNER JOIN dados_tecnicos dt ON dt.id_dados_tecnicos = a.id_dados_tecnicos
        WHERE u.id_usuario = $1
        ORDER BY a.data DESC
        LIMIT 1;
    `,[id]);
    
    return athletes;
}

export async function getAthleteData(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT df.altura as height, df.peso as weight, df.idade as age,
               dt.tiro_livre as "freeThrow", dt.arremesso_tres as "longShot", 
               dt.arremesso_livre as "shortShot", dt.assistencias as "assistsGame",
               u.primeiro_nome || ' ' || u.ultimo_nome as name,
               a.data as "createdAt"
        FROM usuarios u
        INNER JOIN atleta_avaliacao aa ON aa.id_atleta = u.id_usuario
        INNER JOIN avaliacao a ON a.id_avaliacao = aa.id_avaliacao
        INNER JOIN dados_fisicos df ON df.id_dados_fisicos = a.id_dados_fisicos
        INNER JOIN dados_tecnicos dt ON dt.id_dados_tecnicos = a.id_dados_tecnicos
        WHERE u.id_usuario = $1
        ORDER BY a.data DESC
        LIMIT 1;
    `,[id]);
    
    return athletes;
}