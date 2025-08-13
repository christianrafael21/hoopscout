import { Router } from "express"; 
import userRouter from "./userRouter";
import coachRouter from "./coachRouter";
import athleteRouter from "./athleteRouter";
import { avaliacaoRouter } from "./avaliacaoRouter";
import { relatorioRouter } from "./relatorioRouter";

const router = Router(); 

// Rotas da API
router.use(userRouter);
router.use(coachRouter);
router.use(athleteRouter);
router.use("/avaliacao", avaliacaoRouter);
router.use("/relatorio", relatorioRouter);

export default router;