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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.existEmail = existEmail;
exports.createUser = createUser;
exports.editProfile = editProfile;
const users = [
    {
        id: 1,
        name: 'Fabricio',
        email: 'fabricio@gmail.com',
        password: 'fabricio',
        role: 'user',
        createdAt: new Date(),
    },
    {
        id: 2,
        name: 'Jairo',
        email: 'jairo@gmail.com',
        password: 'jairo',
        role: 'user',
        createdAt: new Date(),
    }
];
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return users.find(user => user.id === id);
    });
}
function existEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return users.find(user => user.email === email);
    });
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastInd = users[users.length - 1].id;
        users.push({ id: lastInd + 1, name: user.name, email: user.email, password: user.password, role: 'user', createdAt: new Date() });
    });
}
function editProfile(user, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = users.findIndex(us => us.id === id);
        if (user.name)
            users[index].name = user.name;
        if (user.email)
            users[index].email = user.email;
        if (user.password)
            users[index].password = user.password;
    });
}
