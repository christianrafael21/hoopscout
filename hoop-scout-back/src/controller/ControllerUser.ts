import { Request, Response} from "express";
import { Users } from "../entity/User";
import * as userService from "../service/ServiceUser";
import connection from "../database/postgres";

export class ControllerUser {
    public async getInfo(req: Request, res: Response) {
        const { id }: { id: number } = res.locals.user;
        const user: Users = await userService.getUserInfo(id);

        return res.status(200).json(user);
    }

    public async login(req: Request, res: Response) {
        const user: Omit<Users,'id | createdAt | name'> = req.body;

        const token: string = await userService.login(user);

        return res.status(200).send({token});
    }

    public async signup(req: Request, res: Response) {
        const user: Omit<Users,'id | createdAt'> = req.body;

        await userService.signup(user);

        return res.status(201).send("Usuário criado com sucesso");
    }

    public async editProfile(req: Request, res: Response) {
        const { id }: { id: number } = res.locals.user;
        const user: Omit<Users,'id | createdAt'> = req.body;

        await userService.editProfile(user, id);

        return res.status(200).send("Perfil editado com sucesso");
    }

    public async verifyAuthUser(req: Request, res: Response) {
        return res.status(200).send("Perfil com autorizacao atleta");
    }

    public async verifyAuthAthlete(req: Request, res: Response) {
        return res.status(200).send("Perfil com autorizacao de treinador");
    }

    public async verifyAuthCoach(req: Request, res: Response) {
        return res.status(200).send("Perfil com autorizacao de treinador");
    }
}