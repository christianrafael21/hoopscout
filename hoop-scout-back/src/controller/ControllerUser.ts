import { Request, Response} from "express";
import { Users, UserType } from "../entity/User";
import * as userService from "../service/ServiceUser";
import connection from "../database/postgres";

export class ControllerUser {
    public async getInfo(req: Request, res: Response) {
        const { id_usuario } = res.locals.user;
        const user: Users = await userService.getUserInfo(id_usuario);

        return res.status(200).json(user);
    }

    public async login(req: Request, res: Response) {
        const user: Pick<Users, 'email' | 'senha'> = req.body;
        const token: string = await userService.login(user);

        return res.status(200).send({token});
    }

    public async signup(req: Request, res: Response) {
        const user: Omit<Users, 'id_usuario'> = req.body;
        await userService.signup(user);

        return res.status(201).send("Usuário criado com sucesso");
    }

    public async editProfile(req: Request, res: Response) {
        const { id_usuario } = res.locals.user;
        const user: Partial<Omit<Users, 'id_usuario' | 'tipo'>> = req.body;

        await userService.editProfile(user, id_usuario);

        return res.status(200).send("Perfil editado com sucesso");
    }

    public async verifyAuthAthlete(req: Request, res: Response) {
        return res.status(200).send("Perfil com autorização de atleta");
    }

    public async verifyAuthCoach(req: Request, res: Response) {
        return res.status(200).send("Perfil com autorização de treinador");
    }

    public async verifyAuthAdmin(req: Request, res: Response) {
        return res.status(200).send("Perfil com autorização de administrador");
    }
}