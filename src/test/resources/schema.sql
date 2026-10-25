-- Equivalente H2 della tabella in schema_database.sql
CREATE TABLE IF NOT EXISTS lista_contatti (
    id        INT          NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(100) NOT NULL,
    cognome   VARCHAR(100) NOT NULL,
    indirizzo VARCHAR(255),
    telefono  VARCHAR(30)  NOT NULL,
    eta       INT          NOT NULL,
    PRIMARY KEY (id)
);
