import { Users } from "../entity/User";
import * as userRepository from "../repositories/RepositoryUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//----------------SERVICES CHAMADAS PELOS CONTROLLERS --------------------
export async function getUserInfo(id: number): Promise<Users> {
    const users: Users[] = await userRepository.getUserById(id);
    
    if(!users.length) throw { type: 'Bad Request', message: 'Usuario inexistente' };

    return users[0];
}

export async function signup(userInfo: Omit<Users,'id'>): Promise<void> {
    const existEmail: Users[] = await userRepository.existEmail(userInfo.email); 
    if(existEmail.length) throw { type: 'Conflit', message: 'Email de usuario ja cadastrado' };

    const saltRounds = 10; //maior, mais seguro, porem mais lento
    const encryptPassword: string = bcrypt.hashSync(userInfo.password, saltRounds);
    userInfo.password = encryptPassword;

    const currentDate = new Date();
    const currentDateBrazil = new Date(currentDate.getTime() - 3 * 60 * 60 * 1000);
    userInfo.createdAt = currentDateBrazil;
    userInfo.role = 'user';

    await userRepository.createUser(userInfo);
}

export async function login(userInfo: Omit<Users,'id | createdAt | name'>): Promise<string> {
    const existEmail: Users[] = await userRepository.existEmail(userInfo.email);  
    if(!existEmail.length) throw { type: 'Unauthorized', message: 'Email ou senha invalidos' };

    const descryptPassword = await bcrypt.compareSync(userInfo.password, existEmail[0].password);
    if(!descryptPassword) throw { type: 'Unauthorized', message: 'Email ou senha invalidos' };

    const token: string = gerateToken(existEmail[0].id, existEmail[0].email, existEmail[0].role);

    return token;
}

export async function editProfile(userInfo: Omit<Users,'id | createdAt'>, id: number): Promise<void> {
    const users: Users[] = await userRepository.getUserById(id);
    if(!users.length) throw { type: 'Not Found', message: 'Usuario nao encontrado' };

    if(!userInfo.password) userInfo.password = users[0].password;
    else {
        const saltRounds = 10; //maior, mais seguro, porem mais lento
        const encryptPassword: string = bcrypt.hashSync(userInfo.password, saltRounds);
        userInfo.password = encryptPassword;
    }
    
    if(!userInfo.name) userInfo.name = users[0].name;
    if(!userInfo.email) userInfo.email = users[0].email;

    await userRepository.editProfile(userInfo, id);
}

//----------------FUNCOES DE LOGICA CHAMADAS PELOS SERVICES --------------------

function gerateToken(userId: number,email: string, role: string): string {
    const SECRET: string = process.env.TOKEN_SECRET_KEY ?? '';
    const EXPERIES_IN: string | undefined = process.env.EXPERIES_IN

    const level: number = role === 'user' ? 1 : (role === 'coach' ? 3 : 2);

    const payload: object = {
        userId, 
        email,  
        role,
        level
    }

    const jwtConfig: object = { 
        expiresIn: EXPERIES_IN
    }

    const token: string = jwt.sign(payload,SECRET,jwtConfig);

    return token;
}