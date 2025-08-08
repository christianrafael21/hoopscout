"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getUserInfo = getUserInfo;
exports.signup = signup;
exports.login = login;
exports.editProfile = editProfile;
const userRepository = __importStar(require("../repositories/RepositoryUser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserInfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield userRepository.getUserById(id);
        if (!users)
            throw { type: 'Bad Request', message: 'Usuario inexistente' };
        return users;
    });
}
function signup(userInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const existEmail = yield userRepository.existEmail(userInfo.email);
        if (existEmail)
            throw { type: 'Conflit', message: 'Email de usuario ja cadastrado' };
        const saltRounds = 10;
        const encryptPassword = bcrypt_1.default.hashSync(userInfo.password, saltRounds);
        userInfo.password = encryptPassword;
        const currentDate = new Date();
        const currentDateBrazil = new Date(currentDate.getTime() - 3 * 60 * 60 * 1000);
        userInfo.createdAt = currentDateBrazil;
        yield userRepository.createUser(userInfo);
    });
}
function login(userInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const existEmail = yield userRepository.existEmail(userInfo.email);
        if (!existEmail)
            throw { type: 'Unauthorized', message: 'Email ou senha invalidos' };
        const descryptPassword = yield bcrypt_1.default.compareSync(userInfo.password, existEmail.password);
        if (!descryptPassword)
            throw { type: 'Unauthorized', message: 'Email ou senha invalidos' };
        const token = gerateToken(existEmail.id, existEmail.email, existEmail.role);
        return token;
    });
}
function editProfile(userInfo, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield userRepository.getUserById(id);
        if (!users)
            throw { type: 'Not Found', message: 'Usuario nao encontrado' };
        const saltRounds = 10;
        const encryptPassword = bcrypt_1.default.hashSync(userInfo.password, saltRounds);
        userInfo.password = encryptPassword;
        yield userRepository.editProfile(userInfo, id);
    });
}
function gerateToken(userId, email, role) {
    var _a;
    const SECRET = (_a = process.env.TOKEN_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
    const EXPERIES_IN = process.env.EXPERIES_IN;
    const level = role === 'user' ? 1 : (role === 'coach' ? 3 : 2);
    const payload = {
        userId,
        email,
        role,
        level
    };
    const jwtConfig = {
        expiresIn: EXPERIES_IN
    };
    const token = jsonwebtoken_1.default.sign(payload, SECRET, jwtConfig);
    return token;
}
