import { Request, Response } from "express";
import { Athlete } from "../entity/Athlete";
import * as athlteService from "../service/ServiceAthlete";

export class ControllerAthlete {
    public async getInfo(req: Request, res: Response): Promise<Response> {
        const { id }: { id: number } = res.locals.user;

        const athlete: Athlete = await athlteService.getAthleteById(id);

        return res.status(200).json(athlete);
    }

    public async modelAthlete(req: Request, res: Response): Promise<Response> {
        const { id }: { id: number } = res.locals.user;

        const athleteModel: Athlete = await athlteService.getModelAthlete(id);

        return res.status(200).json(athleteModel);
    }


    public async probailityCalc(req: Request, res: Response): Promise<Response> {
        const { id }: { id: number } = res.locals.user;

        const probability: number = await athlteService.getProbabilityCalc(id);

        return res.status(200).json({probability});
    }
 
    
}