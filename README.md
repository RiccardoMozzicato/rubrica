# Rubrica

Rubrica telefonica web: Spring Boot 4 (Java 21), persistenza JDBC su MySQL, packaging WAR per Tomcat.
Due interfacce sullo stesso backend:

- **Frontend React** (`/Rubrica/app/`) — SPA in `frontend/`, consuma l'API REST
- **Pagine JSP** (`/Rubrica/lista.jsp`) — `lista.jsp` / `editor.jsp` richieste dalla traccia

## Architettura

```
api/         PersonaRestController -> API REST JSON (/api/persone), errori RFC 9457
controller/  PersonaController     -> HTTP + viste JSP (lista.jsp, editor.jsp)
             SpaController         -> serve la SPA React e le sue route client-side
service/     PersonaService        -> logica applicativa, transazioni
repository/  PersonaRepository     -> interfaccia di accesso ai dati
             JdbcPersonaRepository -> implementazione JDBC (JdbcClient) su `lista_contatti`
model/       Persona               -> record immutabile con validazione
```

### API REST

| Metodo | Path                | Risposta                                     |
|--------|---------------------|----------------------------------------------|
| GET    | `/api/persone`      | 200 elenco contatti                          |
| GET    | `/api/persone/{id}` | 200 contatto, 404 se assente                 |
| POST   | `/api/persone`      | 201 + `Location`, 400 con `errors` per campo |
| PUT    | `/api/persone/{id}` | 200, 400, 404                                |
| DELETE | `/api/persone/{id}` | 204, 404                                     |

### Pagine JSP

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

## Frontend

React 19 + TypeScript + Vite + Tailwind v4 + React Router, test con Vitest e Testing Library.
I contatti sono raggruppati per iniziale del cognome con un indice A–Z laterale, come una rubrica cartacea.

```bash
cd frontend && npm install
npm run dev        # http://localhost:5173/Rubrica/app/ (proxy di /Rubrica/api verso :8080)
npm test           # Vitest
npm run typecheck
```

Il build Maven scarica Node (frontend-maven-plugin), esegue `npm ci && npm run build` e include
`frontend/dist` nel WAR sotto `static/app`. Per buildare solo il backend:
`./mvnw package -Dskip.npm -Dskip.installnodenpm`.

## Build ed esecuzione

```bash
./mvnw test              # test backend (H2 in modalità MySQL)
./mvnw package           # -> target/Rubrica.war (frontend incluso)
java -jar target/Rubrica.war   # http://localhost:8080/Rubrica/
```

Deploy su Tomcat 11: copiare `target/Rubrica.war` in `$CATALINA_HOME/webapps/` e aprire
`http://localhost:8080/Rubrica/` (React) o `http://localhost:8080/Rubrica/lista.jsp` (JSP).
