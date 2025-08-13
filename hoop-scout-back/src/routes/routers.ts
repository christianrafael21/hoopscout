import { Router } from "express"; 
import userRouter from "./userRouter";
import coachRouter from "./coachRouter";
import athleteRouter from "./athleteRouter";
import { avaliacaoRouter } from "./avaliacaoRouter";

const router = Router(); 

// Rotas da API
router.use(userRouter);
router.use(coachRouter);
router.use(athleteRouter);
router.use("/avaliacao", avaliacaoRouter);

export default router;