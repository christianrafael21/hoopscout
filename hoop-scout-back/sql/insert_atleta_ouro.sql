
-- SQL para inserir atletas ouro - Execute este SQL no seu banco de dados

-- Limpar dados existentes (opcional)
-- DELETE FROM atleta_ouro WHERE idade_categoria IN (12, 14, 15, 17, 18, 21);

-- Atleta Ouro Sub-12
INSERT INTO atleta_ouro (idade_categoria, peso_ideal, altura_ideal, tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal)
VALUES (12, 50.0, 1.60, 65, 6, 75, 55);

-- Atleta Ouro Sub-14
INSERT INTO atleta_ouro (idade_categoria, peso_ideal, altura_ideal, tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal)
VALUES (14, 58.0, 1.68, 70, 7, 80, 60);

-- Atleta Ouro Sub-15
INSERT INTO atleta_ouro (idade_categoria, peso_ideal, altura_ideal, tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal)
VALUES (15, 65.0, 1.75, 75, 8, 85, 65);

-- Atleta Ouro Sub-17
INSERT INTO atleta_ouro (idade_categoria, peso_ideal, altura_ideal, tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal)
VALUES (17, 72.0, 1.82, 78, 9, 88, 68);

-- Atleta Ouro Sub-18  
INSERT INTO atleta_ouro (idade_categoria, peso_ideal, altura_ideal, tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal)
VALUES (18, 75.0, 1.85, 80, 10, 90, 70);

-- Atleta Ouro Sub-21
INSERT INTO atleta_ouro (idade_categoria, peso_ideal, altura_ideal, tiro_ideal, assistencia_ideal, livre_ideal, tres_ideal)
VALUES (21, 80.0, 1.88, 85, 12, 92, 75);

-- Verificar se foi inserido corretamente:
SELECT 
    id_atleta_ouro,
    idade_categoria,
    peso_ideal,
    altura_ideal,
    tiro_ideal,
    assistencia_ideal,
    livre_ideal,
    tres_ideal
FROM atleta_ouro 
ORDER BY idade_categoria;
