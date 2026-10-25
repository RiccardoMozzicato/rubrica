# Rubrica

Rubrica telefonica web: Spring Boot 4 (Java 21), viste JSP, persistenza JDBC su MySQL, packaging WAR per Tomcat.

## Architettura

```
controller/  PersonaController     -> HTTP + viste JSP (lista.jsp, editor.jsp)
service/     PersonaService        -> logica applicativa, transazioni
repository/  PersonaRepository     -> interfaccia di accesso ai dati
             JdbcPersonaRepository -> implementazione JDBC (JdbcClient) su `lista_contatti`
model/       Persona               -> record immutabile con validazione
```

| Metodo | Path           | Azione                                  |
|--------|----------------|-----------------------------------------|
| GET    | `/lista`       | tabella contatti (`lista.jsp`)          |
| GET    | `/editor`      | form vuoto — NUOVO                      |
| GET    | `/editor?id=N` | form compilato — MODIFICA               |
| POST   | `/salva`       | inserisce o aggiorna — SALVA            |
| POST   | `/elimina/{id}`| elimina — ELIMINA                       |

`/Rubrica/lista.jsp` (URL richiesto dalla consegna) reindirizza a `/Rubrica/lista`.

## Database

Credenziali (da consegna): host `localhost`, porta `3306`, db `rubrica`, utente `rubrica` / `rubrica`.
Sovrascrivibili con `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`.

Schema: [`schema_database.sql`](schema_database.sql). MySQL locale con Docker:

```bash
docker compose up -d
```

Senza Docker, da un client MySQL come root:

```sql
SOURCE schema_database.sql;
CREATE USER 'rubrica'@'localhost' IDENTIFIED BY 'rubrica';
GRANT ALL PRIVILEGES ON rubrica.* TO 'rubrica'@'localhost';
```

## Build ed esecuzione

```bash
./mvnw test              # unit + integration test (H2 in modalità MySQL)
./mvnw package           # -> target/Rubrica.war
./mvnw spring-boot:run   # esecuzione embedded su http://localhost:8080/Rubrica/lista.jsp
```

Deploy su Tomcat 11: copiare `target/Rubrica.war` in `$CATALINA_HOME/webapps/` e aprire
`http://localhost:8080/Rubrica/lista.jsp`.
