import { Request, Response } from "express";
import { DadosTecnicos } from "../entity/DadosTecnicos";
import * as dadosTecnicosService from "../service/ServiceDadosTecnicos";

export class ControllerDadosTecnicos {
    public async create(req: Request, res: Response) {
        const dados: Omit<DadosTecnicos, 'id_dados_tecnicos'> = req.body;

        const id = await dadosTecnicosService.create(dados);

        return res.status(201).json({ id_dados_tecnicos: id });
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const dados = await dadosTecnicosService.getById(parseInt(id));

        return res.status(200).json(dados);
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const dados: Partial<Omit<DadosTecnicos, 'id_dados_tecnicos'>> = req.body;

        await dadosTecnicosService.update(parseInt(id), dados);

        return res.status(200).send("Dados técnicos atualizados com sucesso");
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;

        await dadosTecnicosService.remove(parseInt(id));

        return res.status(200).send("Dados técnicos excluídos com sucesso");
    }
}
