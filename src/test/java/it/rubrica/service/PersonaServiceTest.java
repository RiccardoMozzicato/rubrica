package it.rubrica.service;

import it.rubrica.model.Persona;
import it.rubrica.repository.PersonaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PersonaServiceTest {

    private static final Persona MARIO = new Persona(1, "Mario", "Rossi", "Via Roma 1", "3331234567", 40);

    @Mock
    private PersonaRepository personaRepository;

    @InjectMocks
    private PersonaService personaService;

    @Test
    void elencaTutteRestituisceLePersoneDelRepository() {
        when(personaRepository.findAll()).thenReturn(List.of(MARIO));

        assertThat(personaService.elencaTutte()).containsExactly(MARIO);
    }

    @Test
    void trovaPerIdLanciaEccezioneSePersonaAssente() {
        when(personaRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> personaService.trovaPerId(99))
                .isInstanceOf(PersonaNonTrovataException.class);
    }

    @Test
    void salvaInserisceUnaPersonaNuova() {
        Persona nuova = MARIO.withId(null);
        when(personaRepository.insert(nuova)).thenReturn(MARIO);

        assertThat(personaService.salva(nuova)).isEqualTo(MARIO);
        verify(personaRepository, never()).update(any());
    }

    @Test
    void salvaAggiornaUnaPersonaEsistente() {
        when(personaRepository.update(MARIO)).thenReturn(true);

        assertThat(personaService.salva(MARIO)).isEqualTo(MARIO);
        verify(personaRepository, never()).insert(any());
    }

    @Test
    void salvaLanciaEccezioneSeLaPersonaDaAggiornareNonEsiste() {
        when(personaRepository.update(MARIO)).thenReturn(false);

        assertThatThrownBy(() -> personaService.salva(MARIO))
                .isInstanceOf(PersonaNonTrovataException.class);
    }

    @Test
    void eliminaLanciaEccezioneSeLaPersonaNonEsiste() {
        when(personaRepository.deleteById(99)).thenReturn(false);

        assertThatThrownBy(() -> personaService.elimina(99))
                .isInstanceOf(PersonaNonTrovataException.class);
    }
}
