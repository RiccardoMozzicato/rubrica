package it.rubrica.repository;

import it.rubrica.model.Persona;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.JdbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.simple.JdbcClient;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@JdbcTest
@Import(JdbcPersonaRepository.class)
class JdbcPersonaRepositoryTest {

    @Autowired
    private PersonaRepository repository;

    @Autowired
    private JdbcClient jdbcClient;

    @BeforeEach
    void pulisciTabella() {
        jdbcClient.sql("DELETE FROM lista_contatti").update();
    }

    @Test
    void insertAssegnaIdAutonumerante() {
        Persona salvata = repository.insert(new Persona(null, "Mario", "Rossi", "Via Roma 1", "333", 40));

        assertThat(salvata.id()).isNotNull();
        assertThat(repository.findById(salvata.id())).contains(salvata);
    }

    @Test
    void updateModificaIDatiDellaPersona() {
        Persona salvata = repository.insert(new Persona(null, "Mario", "Rossi", "Via Roma 1", "333", 40));
        Persona modificata = new Persona(salvata.id(), "Mario", "Bianchi", "Via Po 2", "444", 41);

        assertThat(repository.update(modificata)).isTrue();
        assertThat(repository.findById(salvata.id())).contains(modificata);
    }

    @Test
    void deleteRimuoveSoloLaPersonaIndicata() {
        Persona prima = repository.insert(new Persona(null, "A", "A", null, "1", 20));
        Persona mezzo = repository.insert(new Persona(null, "B", "B", null, "2", 30));
        Persona ultima = repository.insert(new Persona(null, "C", "C", null, "3", 40));

        assertThat(repository.deleteById(mezzo.id())).isTrue();
        assertThat(repository.findAll()).containsExactly(prima, ultima);
    }

    @Test
    void operazioniSuIdInesistenteRestituisconoFalse() {
        assertThat(repository.findById(999)).isEmpty();
        assertThat(repository.deleteById(999)).isFalse();
        assertThat(repository.update(new Persona(999, "X", "Y", null, "1", 1))).isFalse();
    }
}
