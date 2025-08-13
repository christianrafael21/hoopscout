import { Request, Response } from "express";
import { Avaliacao } from "../entity/Avaliacao";
import * as avaliacaoService from "../service/ServiceAvaliacao";

export class ControllerAvaliacao {
    public async create(req: Request, res: Response) {
        const { id_usuario } = res.locals.user;
        const dados: Omit<Avaliacao, 'id_avaliacao' | 'nota_media' | 'dados_fisicos' | 'dados_tecnicos' | 'atleta_ouro'> & { id_atleta: number } = req.body;

        const id = await avaliacaoService.create(dados, id_usuario);

        return res.status(201).json({ id_avaliacao: id });
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const avaliacao = await avaliacaoService.getById(parseInt(id));

        return res.status(200).json(avaliacao);
    }

    public async getByAtleta(req: Request, res: Response) {
        const { id_atleta } = req.params;
        const avaliacoes = await avaliacaoService.getByAtleta(parseInt(id_atleta));

        return res.status(200).json(avaliacoes);
    }

    public async getHistoricoByAtleta(req: Request, res: Response) {
        const { id_atleta } = req.params;
        const historico = await avaliacaoService.getHistoricoByAtleta(parseInt(id_atleta));

        return res.status(200).json(historico);
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const { id_usuario } = res.locals.user;
        const dados: Partial<Omit<Avaliacao, 'id_avaliacao' | 'nota_media' | 'dados_fisicos' | 'dados_tecnicos' | 'atleta_ouro'>> = req.body;

        await avaliacaoService.update(parseInt(id), dados, id_usuario);

        return res.status(200).send("Avaliação atualizada com sucesso");
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        const { id_usuario } = res.locals.user;

        await avaliacaoService.remove(parseInt(id), id_usuario);

        return res.status(200).send("Avaliação excluída com sucesso");
    }
}
