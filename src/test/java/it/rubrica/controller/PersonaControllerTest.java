package it.rubrica.controller;

import it.rubrica.model.Persona;
import it.rubrica.service.PersonaNonTrovataException;
import it.rubrica.service.PersonaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(PersonaController.class)
class PersonaControllerTest {

    private static final Persona MARIO = new Persona(1, "Mario", "Rossi", "Via Roma 1", "3331234567", 40);

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PersonaService personaService;

    @Test
    void listaMostraLePersone() throws Exception {
        when(personaService.elencaTutte()).thenReturn(List.of(MARIO));

        mockMvc.perform(get("/lista"))
                .andExpect(status().isOk())
                .andExpect(view().name("lista"))
                .andExpect(model().attribute("persone", List.of(MARIO)));
    }

    @Test
    void editorSenzaIdMostraFormVuoto() throws Exception {
        mockMvc.perform(get("/editor"))
                .andExpect(status().isOk())
                .andExpect(view().name("editor"))
                .andExpect(model().attribute("persona", Persona.vuota()));
    }

    @Test
    void editorConIdMostraPersonaCompilata() throws Exception {
        when(personaService.trovaPerId(1)).thenReturn(MARIO);

        mockMvc.perform(get("/editor").param("id", "1"))
                .andExpect(view().name("editor"))
                .andExpect(model().attribute("persona", MARIO));
    }

    @Test
    void editorConIdInesistenteRestituisce404() throws Exception {
        when(personaService.trovaPerId(99)).thenThrow(new PersonaNonTrovataException(99));

        mockMvc.perform(get("/editor").param("id", "99"))
                .andExpect(status().isNotFound())
                .andExpect(view().name("errore"));
    }

    @Test
    void salvaValidoRimandaAllaLista() throws Exception {
        mockMvc.perform(post("/salva")
                        .param("nome", "Mario")
                        .param("cognome", "Rossi")
                        .param("indirizzo", "Via Roma 1")
                        .param("telefono", "3331234567")
                        .param("eta", "40"))
                .andExpect(redirectedUrl("/lista"));

        verify(personaService).salva(new Persona(null, "Mario", "Rossi", "Via Roma 1", "3331234567", 40));
    }

    @Test
    void salvaNonValidoRimaneNellEditor() throws Exception {
        mockMvc.perform(post("/salva").param("nome", "").param("telefono", "abc"))
                .andExpect(status().isOk())
                .andExpect(view().name("editor"))
                .andExpect(model().attributeHasFieldErrors("persona", "nome", "cognome", "telefono", "eta"));

        verify(personaService, never()).salva(any());
    }

    @Test
    void eliminaRimandaAllaLista() throws Exception {
        mockMvc.perform(post("/elimina/1"))
                .andExpect(redirectedUrl("/lista"));

        verify(personaService).elimina(1);
    }
}
