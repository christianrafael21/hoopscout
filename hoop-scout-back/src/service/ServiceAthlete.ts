import { Athlete } from "../entity/Athlete";
import * as athleteRepository from "../repositories/RepositoryAthlete";

export async function getProbabilityCalc(id: number): Promise<number> {
    const athlete: Athlete[] = await athleteRepository.getProbabilityCalc(id);
    if(!athlete.length) throw { type: 'Bad Request', message: 'Atleta ainda não avaliado' };
    
    // Buscar o atleta ouro igual ao da funcao modelAthlete
    const athleteOuro: Athlete = await getModelAthlete(id);

    // Calcular a probabilage para cada atributo
    const calculateScore = (realValue: number, goldValue: number): number => {
        return (realValue / goldValue) * 100;
    };

    const probability =
        (calculateScore(parseInt(athlete[0].height), parseInt(athleteOuro.height)) * 0.10) +
        (calculateScore(parseInt(athlete[0].weight), parseInt(athleteOuro.weight)) * 0.10) +
        (calculateScore(athlete[0].age, athleteOuro.age) * 0.10) +
        (calculateScore(parseInt(athlete[0].freeThrow), parseInt(athleteOuro.freeThrow)) * 0.20) +
        (calculateScore(parseInt(athlete[0].shortShot), parseInt(athleteOuro.shortShot)) * 0.20) +
        (calculateScore(parseInt(athlete[0].longShot), parseInt(athleteOuro.longShot)) * 0.20) +
        (calculateScore(athlete[0].assistsGame, athleteOuro.assistsGame) * 0.10);

    // Garantir que a probabilage tenha apenas duas casas decimais
    let formattedProbability = parseFloat(probability.toFixed(2));
    if(formattedProbability > 90) formattedProbability = 90.00;

    return formattedProbability;
}

export async function getAthleteById(id: number): Promise<Athlete> {
    const atletas: Athlete[] = await athleteRepository.getAthleteData(id);
    if(!atletas.length) throw { type: 'Bad Request', message: 'Atleta ainda não avaliado' };

    return atletas[0];
}

export async function getModelAthlete(id: number): Promise<any> {
    const athleteModel = {
        height: '1,90m',
        weight: '85kg',
        age: 18,
        freeThrow: '95%',
        shortShot: '90%',
        longShot: '85%',
        assistsGame: 15,
    };

    return athleteModel;
}