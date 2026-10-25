package it.rubrica.controller;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;

@WebMvcTest(SpaController.class)
class SpaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void rootRimandaAlFrontend() throws Exception {
        mockMvc.perform(get("/")).andExpect(redirectedUrl("/app/"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"/app", "/app/", "/app/nuovo", "/app/modifica/3"})
    void routeClientSideInoltranoAIndexHtml(String path) throws Exception {
        mockMvc.perform(get(path)).andExpect(forwardedUrl("/app/index.html"));
    }
}
