import { Router } from "express";
import { validateTokenAthleteAuth } from "../middlewares/authAthleteMiddleware";
import { ControllerAthlete } from "../controller/ControllerAthlete";

const athleteRouter = Router();
const controllerAthlete = new ControllerAthlete();

//SO SEGUIR A MESMA ESTRUTURA ABAIXO PARA AS DEMAIS ROTAS DESSE CONTROLLER
athleteRouter.get('/athlete', validateTokenAthleteAuth,controllerAthlete.getInfo.bind(controllerAthlete));
athleteRouter.get('/probability', validateTokenAthleteAuth, controllerAthlete.probailityCalc.bind(controllerAthlete));
athleteRouter.get('/model', validateTokenAthleteAuth, controllerAthlete.modelAthlete.bind(controllerAthlete));

export default athleteRouter;