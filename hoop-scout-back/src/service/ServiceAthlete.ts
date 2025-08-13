import { Athlete } from "../entity/Athlete";
import * as athleteRepository from "../repositories/RepositoryAthlete";

export async function getProbabilityCalc(id: number): Promise<number> {
    const athlete: Athlete[] = await athleteRepository.getProbabilityCalc(id);
    if(!athlete.length) throw { type: 'Bad Request', message: 'Atleta ainda não avaliado' };
    
    const currentAthlete = athlete[0];
    
    // Verifica se o atleta tem todos os dados necessários
    if (currentAthlete.height === null || 
        currentAthlete.weight === null || 
        currentAthlete.age === null || 
        currentAthlete.freeThrow === null ||
        currentAthlete.shortShot === null ||
        currentAthlete.longShot === null ||
        currentAthlete.assistsGame === null) {
        throw { type: 'Bad Request', message: 'Atleta ainda não avaliado' };
    }
    
    // Buscar o atleta ouro igual ao da funcao modelAthlete
    const athleteOuro: Athlete = await getModelAthlete(id);

    // Calcular a probabilage para cada atributo
    const calculateScore = (realValue: number, goldValue: number): number => {
        return (realValue / goldValue) * 100;
    };

    // Os valores já vêm como números do banco
    const probability =
        (calculateScore(currentAthlete.height, athleteOuro.height) * 0.10) +
        (calculateScore(currentAthlete.weight, athleteOuro.weight) * 0.10) +
        (calculateScore(currentAthlete.age, athleteOuro.age) * 0.10) +
        (calculateScore(currentAthlete.freeThrow, athleteOuro.freeThrow) * 0.20) +
        (calculateScore(currentAthlete.shortShot, athleteOuro.shortShot) * 0.20) +
        (calculateScore(currentAthlete.longShot, athleteOuro.longShot) * 0.20) +
        (calculateScore(currentAthlete.assistsGame, athleteOuro.assistsGame) * 0.10);

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

export async function getModelAthlete(id: number): Promise<Athlete> {
    const athleteModel: Athlete = {
        height: 1.90,
        weight: 85,
        age: 18,
        freeThrow: 95,
        shortShot: 90,
        longShot: 85,
        assistsGame: 15,
        userId: 0,
        id: 0,
        createdAt: null
    };

    return athleteModel;
}