package it.rubrica.api;

import it.rubrica.model.Persona;
import it.rubrica.service.PersonaNonTrovataException;
import it.rubrica.service.PersonaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PersonaRestController.class)
class PersonaRestControllerTest {

    private static final Persona MARIO = new Persona(1, "Mario", "Rossi", "Via Roma 1", "3331234567", 40);
    private static final String MARIO_JSON = """
            {"nome":"Mario","cognome":"Rossi","indirizzo":"Via Roma 1","telefono":"3331234567","eta":40}""";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PersonaService personaService;

    @Test
    void elencaRestituisceLePersoneInJson() throws Exception {
        when(personaService.elencaTutte()).thenReturn(List.of(MARIO));

        mockMvc.perform(get("/api/persone"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].cognome").value("Rossi"))
                .andExpect(jsonPath("$[0]", not(hasKey("nuova"))));
    }

    @Test
    void trovaInesistenteRestituisceProblemDetail404() throws Exception {
        when(personaService.trovaPerId(99)).thenThrow(new PersonaNonTrovataException(99));

        mockMvc.perform(get("/api/persone/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Persona con id 99 non trovata"));
    }

    @Test
    void creaIgnoraLIdNelBodyERestituisce201ConLocation() throws Exception {
        when(personaService.salva(MARIO.withId(null))).thenReturn(MARIO);

        mockMvc.perform(post("/api/persone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MARIO_JSON.replace("{", "{\"id\":42,")))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/persone/1"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void creaConDatiNonValidiRestituisceErroriPerCampo() throws Exception {
        mockMvc.perform(post("/api/persone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"\",\"telefono\":\"abc\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.nome").value("Inserisci il nome"))
                .andExpect(jsonPath("$.errors.cognome").exists())
                .andExpect(jsonPath("$.errors.telefono").value("Usa solo cifre, spazi e i simboli + ( ) -"))
                .andExpect(jsonPath("$.errors.eta").exists());

        verify(personaService, never()).salva(any());
    }

    @Test
    void creaConJsonMalformatoRestituisce400() throws Exception {
        mockMvc.perform(post("/api/persone")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"eta\":\"quaranta\""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").exists());
    }

    @Test
    void aggiornaUsaLIdDelPath() throws Exception {
        when(personaService.salva(MARIO)).thenReturn(MARIO);

        mockMvc.perform(put("/api/persone/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MARIO_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void eliminaRestituisce204() throws Exception {
        mockMvc.perform(delete("/api/persone/1"))
                .andExpect(status().isNoContent());

        verify(personaService).elimina(1);
    }

    @Test
    void eliminaInesistenteRestituisce404() throws Exception {
        doThrow(new PersonaNonTrovataException(99)).when(personaService).elimina(99);

        mockMvc.perform(delete("/api/persone/99"))
                .andExpect(status().isNotFound());
    }
}
