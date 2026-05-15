package com.novahotel.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Cấu hình Spring Security
 * Định nghĩa:
 * - Endpoints không cần xác thực (public endpoints)
 * - Endpoints cần xác thực (protected endpoints)
 * - Session policy: STATELESS (vì sử dụng JWT)
 * - CSRF: Disable (vì là REST API)
 * - Password encoder: BCrypt
 * 
 * Spring Boot 3.3 sử dụng Spring Security 6.x
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * JWT Filter
     */
    @Autowired
    private JwtFilter jwtFilter;

    /**
     * Cấu hình SecurityFilterChain
     * 
     * @param http HttpSecurity object
     * @return SecurityFilterChain
     * @throws Exception Exception
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (vì là REST API, không cần bảo vệ CSRF)
                .csrf(csrf -> csrf.disable())
                // Cấu hình authorization
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints (không cần xác thực)
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/rooms",
                                "/api/rooms/available",
                                "/api/rooms/search"
                        ).permitAll()
                        // Swagger/OpenAPI endpoints
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // Tất cả các endpoints khác cần xác thực
                        .anyRequest().authenticated()
                )
                // Session policy: STATELESS (không lưu session, dùng JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Thêm JwtFilter vào filter chain
                // Chạy trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Password encoder bean
     * Dùng BCrypt để encode password
     * 
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
