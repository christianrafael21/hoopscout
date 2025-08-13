-- Opcional: schema dedicado
-- CREATE SCHEMA IF NOT EXISTS app;
-- SET search_path TO app, public;

-- Tipo enumerado para o papel do usuário
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_tipo') THEN
    CREATE TYPE user_tipo AS ENUM ('ADMIN','COACH','ATLETA');
  END IF;
END$$;

-- -----------------------------
-- Tabelas de referência
-- -----------------------------
CREATE TABLE IF NOT EXISTS categoria_idade (
  id_categoria      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_categoria    VARCHAR(80) NOT NULL,
  idade_limite      SMALLINT NOT NULL,
  CONSTRAINT ck_categoria_limite CHECK (idade_limite <= 18)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo              user_tipo NOT NULL,
  email             VARCHAR(255) NOT NULL UNIQUE,
  senha             VARCHAR(255) NOT NULL,
  primeiro_nome     VARCHAR(80)  NOT NULL,
  ultimo_nome       VARCHAR(80)  NOT NULL,
  id_categoria      INTEGER NULL,
  CONSTRAINT fk_usuarios_categoria
    FOREIGN KEY (id_categoria) REFERENCES categoria_idade (id_categoria)
      ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS auditoria_usuario (
  id_evento         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data_evento       DATE NOT NULL,
  nome_autor        VARCHAR(120) NOT NULL,
  id_autor          INTEGER NOT NULL,
  CONSTRAINT fk_auditoria_autor
    FOREIGN KEY (id_autor) REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS atleta_ouro (
  id_atleta_ouro    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idade_categoria   SMALLINT NOT NULL,
  peso_ideal        NUMERIC(5,2) NOT NULL,   -- kg
  altura_ideal      NUMERIC(4,2) NOT NULL,   -- m (ex.: 1.85)
  tiro_ideal        SMALLINT NOT NULL,
  assistencia_ideal SMALLINT NOT NULL,
  livre_ideal       SMALLINT NOT NULL,
  tres_ideal        SMALLINT NOT NULL,
  CONSTRAINT ck_ouro_perc CHECK (
    tiro_ideal BETWEEN 0 AND 100 AND
    assistencia_ideal BETWEEN 0 AND 100 AND
    livre_ideal BETWEEN 0 AND 100 AND
    tres_ideal BETWEEN 0 AND 100
  )
);

CREATE TABLE IF NOT EXISTS dados_fisicos (
  id_dados_fisicos  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idade             SMALLINT NOT NULL,
  altura            NUMERIC(4,2) NOT NULL,   -- m
  peso              NUMERIC(5,2) NOT NULL,   -- kg
  CONSTRAINT ck_fisicos_idade CHECK (idade <= 18)
);

CREATE TABLE IF NOT EXISTS dados_tecnicos (
  id_dados_tecnicos INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tiro_livre        SMALLINT NOT NULL,
  arremesso_tres    SMALLINT NOT NULL,
  arremesso_livre   SMALLINT NOT NULL,
  assistencias      SMALLINT NOT NULL,
  CONSTRAINT ck_tecnicos_perc CHECK (
    tiro_livre BETWEEN 0 AND 100 AND
    arremesso_tres BETWEEN 0 AND 100 AND
    arremesso_livre BETWEEN 0 AND 100 AND
    assistencias BETWEEN 0 AND 100
  )
);

-- -----------------------------
-- Núcleo: histórico, avaliação, relatório, resultado
-- -----------------------------
CREATE TABLE IF NOT EXISTS historico_avaliacoes (
  id_historico      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data              DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS avaliacao (
  id_avaliacao      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data              DATE NOT NULL,
  id_atleta_ouro    INTEGER NULL,
  id_dados_fisicos  INTEGER NOT NULL,
  id_dados_tecnicos INTEGER NOT NULL,
  CONSTRAINT fk_av_ouro
    FOREIGN KEY (id_atleta_ouro) REFERENCES atleta_ouro (id_atleta_ouro)
      ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_av_fis
    FOREIGN KEY (id_dados_fisicos) REFERENCES dados_fisicos (id_dados_fisicos)
      ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_av_tec
    FOREIGN KEY (id_dados_tecnicos) REFERENCES dados_tecnicos (id_dados_tecnicos)
      ON UPDATE CASCADE ON DELETE RESTRICT
);

-- N:N avaliação <-> histórico
CREATE TABLE IF NOT EXISTS avaliacao_historico (
  id_avaliacao      INTEGER NOT NULL,
  id_historico      INTEGER NOT NULL,
  PRIMARY KEY (id_avaliacao, id_historico),
  CONSTRAINT fk_avhist_av
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_avhist_hist
    FOREIGN KEY (id_historico) REFERENCES historico_avaliacoes (id_historico)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS relatorio (
  id_relatorio      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data              DATE NOT NULL,
  id_avaliacao      INTEGER NOT NULL,
  CONSTRAINT fk_rel_av
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao)
      ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS resultado (
  id_resultado      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nota_media        NUMERIC(4,2) NOT NULL,
  id_avaliacao      INTEGER NOT NULL,
  id_relatorio      INTEGER NOT NULL,
  CONSTRAINT ck_resultado_nota CHECK (nota_media BETWEEN 0 AND 10),
  CONSTRAINT fk_res_av
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_res_rel
    FOREIGN KEY (id_relatorio) REFERENCES relatorio (id_relatorio)
      ON UPDATE CASCADE ON DELETE CASCADE
);

-- -----------------------------
-- Associações com usuários
-- -----------------------------
CREATE TABLE IF NOT EXISTS lesao (
  id_lesao          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo              VARCHAR(80) NOT NULL,
  tempo_recuperacao INTEGER NOT NULL,  -- dias
  id_atleta         INTEGER NOT NULL,
  CONSTRAINT fk_lesao_atleta
    FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS atleta_relatorio (
  id_relatorio      INTEGER NOT NULL,
  id_atleta         INTEGER NOT NULL,
  PRIMARY KEY (id_relatorio, id_atleta),
  CONSTRAINT fk_atlrel_rel
    FOREIGN KEY (id_relatorio) REFERENCES relatorio (id_relatorio)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_atlrel_atl
    FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS atleta_avaliacao (
  id_atleta         INTEGER NOT NULL,
  id_avaliacao      INTEGER NOT NULL,
  PRIMARY KEY (id_atleta, id_avaliacao),
  CONSTRAINT fk_atlav_atl
    FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_atlav_av
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coach_coord_atleta (
  id_coach          INTEGER NOT NULL,
  id_atleta         INTEGER NOT NULL,
  PRIMARY KEY (id_coach, id_atleta),
  CONSTRAINT fk_coachatl_coach
    FOREIGN KEY (id_coach)  REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_coachatl_atl
    FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coach_avaliacao (
  id_coach          INTEGER NOT NULL,
  id_avaliacao      INTEGER NOT NULL,
  PRIMARY KEY (id_coach, id_avaliacao),
  CONSTRAINT fk_coachav_coach
    FOREIGN KEY (id_coach)     REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_coachav_av
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coach_relatorio (
  id_coach          INTEGER NOT NULL,
  id_relatorio      INTEGER NOT NULL,
  PRIMARY KEY (id_coach, id_relatorio),
  CONSTRAINT fk_coachrel_coach
    FOREIGN KEY (id_coach)     REFERENCES usuarios (id_usuario)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_coachrel_rel
    FOREIGN KEY (id_relatorio) REFERENCES relatorio (id_relatorio)
      ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS relatorio_historico (
  id_relatorio      INTEGER NOT NULL,
  id_historico      INTEGER NOT NULL,
  PRIMARY KEY (id_relatorio, id_historico),
  CONSTRAINT fk_relhist_rel
    FOREIGN KEY (id_relatorio) REFERENCES relatorio (id_relatorio)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_relhist_hist
    FOREIGN KEY (id_historico) REFERENCES historico_avaliacoes (id_historico)
      ON UPDATE CASCADE ON DELETE CASCADE
);
