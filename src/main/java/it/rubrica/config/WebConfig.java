package it.rubrica.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Duration CACHE_ASSET_CON_HASH = Duration.ofDays(365);

    /** Gli asset di Vite hanno l'hash nel nome: si possono tenere in cache per sempre. */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/app/assets/**")
                .addResourceLocations("classpath:/static/app/assets/")
                .setCacheControl(CacheControl.maxAge(CACHE_ASSET_CON_HASH).cachePublic().immutable());
    }
}
