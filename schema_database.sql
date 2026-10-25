CREATE DATABASE IF NOT EXISTS rubrica
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rubrica.lista_contatti (
    id        INT          NOT NULL AUTO_INCREMENT,
    nome      VARCHAR(100) NOT NULL,
    cognome   VARCHAR(100) NOT NULL,
    indirizzo VARCHAR(255),
    telefono  VARCHAR(30)  NOT NULL,
    eta       INT          NOT NULL,
    PRIMARY KEY (id)
);
