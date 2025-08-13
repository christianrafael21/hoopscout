import { Users, UserType } from "../entity/User";
import * as userRepository from "../repositories/RepositoryUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getUserInfo(id_usuario: number): Promise<Users> {
    const users: Users[] = await userRepository.getUserById(id_usuario);
    
    if(!users.length) throw { type: 'Bad Request', message: 'Usuário inexistente' };

    return users[0];
}

export async function signup(userInfo: Omit<Users,'id_usuario'>): Promise<void> {
    const existEmail: Users[] = await userRepository.existEmail(userInfo.email); 
    if(existEmail.length) throw { type: 'Conflict', message: 'Email de usuário já cadastrado' };

    const saltRounds = 10;
    const encryptPassword: string = bcrypt.hashSync(userInfo.senha, saltRounds);
    userInfo.senha = encryptPassword;

    await userRepository.createUser(userInfo);
}

export async function login(userInfo: { email: string; senha: string }): Promise<string> {
    const existEmail: Users[] = await userRepository.existEmail(userInfo.email);  
    if(!existEmail.length) throw { type: 'Unauthorized', message: 'Email ou senha inválidos' };

    const descryptPassword = await bcrypt.compareSync(userInfo.senha, existEmail[0].senha);
    if(!descryptPassword) throw { type: 'Unauthorized', message: 'Email ou senha inválidos' };

    const token: string = gerateToken(existEmail[0].id_usuario, existEmail[0].email, existEmail[0].tipo);

    return token;
}

export async function editProfile(userInfo: Partial<Omit<Users,'id_usuario' | 'tipo'>>, id_usuario: number): Promise<void> {
    const users: Users[] = await userRepository.getUserById(id_usuario);
    if(!users.length) throw { type: 'Not Found', message: 'Usuário não encontrado' };

    const updatedUserInfo = { ...userInfo };

    // Se nova senha fornecida, criptografa
    if (updatedUserInfo.senha) {
        const saltRounds = 10;
        updatedUserInfo.senha = bcrypt.hashSync(updatedUserInfo.senha, saltRounds);
    }

    // Mantém os campos existentes se não fornecidos
    if (!updatedUserInfo.email) updatedUserInfo.email = users[0].email;
    if (!updatedUserInfo.primeiro_nome) updatedUserInfo.primeiro_nome = users[0].primeiro_nome;
    if (!updatedUserInfo.ultimo_nome) updatedUserInfo.ultimo_nome = users[0].ultimo_nome;

    await userRepository.editProfile(updatedUserInfo, id_usuario);
}

function gerateToken(id_usuario: number, email: string, tipo: UserType): string {
    const SECRET: string = process.env.TOKEN_SECRET_KEY ?? 'default_secret';
    const EXPERIES_IN: string = process.env.EXPERIES_IN ?? '1h';

    const payload = {
        id_usuario,
        email,
        tipo
    };

    const jwtConfig = { 
        expiresIn: EXPERIES_IN
    };

    return jwt.sign(payload, SECRET, jwtConfig);
}