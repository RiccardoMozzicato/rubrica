package it.rubrica.model;

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
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Size(max = 100) String cognome,
        @Size(max = 255) String indirizzo,
        @NotBlank @Size(max = 30) @Pattern(regexp = "^[+0-9 ()-]*$", message = "numero di telefono non valido") String telefono,
        @NotNull @Min(0) @Max(150) Integer eta) {

    public static Persona vuota() {
        return new Persona(null, "", "", "", "", null);
    }

    public Persona withId(Integer newId) {
        return new Persona(newId, nome, cognome, indirizzo, telefono, eta);
    }

    public boolean isNuova() {
        return id == null;
    }
}
