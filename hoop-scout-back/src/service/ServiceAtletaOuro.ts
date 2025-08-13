import { AtletaOuro } from "../entity/AtletaOuro";
import * as atletaOuroRepository from "../repositories/RepositoryAtletaOuro";

export async function create(dados: Omit<AtletaOuro, 'id_atleta_ouro'>): Promise<number> {
    // Validação dos percentuais
    const camposPercentuais = ['tiro_ideal', 'assistencia_ideal', 'livre_ideal', 'tres_ideal'] as const;
    for (const campo of camposPercentuais) {
        if (dados[campo] < 0 || dados[campo] > 100) {
            throw { type: 'Bad Request', message: `${campo} deve estar entre 0 e 100%` };
        }
    }

    // Validação da idade
    if (dados.idade_categoria > 18) {
        throw { type: 'Bad Request', message: 'Idade da categoria não pode ser maior que 18 anos' };
    }

    // Validação da altura (entre 1.0m e 2.5m seria razoável)
    if (dados.altura_ideal < 1.0 || dados.altura_ideal > 2.5) {
        throw { type: 'Bad Request', message: 'Altura ideal deve estar entre 1.0m e 2.5m' };
    }

    // Validação do peso (entre 30kg e 150kg seria razoável para jovens atletas)
    if (dados.peso_ideal < 30 || dados.peso_ideal > 150) {
        throw { type: 'Bad Request', message: 'Peso ideal deve estar entre 30kg e 150kg' };
    }

    const id = await atletaOuroRepository.create(dados);
    return id;
}

export async function getById(id: number): Promise<AtletaOuro> {
    const dados = await atletaOuroRepository.getById(id);
    
    if (!dados) {
        throw { type: 'Not Found', message: 'Dados do atleta ouro não encontrados' };
    }

    return dados;
}

export async function getByIdadeCategoria(idade: number): Promise<AtletaOuro> {
    if (idade > 18) {
        throw { type: 'Bad Request', message: 'Idade não pode ser maior que 18 anos' };
    }

    const dados = await atletaOuroRepository.getByIdadeCategoria(idade);
    
    if (!dados) {
        throw { type: 'Not Found', message: 'Dados do atleta ouro não encontrados para esta idade' };
    }

    return dados;
}

export async function update(id: number, dados: Partial<Omit<AtletaOuro, 'id_atleta_ouro'>>): Promise<void> {
    const existingDados = await atletaOuroRepository.getById(id);
    
    if (!existingDados) {
        throw { type: 'Not Found', message: 'Dados do atleta ouro não encontrados' };
    }

    // Validação dos percentuais
    const camposPercentuais = ['tiro_ideal', 'assistencia_ideal', 'livre_ideal', 'tres_ideal'] as const;
    for (const campo of camposPercentuais) {
        if (dados[campo] !== undefined && (dados[campo] < 0 || dados[campo] > 100)) {
            throw { type: 'Bad Request', message: `${campo} deve estar entre 0 e 100%` };
        }
    }

    if (dados.idade_categoria !== undefined && dados.idade_categoria > 18) {
        throw { type: 'Bad Request', message: 'Idade da categoria não pode ser maior que 18 anos' };
    }

    if (dados.altura_ideal !== undefined && (dados.altura_ideal < 1.0 || dados.altura_ideal > 2.5)) {
        throw { type: 'Bad Request', message: 'Altura ideal deve estar entre 1.0m e 2.5m' };
    }

    if (dados.peso_ideal !== undefined && (dados.peso_ideal < 30 || dados.peso_ideal > 150)) {
        throw { type: 'Bad Request', message: 'Peso ideal deve estar entre 30kg e 150kg' };
    }

    await atletaOuroRepository.update(id, dados);
}

export async function remove(id: number): Promise<void> {
    const existingDados = await atletaOuroRepository.getById(id);
    
    if (!existingDados) {
        throw { type: 'Not Found', message: 'Dados do atleta ouro não encontrados' };
    }

    await atletaOuroRepository.remove(id);
}
