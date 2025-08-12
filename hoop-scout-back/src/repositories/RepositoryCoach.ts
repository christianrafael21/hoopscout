import { Athlete } from "../entity/Athlete";
import { QueryResult } from "pg";
import connection from "../database/postgres";

export async function getAllAthletes(): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT *, COALESCE(a."userId", u.id) AS "userId"
        FROM "User" u    
        LEFT JOIN "Athlete" a ON a."userId" = u.id 
        WHERE role = 'athlete'
    `);
    
    return athletes;
}

export async function getAthleteById(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT * 
        FROM "User" u
        LEFT JOIN "Athlete" a ON a."userId" = u.id 
        WHERE role = 'athlete' AND u.id = $1
    `,[id]);
    
    return athletes;
}

export async function updateAthleteGrade(rating: any, id: number): Promise<void> {
    // Verifica se o atleta já tem uma avaliação
    const { rows: athlete } = await connection.query(`
        SELECT * FROM "Athlete" WHERE "userId" = $1
    `, [id]);

    if (athlete.length > 0) {
        // Se existe, faz UPDATE
        await connection.query(`
            UPDATE "Athlete"
            SET age = $1, height = $2, weight = $3, "freeThrow" = $4, "longShot" = $5, 
                "shortShot" = $6, "assistsGame" = $7, "coachId" = $8
            WHERE "userId" = $9
        `, [rating.age, rating.height, rating.weight, rating.freeThrow, rating.longShot, 
            rating.shortShot, rating.assistsGame, rating.coachId, id]);
    } else {
        // Se não existe, faz INSERT
        await connection.query(`
            INSERT INTO "Athlete"
            ("userId", age, height, weight, "freeThrow", "longShot", "shortShot", "assistsGame", "coachId")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [id, rating.age, rating.height, rating.weight, rating.freeThrow, rating.longShot, 
            rating.shortShot, rating.assistsGame, rating.coachId]);
    }
}
