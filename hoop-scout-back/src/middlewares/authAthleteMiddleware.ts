import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as userRepository from "../repositories/RepositoryUser";
import { Users } from "../entity/User";
dotenv.config();

export async function validateTokenAthleteAuth(req: Request, res: Response, next: NextFunction) {
    const Authorization = req.headers.authorization;
    const token = Authorization?.replace("Bearer ", "");

    if(!token) throw { type: "Unauthorized", message: "Acesso bloqueado, autorização necessária"} 

    try {
        const SECRET: string = process.env.TOKEN_SECRET_KEY ?? '';
        const { role, userId } = jwt.verify(token,SECRET) as { role: string, userId: number }
        const user: Users[] = await userRepository.getUserById(userId);
        if(role !== 'athlete' && role !== 'coach') { 
            throw { type: "Unauthorized", message: "Acesso bloqueado, autorização necessária"};
        }
        res.locals.user = user[0];
        next();
    } catch (error) {
        throw { type: "Unauthorized", message: "Acesso bloqueado, autorização necessária"};
    }
}