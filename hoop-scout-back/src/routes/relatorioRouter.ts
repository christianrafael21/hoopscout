import { Router } from 'express';
import { relatorioController } from '../controller/ControllerRelatorio';
import { validateTokenAuth } from '../middlewares/authMiddleware';

const relatorioRouter = Router();

// Aplicar autenticação em todas as rotas
relatorioRouter.use(validateTokenAuth);

// Gerar relatório PDF de uma avaliação específica
// GET /relatorio/avaliacao/:idAvaliacao
relatorioRouter.get('/avaliacao/:idAvaliacao', relatorioController.gerarRelatorioAvaliacao);

// Gerar relatório PDF estatístico de um atleta
// GET /relatorio/estatisticas/:idAtleta
relatorioRouter.get('/estatisticas/:idAtleta', relatorioController.gerarRelatorioEstatisticas);

// Listar relatórios de um atleta
// GET /relatorio/atleta/:idAtleta
relatorioRouter.get('/atleta/:idAtleta', relatorioController.listarRelatoriosAtleta);

// Obter relatório específico por ID
// GET /relatorio/:id
relatorioRouter.get('/:id', relatorioController.obterRelatorio);

export { relatorioRouter };
