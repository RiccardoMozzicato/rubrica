package it.rubrica.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serve il frontend React (build in classpath:/static/app). Le route client-side
 * vengono inoltrate a index.html, così un refresh su /app/modifica/3 funziona.
 */
@Controller
public class SpaController {

    @GetMapping("/")
    public String home() {
        return "redirect:/app/";
    }

    @GetMapping({"/app", "/app/", "/app/nuovo", "/app/modifica/{id}"})
    public String app() {
        return "forward:/app/index.html";
    }
}
