package it.rubrica.repository;

import it.rubrica.model.Persona;

import java.util.List;
import java.util.Optional;

public interface PersonaRepository {

    List<Persona> findAll();

    Optional<Persona> findById(int id);

    Persona insert(Persona persona);

    boolean update(Persona persona);

    boolean deleteById(int id);
}
