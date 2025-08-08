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

export async function publishAthleteGrade(rating: any, id: number): Promise<void> {
    await connection.query(`
        INSERT INTO "Athlete"
        ("userId", age, height, weight, "freeThrow", "longShot", "shortShot", "assistsGame", "coachId")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,[id, rating.age, rating.height, rating.weight, rating.freeThrow, rating.longShot, rating.shortShot, rating.assistsGame, rating.coachId]);
}