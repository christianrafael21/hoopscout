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
exports.ControllerAthlete = void 0;
class ControllerAthlete {
    getInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).json("athleta json");
        });
    }
    probailityCalc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send("json do calculo");
        });
    }
    modelAthlete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send("json atleta modelo");
        });
    }
}
exports.ControllerAthlete = ControllerAthlete;
