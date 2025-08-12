import { QueryResult } from "pg";
import connection from "../database/postgres";
import { Athlete } from "../entity/Athlete";

export async function getProbabilityCalc(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT a."height", a."weight", a."age", a."freeThrow", a."longShot", a."shortShot", a."assistsGame", u.name
        FROM "Athlete" a
        INNER JOIN "User" u ON a."userId" = u."id"
        WHERE a."userId" = $1;
    `,[id]);
    
    return athletes;
}

export async function getAthleteData(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT a.*, u.name 
        FROM "Athlete" a
        INNER JOIN "User" u ON a."userId" = u."id"
        WHERE a."userId" = $1;
    `,[id]);
    
    return athletes;
}