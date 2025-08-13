export interface Athlete {
    id: number;
    userId: number;
    name: string;
    age: number | null;
    height: number | null;
    weight: number | null;
    freeThrow: number | null;
    longShot: number | null;
    shortShot: number | null;
    assistsGame: number | null;
    createdAt: string | null;
    chances?: string;
    evaluationDate?: string;
}
