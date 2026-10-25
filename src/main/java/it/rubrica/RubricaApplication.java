package it.rubrica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RubricaApplication {

	/**
	 * Connector/J avvia un thread di pulizia delle connessioni abbandonate che non si ferma
	 * all'undeploy su Tomcat (memory leak segnalato da clearReferencesThreads). Le connessioni
	 * sono già gestite dal pool Hikari, quindi il thread non serve.
	 */
	private static final String MYSQL_DISABLE_ABANDONED_CLEANUP = "com.mysql.cj.disableAbandonedConnectionCleanup";

	public static void main(String[] args) {
		disattivaPuliziaConnessioniMySql();
		SpringApplication.run(RubricaApplication.class, args);
	}

	/** Va chiamato prima che il driver MySQL venga caricato. */
	static void disattivaPuliziaConnessioniMySql() {
		System.setProperty(MYSQL_DISABLE_ABANDONED_CLEANUP, "true");
	}

}
