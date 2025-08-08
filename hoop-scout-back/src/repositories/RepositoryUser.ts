import { QueryResult } from "pg";
import { Users } from "../entity/User";
import connection from "../database/postgres";

export async function getUserById(id: number): Promise<Users[]> {
    const { rows: users }: QueryResult<Users> = await connection.query(`
        SELECT * FROM "User"
        WHERE id = $1
    `,[id]);

    return users;
}

export async function existEmail(email: string): Promise<Users[]> {
    const { rows: users }: QueryResult<Users> = await connection.query(`
        SELECT * FROM "User"
        WHERE email = $1
    `,[email]); 
    
    return users;
}

export async function createUser(user: Omit<Users,'id'>): Promise<void> {
    await connection.query(`
        INSERT INTO "User"
        (email, name, role, password, "createdAt")
        VALUES ($1, $2, $3, $4, $5)
    `,[user.email, user.name, user.role, user.password, user.createdAt]);     
}

export async function editProfile(user: Omit<Users,'id | role | createdAt'>, id: number): Promise<void> {
    await connection.query(`
        UPDATE "User" 
        SET email = $2, name = $3, password = $4
        WHERE id = $1
    `,[id, user.email, user.name, user.password]);     
}