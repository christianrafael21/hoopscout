export interface User {
    userId: number,
    email: string,
    role: 'user' | 'coach' | 'athlete',
}