import { Router } from "express";
import { ControllerCoach } from "../controller/ControllerCoach";
import schemaValidator from "../middlewares/schemaValidator";
import { validateTokenCoachAuth } from "../middlewares/authCoachMiddleware";
import { ratingSchema } from "../schemas/ratingSchema";

const coachRouter = Router();
const controllerCoach = new ControllerCoach();

//SO SEGUIR A MESMA ESTRUTURA ABAIXO PARA AS DEMAIS ROTAS DESSE CONTROLLER
coachRouter.get('/all/athletes', validateTokenCoachAuth,controllerCoach.getAllAthlete.bind(controllerCoach));
coachRouter.get('/athlete/:id', validateTokenCoachAuth, controllerCoach.getEspecificAthlete.bind(controllerCoach));
coachRouter.post('/grade/:id', validateTokenCoachAuth, schemaValidator(ratingSchema), controllerCoach.publishAthleteGrade.bind(controllerCoach));

export default coachRouter;