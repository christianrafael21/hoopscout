import joi from "joi";

export const ratingSchema = joi.object({ 
    age: joi.number().max(18).required().label("Atleta tem que ter ate 18 anos"),
    height: joi.string().length(5).required().label("Altura tem que ser no formato X.XXm"),
    weight: joi.string().min(4).max(5).required().label("Peso tem que ser no formato XXkg ou XXXkg"),
    freeThrow: joi.string().min(3).max(4).required().label("Formato X%"),
    longShot: joi.string().min(3).max(4).required().label("Formato X%"),
    shortShot: joi.string().min(3).max(4).required().label("Formato X%"),
    assistsGame: joi.number().required().label("Tem que ser um numero")
});