import { Request, Response } from "express";
import { DadosFisicos } from "../entity/DadosFisicos";
import * as dadosFisicosService from "../service/ServiceDadosFisicos";

export class ControllerDadosFisicos {
    public async create(req: Request, res: Response) {
        const dados: Omit<DadosFisicos, 'id_dados_fisicos'> = req.body;

        const id = await dadosFisicosService.create(dados);

        return res.status(201).json({ id_dados_fisicos: id });
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const dados = await dadosFisicosService.getById(parseInt(id));

        return res.status(200).json(dados);
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const dados: Partial<Omit<DadosFisicos, 'id_dados_fisicos'>> = req.body;

        await dadosFisicosService.update(parseInt(id), dados);

        return res.status(200).send("Dados físicos atualizados com sucesso");
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;

        await dadosFisicosService.remove(parseInt(id));

        return res.status(200).send("Dados físicos excluídos com sucesso");
    }
}
