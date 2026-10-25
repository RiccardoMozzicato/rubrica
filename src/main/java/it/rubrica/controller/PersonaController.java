package it.rubrica.controller;

import it.rubrica.model.Persona;
import it.rubrica.service.PersonaService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PersonaController {

    static final String VIEW_LISTA = "lista";
    static final String VIEW_EDITOR = "editor";
    static final String REDIRECT_LISTA = "redirect:/lista";

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping("/")
    public String home() {
        return REDIRECT_LISTA;
    }

    @GetMapping("/lista")
    public String lista(Model model) {
        model.addAttribute("persone", personaService.elencaTutte());
        return VIEW_LISTA;
    }

    /** NUOVO (senza id) o MODIFICA (con id). */
    @GetMapping("/editor")
    public String editor(@RequestParam(required = false) Integer id, Model model) {
        Persona persona = (id == null) ? Persona.vuota() : personaService.trovaPerId(id);
        model.addAttribute("persona", persona);
        return VIEW_EDITOR;
    }

    @PostMapping("/salva")
    public String salva(@Valid @ModelAttribute("persona") Persona persona, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return VIEW_EDITOR;
        }
        personaService.salva(persona);
        return REDIRECT_LISTA;
    }

    @PostMapping("/elimina/{id}")
    public String elimina(@PathVariable int id) {
        personaService.elimina(id);
        return REDIRECT_LISTA;
    }
}
