package it.rubrica.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Contatto della rubrica. Immutabile: ogni modifica produce una nuova istanza.
 * {@code id} è {@code null} per una persona non ancora salvata (id autonumerante sul DB).
 */
public record Persona(
        Integer id,
        @NotBlank(message = "Inserisci il nome")
        @Size(max = 100, message = "Il nome può avere al massimo {max} caratteri")
        String nome,

        @NotBlank(message = "Inserisci il cognome")
        @Size(max = 100, message = "Il cognome può avere al massimo {max} caratteri")
        String cognome,

        @Size(max = 255, message = "L'indirizzo può avere al massimo {max} caratteri")
        String indirizzo,

        @NotBlank(message = "Inserisci il numero di telefono")
        @Size(max = 30, message = "Il telefono può avere al massimo {max} caratteri")
        @Pattern(regexp = "^[+0-9 ()-]*$", message = "Usa solo cifre, spazi e i simboli + ( ) -")
        String telefono,

        @NotNull(message = "Inserisci l'età")
        @Min(value = 0, message = "L'età deve essere tra 0 e 150")
        @Max(value = 150, message = "L'età deve essere tra 0 e 150")
        Integer eta) {

    public static Persona vuota() {
        return new Persona(null, "", "", "", "", null);
    }

    public Persona withId(Integer newId) {
        return new Persona(newId, nome, cognome, indirizzo, telefono, eta);
    }

    @JsonIgnore
    public boolean isNuova() {
        return id == null;
    }
}
