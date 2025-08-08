import { Router } from "express";
import { ControllerUser } from "../controller/ControllerUser";
import schemaValidator from "../middlewares/schemaValidator";
import { userSchema, loginSchema } from "../schemas/userSchema";
import { validateTokenAuth } from "../middlewares/authMiddleware";
import { validateTokenCoachAuth } from "../middlewares/authCoachMiddleware";
import { validateTokenAthleteAuth } from "../middlewares/authAthleteMiddleware";

const userRouter = Router();
const controllerUser = new ControllerUser();

//SO SEGUIR A MESMA ESTRUTURA ABAIXO PARA AS DEMAIS ROTAS DESSE CONTROLLER
userRouter.get('/user/profile', validateTokenAuth,controllerUser.getInfo.bind(controllerUser));
userRouter.post('/signup', schemaValidator(userSchema), controllerUser.signup.bind(controllerUser));
userRouter.post('/login', schemaValidator(loginSchema), controllerUser.login.bind(controllerUser));
userRouter.put('/user/edit', validateTokenAuth, controllerUser.editProfile.bind(controllerUser)); 
userRouter.post('/user/auth',validateTokenAuth, controllerUser.verifyAuthUser.bind(controllerUser));
userRouter.post('/athlete/auth',validateTokenAthleteAuth, controllerUser.verifyAuthAthlete.bind(controllerUser));
userRouter.post('/coach/auth',validateTokenCoachAuth, controllerUser.verifyAuthCoach.bind(controllerUser));

export default userRouter;