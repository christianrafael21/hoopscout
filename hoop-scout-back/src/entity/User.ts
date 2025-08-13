export enum UserType {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  ATLETA = 'ATLETA'
}

export class Users {
  id_usuario: number;
  tipo: UserType;
  email: string;
  senha: string;
  primeiro_nome: string;
  ultimo_nome: string;
  id_categoria?: number; // Opcional, apenas para atletas
}