export interface User {
    id_usuario: number,
    email: string,
    tipo: 'ADMIN' | 'COACH' | 'ATLETA',
}