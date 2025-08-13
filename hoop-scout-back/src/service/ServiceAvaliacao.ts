import { Avaliacao, HistoricoAvaliacao } from "../entity/Avaliacao";
import * as avaliacaoRepository from "../repositories/RepositoryAvaliacao";
import * as dadosFisicosRepository from "../repositories/RepositoryDadosFisicos";
import * as dadosTecnicosRepository from "../repositories/RepositoryDadosTecnicos";
import * as atletaOuroRepository from "../repositories/RepositoryAtletaOuro";

export async function create(dados: Omit<Avaliacao, 'id_avaliacao' | 'nota_media' | 'dados_fisicos' | 'dados_tecnicos' | 'atleta_ouro'> & { id_atleta: number }, id_coach: number): Promise<number> {
    // Validar existência dos dados físicos e técnicos
    const dadosFisicos = await dadosFisicosRepository.getById(dados.id_dados_fisicos);
    if (!dadosFisicos) {
        throw { type: 'Not Found', message: 'Dados físicos não encontrados' };
    }

    const dadosTecnicos = await dadosTecnicosRepository.getById(dados.id_dados_tecnicos);
    if (!dadosTecnicos) {
        throw { type: 'Not Found', message: 'Dados técnicos não encontrados' };
    }

    // Validar atleta ouro se fornecido
    if (dados.id_atleta_ouro) {
        const atletaOuro = await atletaOuroRepository.getById(dados.id_atleta_ouro);
        if (!atletaOuro) {
            throw { type: 'Not Found', message: 'Atleta ouro não encontrado' };
        }
    }

    // Criar avaliação
    const { id_atleta, ...dadosAvaliacao } = dados;
    const id_avaliacao = await avaliacaoRepository.create(dadosAvaliacao);

    // Criar histórico
    const dataAtual = new Date();
    const id_historico = await avaliacaoRepository.createHistorico(dataAtual);

    // Vincular avaliação ao histórico
    await avaliacaoRepository.vincularHistorico(id_avaliacao, id_historico);

    // Vincular coach à avaliação
    await avaliacaoRepository.vincularCoach(id_avaliacao, id_coach);

    // Vincular atleta à avaliação
    await avaliacaoRepository.vincularAtleta(id_avaliacao, id_atleta);

    return id_avaliacao;
}

export async function getById(id: number): Promise<Avaliacao> {
    const avaliacao = await avaliacaoRepository.getById(id);
    
    if (!avaliacao) {
        throw { type: 'Not Found', message: 'Avaliação não encontrada' };
    }

    // Buscar dados relacionados
    const [dadosFisicos, dadosTecnicos] = await Promise.all([
        dadosFisicosRepository.getById(avaliacao.id_dados_fisicos),
        dadosTecnicosRepository.getById(avaliacao.id_dados_tecnicos)
    ]);

    // Calcular nota média baseada nos dados técnicos
    const notaMedia = calcularNotaMedia(dadosTecnicos, avaliacao.id_atleta_ouro);

    // Adicionar dados relacionados à avaliação
    avaliacao.dados_fisicos = dadosFisicos;
    avaliacao.dados_tecnicos = dadosTecnicos;
    avaliacao.nota_media = notaMedia;

    if (avaliacao.id_atleta_ouro) {
        const atletaOuro = await atletaOuroRepository.getById(avaliacao.id_atleta_ouro);
        avaliacao.atleta_ouro = atletaOuro;
    }

    return avaliacao;
}

export async function getByAtleta(id_atleta: number): Promise<Avaliacao[]> {
    const avaliacoes = await avaliacaoRepository.getByAtleta(id_atleta);
    
    // Buscar dados relacionados para cada avaliação
    const avaliacoesCompletas = await Promise.all(
        avaliacoes.map(avaliacao => getById(avaliacao.id_avaliacao))
    );

    return avaliacoesCompletas;
}

export async function getHistoricoByAtleta(id_atleta: number): Promise<HistoricoAvaliacao[]> {
    return await avaliacaoRepository.getHistoricoByAtleta(id_atleta);
}

export async function update(id: number, dados: Partial<Omit<Avaliacao, 'id_avaliacao' | 'nota_media' | 'dados_fisicos' | 'dados_tecnicos' | 'atleta_ouro'>>, id_coach: number): Promise<void> {
    const avaliacao = await avaliacaoRepository.getById(id);
    
    if (!avaliacao) {
        throw { type: 'Not Found', message: 'Avaliação não encontrada' };
    }

    // Verificar se o coach tem permissão para editar esta avaliação
    const temPermissao = await avaliacaoRepository.verificarPermissaoCoach(id, id_coach);
    if (!temPermissao) {
        throw { type: 'Forbidden', message: 'Você não tem permissão para editar esta avaliação' };
    }

    // Validar dados físicos se fornecidos
    if (dados.id_dados_fisicos) {
        const dadosFisicos = await dadosFisicosRepository.getById(dados.id_dados_fisicos);
        if (!dadosFisicos) {
            throw { type: 'Not Found', message: 'Dados físicos não encontrados' };
        }
    }

    // Validar dados técnicos se fornecidos
    if (dados.id_dados_tecnicos) {
        const dadosTecnicos = await dadosTecnicosRepository.getById(dados.id_dados_tecnicos);
        if (!dadosTecnicos) {
            throw { type: 'Not Found', message: 'Dados técnicos não encontrados' };
        }
    }

    // Validar atleta ouro se fornecido
    if (dados.id_atleta_ouro) {
        const atletaOuro = await atletaOuroRepository.getById(dados.id_atleta_ouro);
        if (!atletaOuro) {
            throw { type: 'Not Found', message: 'Atleta ouro não encontrado' };
        }
    }

    await avaliacaoRepository.update(id, dados);

    // Criar novo registro no histórico
    const dataAtual = new Date();
    const id_historico = await avaliacaoRepository.createHistorico(dataAtual);
    await avaliacaoRepository.vincularHistorico(id, id_historico);
}

export async function remove(id: number, id_coach: number): Promise<void> {
    const avaliacao = await avaliacaoRepository.getById(id);
    
    if (!avaliacao) {
        throw { type: 'Not Found', message: 'Avaliação não encontrada' };
    }

    // Verificar se o coach tem permissão para excluir esta avaliação
    const temPermissao = await avaliacaoRepository.verificarPermissaoCoach(id, id_coach);
    if (!temPermissao) {
        throw { type: 'Forbidden', message: 'Você não tem permissão para excluir esta avaliação' };
    }

    await avaliacaoRepository.remove(id);
}

function calcularNotaMedia(dadosTecnicos: any, id_atleta_ouro?: number): number {
    if (!dadosTecnicos) return 0;

    // Por enquanto, uma média simples dos dados técnicos
    const notas = [
        dadosTecnicos.tiro_livre,
        dadosTecnicos.arremesso_tres,
        dadosTecnicos.arremesso_livre,
        dadosTecnicos.assistencias
    ];

    const media = notas.reduce((acc, nota) => acc + nota, 0) / notas.length;
    
    // Converte para escala 0-10
    return (media / 100) * 10;
}
