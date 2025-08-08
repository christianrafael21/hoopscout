import { QueryResult } from "pg";
import connection from "../database/postgres";
import { Athlete } from "../entity/Athlete";

export async function getProbabilityCalc(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT "height", "weight", "age", "freeThrow", "longShot", "shortShot", "assistsGame"
        FROM "Athlete"
        WHERE "userId" = $1;
    `,[id]);
    
    return athletes;
}

export async function getAthleteData(id: number): Promise<Athlete[]> {
    const { rows: athletes }: QueryResult<Athlete> = await connection.query(`
        SELECT * 
        FROM "Athlete" 
        WHERE "userId" = $1;
    `,[id]);
    
    return athletes;
}