package it.rubrica.api;

import it.rubrica.service.PersonaNonTrovataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/** Traduce le eccezioni dell'API in risposte RFC 9457 (application/problem+json). */
@RestControllerAdvice(assignableTypes = PersonaRestController.class)
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(PersonaNonTrovataException.class)
    public ProblemDetail personaNonTrovata(PersonaNonTrovataException ex) {
        log.warn(ex.getMessage());
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /** 400 con la mappa campo -> messaggio, così il frontend può mostrarli accanto ai campi. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail datiNonValidi(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Controlla i campi evidenziati");
        problem.setProperty("errors", errors);
        return problem;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail jsonNonLeggibile(HttpMessageNotReadableException ex) {
        log.warn("Richiesta non leggibile: {}", ex.getMessage());
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Il corpo della richiesta non è un JSON valido");
    }
}
