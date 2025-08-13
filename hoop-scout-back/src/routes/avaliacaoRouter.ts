import { Router } from "express";
import { ControllerDadosFisicos } from "../controller/ControllerDadosFisicos";
import { ControllerDadosTecnicos } from "../controller/ControllerDadosTecnicos";
import { ControllerAtletaOuro } from "../controller/ControllerAtletaOuro";
import { ControllerAvaliacao } from "../controller/ControllerAvaliacao";
import schemaValidator from "../middlewares/schemaValidator";
import { validateTokenAuth as authMiddleware } from "../middlewares/authMiddleware";
import { validateTokenCoachAuth as authCoachMiddleware } from "../middlewares/authCoachMiddleware";
import { validateTokenAthleteAuth as authAthleteMiddleware } from "../middlewares/authAthleteMiddleware";
import { 
    dadosFisicosSchema, 
    dadosTecnicosSchema, 
    atletaOuroSchema,
    avaliacaoSchema 
} from "../schemas/avaliacaoSchema";

const avaliacaoRouter = Router();
const controllerDadosFisicos = new ControllerDadosFisicos();
const controllerDadosTecnicos = new ControllerDadosTecnicos();
const controllerAtletaOuro = new ControllerAtletaOuro();
const controllerAvaliacao = new ControllerAvaliacao();

// Rotas para dados físicos
avaliacaoRouter.post("/dados-fisicos", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(dadosFisicosSchema),
    controllerDadosFisicos.create
);
avaliacaoRouter.get("/dados-fisicos/:id", authMiddleware, controllerDadosFisicos.getById);
avaliacaoRouter.put("/dados-fisicos/:id", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(dadosFisicosSchema),
    controllerDadosFisicos.update
);
avaliacaoRouter.delete("/dados-fisicos/:id", authMiddleware, authCoachMiddleware, controllerDadosFisicos.delete);

// Rotas para dados técnicos
avaliacaoRouter.post("/dados-tecnicos", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(dadosTecnicosSchema),
    controllerDadosTecnicos.create
);
avaliacaoRouter.get("/dados-tecnicos/:id", authMiddleware, controllerDadosTecnicos.getById);
avaliacaoRouter.put("/dados-tecnicos/:id", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(dadosTecnicosSchema),
    controllerDadosTecnicos.update
);
avaliacaoRouter.delete("/dados-tecnicos/:id", authMiddleware, authCoachMiddleware, controllerDadosTecnicos.delete);

// Rotas para atleta ouro
avaliacaoRouter.post("/atleta-ouro", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(atletaOuroSchema),
    controllerAtletaOuro.create
);
avaliacaoRouter.get("/atleta-ouro/:id", authMiddleware, controllerAtletaOuro.getById);
avaliacaoRouter.get("/atleta-ouro/idade/:idade", authMiddleware, controllerAtletaOuro.getByIdadeCategoria);
avaliacaoRouter.put("/atleta-ouro/:id", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(atletaOuroSchema),
    controllerAtletaOuro.update
);
avaliacaoRouter.delete("/atleta-ouro/:id", authMiddleware, authCoachMiddleware, controllerAtletaOuro.delete);

// Rotas para avaliação
avaliacaoRouter.post("/avaliacao", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(avaliacaoSchema),
    controllerAvaliacao.create
);
avaliacaoRouter.get("/avaliacao/:id", authMiddleware, controllerAvaliacao.getById);
avaliacaoRouter.get("/avaliacao/atleta/:id_atleta", authMiddleware, controllerAvaliacao.getByAtleta);
avaliacaoRouter.get("/avaliacao/historico/:id_atleta", authMiddleware, controllerAvaliacao.getHistoricoByAtleta);
avaliacaoRouter.put("/avaliacao/:id", 
    authMiddleware, 
    authCoachMiddleware, 
    schemaValidator(avaliacaoSchema),
    controllerAvaliacao.update
);
avaliacaoRouter.delete("/avaliacao/:id", authMiddleware, authCoachMiddleware, controllerAvaliacao.delete);

export { avaliacaoRouter };
