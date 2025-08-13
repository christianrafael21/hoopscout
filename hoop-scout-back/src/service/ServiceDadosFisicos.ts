import { DadosFisicos } from "../entity/DadosFisicos";
import * as dadosFisicosRepository from "../repositories/RepositoryDadosFisicos";

export async function create(dados: Omit<DadosFisicos, 'id_dados_fisicos'>): Promise<number> {
    // Validação da idade
    if (dados.idade > 18) {
        throw { type: 'Bad Request', message: 'Idade não pode ser maior que 18 anos' };
    }

    // Validação da altura (entre 1.0m e 2.5m seria razoável)
    if (dados.altura < 1.0 || dados.altura > 2.5) {
        throw { type: 'Bad Request', message: 'Altura deve estar entre 1.0m e 2.5m' };
    }

    // Validação do peso (entre 30kg e 150kg seria razoável para jovens atletas)
    if (dados.peso < 30 || dados.peso > 150) {
        throw { type: 'Bad Request', message: 'Peso deve estar entre 30kg e 150kg' };
    }

    const id = await dadosFisicosRepository.create(dados);
    return id;
}

export async function getById(id: number): Promise<DadosFisicos> {
    const dados = await dadosFisicosRepository.getById(id);
    
    if (!dados) {
        throw { type: 'Not Found', message: 'Dados físicos não encontrados' };
    }

    return dados;
}

export async function update(id: number, dados: Partial<Omit<DadosFisicos, 'id_dados_fisicos'>>): Promise<void> {
    const existingDados = await dadosFisicosRepository.getById(id);
    
    if (!existingDados) {
        throw { type: 'Not Found', message: 'Dados físicos não encontrados' };
    }

    if (dados.idade !== undefined && dados.idade > 18) {
        throw { type: 'Bad Request', message: 'Idade não pode ser maior que 18 anos' };
    }

    if (dados.altura !== undefined && (dados.altura < 1.0 || dados.altura > 2.5)) {
        throw { type: 'Bad Request', message: 'Altura deve estar entre 1.0m e 2.5m' };
    }

    if (dados.peso !== undefined && (dados.peso < 30 || dados.peso > 150)) {
        throw { type: 'Bad Request', message: 'Peso deve estar entre 30kg e 150kg' };
    }

    await dadosFisicosRepository.update(id, dados);
}

export async function remove(id: number): Promise<void> {
    const existingDados = await dadosFisicosRepository.getById(id);
    
    if (!existingDados) {
        throw { type: 'Not Found', message: 'Dados físicos não encontrados' };
    }

    await dadosFisicosRepository.remove(id);
}
