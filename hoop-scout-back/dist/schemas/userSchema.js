"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().label("Fornecer email valido"),
    name: joi_1.default.string().min(2).max(70).required().label("Nome tem que ter no minimo 2 caracteres, e todos serem do alfabeto"),
    password: joi_1.default.string().min(8).required().label("Senha tem que ter no mínimo 8 caracteres")
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().label("Fornecer email valido"),
    password: joi_1.default.string().min(8).required().label("Senha tem que ter no mínimo 8 caracteres")
});
