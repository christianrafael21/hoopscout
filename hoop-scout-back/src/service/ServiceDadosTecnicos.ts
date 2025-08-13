import { DadosTecnicos } from "../entity/DadosTecnicos";
import * as dadosTecnicosRepository from "../repositories/RepositoryDadosTecnicos";

export async function create(dados: Omit<DadosTecnicos, 'id_dados_tecnicos'>): Promise<number> {
    // Validação dos percentuais
    const campos = ['tiro_livre', 'arremesso_tres', 'arremesso_livre', 'assistencias'] as const;
    for (const campo of campos) {
        if (dados[campo] < 0 || dados[campo] > 100) {
            throw { type: 'Bad Request', message: `${campo} deve estar entre 0 e 100%` };
        }
    }

    const id = await dadosTecnicosRepository.create(dados);
    return id;
}

export async function getById(id: number): Promise<DadosTecnicos> {
    const dados = await dadosTecnicosRepository.getById(id);
    
    if (!dados) {
        throw { type: 'Not Found', message: 'Dados técnicos não encontrados' };
    }

    return dados;
}

export async function update(id: number, dados: Partial<Omit<DadosTecnicos, 'id_dados_tecnicos'>>): Promise<void> {
    const existingDados = await dadosTecnicosRepository.getById(id);
    
    if (!existingDados) {
        throw { type: 'Not Found', message: 'Dados técnicos não encontrados' };
    }

    // Validação dos percentuais
    const campos = ['tiro_livre', 'arremesso_tres', 'arremesso_livre', 'assistencias'] as const;
    for (const campo of campos) {
        if (dados[campo] !== undefined && (dados[campo] < 0 || dados[campo] > 100)) {
            throw { type: 'Bad Request', message: `${campo} deve estar entre 0 e 100%` };
        }
    }

    await dadosTecnicosRepository.update(id, dados);
}

export async function remove(id: number): Promise<void> {
    const existingDados = await dadosTecnicosRepository.getById(id);
    
    if (!existingDados) {
        throw { type: 'Not Found', message: 'Dados técnicos não encontrados' };
    }

    await dadosTecnicosRepository.remove(id);
}
