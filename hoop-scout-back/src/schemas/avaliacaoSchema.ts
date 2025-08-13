import joi from "joi";

export const dadosFisicosSchema = joi.object({
    idade: joi.number().min(0).max(18).required().label("Idade deve estar entre 0 e 18 anos"),
    altura: joi.number().min(1.0).max(2.5).required().label("Altura deve estar entre 1.0m e 2.5m"),
    peso: joi.number().min(30).max(150).required().label("Peso deve estar entre 30kg e 150kg")
});

export const dadosTecnicosSchema = joi.object({
    tiro_livre: joi.number().min(0).max(100).required().label("Tiro livre deve estar entre 0 e 100%"),
    arremesso_tres: joi.number().min(0).max(100).required().label("Arremesso de três deve estar entre 0 e 100%"),
    arremesso_livre: joi.number().min(0).max(100).required().label("Arremesso livre deve estar entre 0 e 100%"),
    assistencias: joi.number().min(0).max(100).required().label("Assistências deve estar entre 0 e 100%")
});

export const atletaOuroSchema = joi.object({
    idade_categoria: joi.number().min(0).max(18).required().label("Idade da categoria deve estar entre 0 e 18 anos"),
    peso_ideal: joi.number().min(30).max(150).required().label("Peso ideal deve estar entre 30kg e 150kg"),
    altura_ideal: joi.number().min(1.0).max(2.5).required().label("Altura ideal deve estar entre 1.0m e 2.5m"),
    tiro_ideal: joi.number().min(0).max(100).required().label("Tiro ideal deve estar entre 0 e 100%"),
    assistencia_ideal: joi.number().min(0).max(100).required().label("Assistência ideal deve estar entre 0 e 100%"),
    livre_ideal: joi.number().min(0).max(100).required().label("Lance livre ideal deve estar entre 0 e 100%"),
    tres_ideal: joi.number().min(0).max(100).required().label("Arremesso de três ideal deve estar entre 0 e 100%")
});

export const avaliacaoSchema = joi.object({
    id_atleta_ouro: joi.number().optional().label("ID do atleta ouro"),
    id_dados_fisicos: joi.number().required().label("ID dos dados físicos é obrigatório"),
    id_dados_tecnicos: joi.number().required().label("ID dos dados técnicos é obrigatório"),
    id_atleta: joi.number().required().label("ID do atleta é obrigatório")
});
