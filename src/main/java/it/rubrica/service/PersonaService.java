package it.rubrica.service;

import it.rubrica.model.Persona;
import it.rubrica.repository.PersonaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;

    public PersonaService(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    @Transactional(readOnly = true)
    public List<Persona> elencaTutte() {
        return personaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Persona trovaPerId(int id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new PersonaNonTrovataException(id));
    }

    /** Inserisce la persona se nuova, altrimenti la aggiorna. */
    @Transactional
    public Persona salva(Persona persona) {
        if (persona.isNuova()) {
            return personaRepository.insert(persona);
        }
        if (!personaRepository.update(persona)) {
            throw new PersonaNonTrovataException(persona.id());
        }
        return persona;
    }

    @Transactional
    public void elimina(int id) {
        if (!personaRepository.deleteById(id)) {
            throw new PersonaNonTrovataException(id);
        }
    }
}
