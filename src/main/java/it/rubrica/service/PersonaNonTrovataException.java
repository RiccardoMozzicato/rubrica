package it.rubrica.service;

public class PersonaNonTrovataException extends RuntimeException {

    public PersonaNonTrovataException(int id) {
        super("Persona con id " + id + " non trovata");
    }
}
