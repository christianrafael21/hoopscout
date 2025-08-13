import { QueryResult } from "pg";
import { Users, UserType } from "../entity/User";
import connection from "../database/postgres";

export async function getUserById(id_usuario: number): Promise<Users[]> {
    const { rows: users }: QueryResult<Users> = await connection.query(`
        SELECT * FROM usuarios
        WHERE id_usuario = $1
    `,[id_usuario]);

    return users;
}

export async function existEmail(email: string): Promise<Users[]> {
    const { rows: users }: QueryResult<Users> = await connection.query(`
        SELECT * FROM usuarios
        WHERE email = $1
    `,[email]); 
    
    return users;
}

export async function createUser(user: Omit<Users,'id_usuario'>): Promise<void> {
    await connection.query(`
        INSERT INTO usuarios
        (tipo, email, senha, primeiro_nome, ultimo_nome, id_categoria)
        VALUES ($1, $2, $3, $4, $5, $6)
    `,[user.tipo, user.email, user.senha, user.primeiro_nome, user.ultimo_nome, user.id_categoria]);     
}

export async function editProfile(user: Partial<Omit<Users,'id_usuario' | 'tipo'>>, id_usuario: number): Promise<void> {
    const updateFields = [];
    const values: (string | number)[] = [id_usuario];
    let paramCount = 2;

    if (user.email) {
        updateFields.push(`email = $${paramCount}`);
        values.push(user.email);
        paramCount++;
    }
    if (user.primeiro_nome) {
        updateFields.push(`primeiro_nome = $${paramCount}`);
        values.push(user.primeiro_nome);
        paramCount++;
    }
    if (user.ultimo_nome) {
        updateFields.push(`ultimo_nome = $${paramCount}`);
        values.push(user.ultimo_nome);
        paramCount++;
    }
    if (user.senha) {
        updateFields.push(`senha = $${paramCount}`);
        values.push(user.senha);
        paramCount++;
    }
    if (user.id_categoria) {
        updateFields.push(`id_categoria = $${paramCount}`);
        values.push(user.id_categoria);
        paramCount++;
    }

    if (updateFields.length > 0) {
        await connection.query(`
            UPDATE usuarios 
            SET ${updateFields.join(', ')}
            WHERE id_usuario = $1
        `, values);     
    }
}