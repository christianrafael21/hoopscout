"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenAthleteAuth = validateTokenAthleteAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function validateTokenAthleteAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const Authorization = req.headers.authorization;
        const token = Authorization === null || Authorization === void 0 ? void 0 : Authorization.replace("Bearer ", "");
        if (!token)
            throw { type: "Unauthorized", message: "Acesso bloqueado, autorização necessária" };
        try {
            const SECRET = (_a = process.env.TOKEN_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
            const { role } = jsonwebtoken_1.default.verify(token, SECRET);
            if (role !== 'athlete' && role !== 'coach') {
                throw { type: "Unauthorized", message: "Acesso bloqueado, autorização necessária" };
            }
            next();
        }
        catch (error) {
            throw { type: "Unauthorized", message: "Acesso bloqueado, autorização necessária" };
        }
    });
}
