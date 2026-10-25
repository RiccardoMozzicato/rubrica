package it.rubrica.api;

import it.rubrica.model.Persona;
import it.rubrica.service.PersonaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

/** API JSON consumata dal frontend React. */
@RestController
@RequestMapping("/api/persone")
public class PersonaRestController {

    private final PersonaService personaService;

    public PersonaRestController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping
    public List<Persona> elenca() {
        return personaService.elencaTutte();
    }

    @GetMapping("/{id}")
    public Persona trova(@PathVariable int id) {
        return personaService.trovaPerId(id);
    }

    @PostMapping
    public ResponseEntity<Persona> crea(@Valid @RequestBody Persona persona) {
        Persona creata = personaService.salva(persona.withId(null));
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(creata.id())
                .toUri();
        return ResponseEntity.created(location).body(creata);
    }

    @PutMapping("/{id}")
    public Persona aggiorna(@PathVariable int id, @Valid @RequestBody Persona persona) {
        return personaService.salva(persona.withId(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void elimina(@PathVariable int id) {
        personaService.elimina(id);
    }
}
