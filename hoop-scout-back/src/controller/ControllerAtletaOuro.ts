import { Request, Response } from "express";
import { AtletaOuro } from "../entity/AtletaOuro";
import * as atletaOuroService from "../service/ServiceAtletaOuro";

export class ControllerAtletaOuro {
    public async create(req: Request, res: Response) {
        const dados: Omit<AtletaOuro, 'id_atleta_ouro'> = req.body;

        const id = await atletaOuroService.create(dados);

        return res.status(201).json({ id_atleta_ouro: id });
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const dados = await atletaOuroService.getById(parseInt(id));

        return res.status(200).json(dados);
    }

    public async getByIdadeCategoria(req: Request, res: Response) {
        const { idade } = req.params;
        const dados = await atletaOuroService.getByIdadeCategoria(parseInt(idade));

        return res.status(200).json(dados);
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const dados: Partial<Omit<AtletaOuro, 'id_atleta_ouro'>> = req.body;

        await atletaOuroService.update(parseInt(id), dados);

        return res.status(200).send("Dados do atleta ouro atualizados com sucesso");
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;

        await atletaOuroService.remove(parseInt(id));

        return res.status(200).send("Dados do atleta ouro excluídos com sucesso");
    }
}
