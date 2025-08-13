import joi from "joi";

export const userSchema = joi.object({ 
    email: joi.string().email().required().label("Fornecer email válido"),
    primeiro_nome: joi.string().min(2).max(80).required().label("Nome tem que ter no mínimo 2 caracteres"),
    ultimo_nome: joi.string().min(2).max(80).required().label("Sobrenome tem que ter no mínimo 2 caracteres"),
    senha: joi.string().min(8).required().label("Senha tem que ter no mínimo 8 caracteres"),
    tipo: joi.string().valid('ADMIN', 'COACH', 'ATLETA').required().label("Tipo de usuário inválido"),
    id_categoria: joi.number().optional().label("ID da categoria de idade")
});

export const loginSchema = joi.object({ 
    email: joi.string().email().required().label("Fornecer email válido"),
    senha: joi.string().min(8).required().label("Senha tem que ter no mínimo 8 caracteres")
});