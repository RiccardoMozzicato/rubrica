package it.rubrica.controller;

import it.rubrica.service.PersonaNonTrovataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Errori delle pagine JSP; gli errori dell'API REST sono gestiti da {@code ApiExceptionHandler}. */
@ControllerAdvice(assignableTypes = PersonaController.class)
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(PersonaNonTrovataException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String personaNonTrovata(PersonaNonTrovataException ex, Model model) {
        log.warn(ex.getMessage());
        model.addAttribute("messaggio", ex.getMessage());
        return "errore";
    }
}
