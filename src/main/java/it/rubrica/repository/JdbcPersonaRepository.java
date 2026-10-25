package it.rubrica.repository;

import it.rubrica.model.Persona;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/** Accesso alla tabella {@code lista_contatti} via JDBC. */
@Repository
public class JdbcPersonaRepository implements PersonaRepository {

    private static final String SELECT_COLUMNS =
            "SELECT id, nome, cognome, indirizzo, telefono, eta FROM lista_contatti";

    private static final RowMapper<Persona> ROW_MAPPER = (rs, rowNum) -> new Persona(
            rs.getInt("id"),
            rs.getString("nome"),
            rs.getString("cognome"),
            rs.getString("indirizzo"),
            rs.getString("telefono"),
            rs.getInt("eta"));

    private final JdbcClient jdbcClient;

    public JdbcPersonaRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public List<Persona> findAll() {
        return jdbcClient.sql(SELECT_COLUMNS + " ORDER BY id")
                .query(ROW_MAPPER)
                .list();
    }

    @Override
    public Optional<Persona> findById(int id) {
        return jdbcClient.sql(SELECT_COLUMNS + " WHERE id = :id")
                .param("id", id)
                .query(ROW_MAPPER)
                .optional();
    }

    @Override
    public Persona insert(Persona persona) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcClient.sql("""
                        INSERT INTO lista_contatti (nome, cognome, indirizzo, telefono, eta)
                        VALUES (:nome, :cognome, :indirizzo, :telefono, :eta)""")
                .paramSource(persona)
                .update(keyHolder, "id");
        return persona.withId(keyHolder.getKeyAs(Number.class).intValue());
    }

    @Override
    public boolean update(Persona persona) {
        int rows = jdbcClient.sql("""
                        UPDATE lista_contatti
                        SET nome = :nome, cognome = :cognome, indirizzo = :indirizzo,
                            telefono = :telefono, eta = :eta
                        WHERE id = :id""")
                .paramSource(persona)
                .update();
        return rows == 1;
    }

    @Override
    public boolean deleteById(int id) {
        return jdbcClient.sql("DELETE FROM lista_contatti WHERE id = :id")
                .param("id", id)
                .update() == 1;
    }
}
