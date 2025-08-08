import { Request, Response} from "express";
import * as coachService from "../service/ServiceCoach";
import { Athlete } from "../entity/Athlete";
import { ratingType } from "../types/ratingType";

export class ControllerCoach {
    public async getAllAthlete(req: Request, res: Response) {
        const atletas: Athlete[] = await coachService.getAllAthletes();

        return res.status(200).json(atletas);
    }

    public async publishAthleteGrade(req: Request, res: Response) {
        const data: ratingType = req.body;
        const athleteId: number = Number(req.params.id);
        const { id }: { id: number } = res.locals.user;
                
        await coachService.publishAthleteGrade(data, athleteId, id);
        
        return res.status(200).send("Avaliação de atleta realizada");
    }

    public async getEspecificAthlete(req: Request, res: Response) {
        const id: number = Number(req.params.id);

        const athlete: Athlete = await coachService.getAthleteById(id);

        return res.status(200).send(athlete);
    }
}