export class Athlete {
    id: number;
    userId: number;
    name?: string; // Nome do usuário da tabela User
    age: number | null;
    height: number | null;
    weight: number | null;
    freeThrow: number | null;
    longShot: number | null;
    shortShot: number | null;
    assistsGame: number | null;
    createdAt: Date | null;
    evaluationDate?: string; // Data formatada da última avaliação
}