import { Router } from "express"; 
import userRouter from "./userRouter";
import coachRouter from "./coachRouter";
import athleteRouter from "./athleteRouter";

const router = Router(); 

//basta adicionar como a rota abaixo para criar uma nova rota para api consumir
router.use(userRouter);
router.use(coachRouter);
router.use(athleteRouter);

export default router;