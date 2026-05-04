package com.novahotel.security;

import com.novahotel.config.JwtConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT Authentication Filter
 * Chạy một lần trên mỗi request để xác thực JWT token
 * 
 * Quy trình:
 * 1. Extract token từ Authorization header
 * 2. Validate token bằng JwtConfig
 * 3. Lấy userId từ token
 * 4. Tạo Authentication object và set vào SecurityContext
 * 5. Nếu token không hợp lệ, request sẽ tiếp tục nhưng không có authentication
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    /**
     * JwtConfig để validate token
     */
    @Autowired
    private JwtConfig jwtConfig;

    /**
     * JwtUtil để extract token từ header
     */
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Thực hiện filter logic
     * 
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @param filterChain FilterChain
     * @throws ServletException Servlet exception
     * @throws IOException IO exception
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Lấy Authorization header
            String authorizationHeader = request.getHeader("Authorization");

            // Nếu header hợp lệ
            if (authorizationHeader != null && jwtUtil.isValidBearerFormat(authorizationHeader)) {
                // Extract token
                String token = jwtUtil.extractTokenFromHeader(authorizationHeader);

                // Validate token
                if (token != null && jwtConfig.isTokenValid(token)) {
                    // Lấy userId từ token
                    String userId = jwtConfig.getUserIdFromToken(token);

                    // Tạo Authentication object
                    // authorities: empty ArrayList (không sử dụng roles hiện tại)
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            new ArrayList<>()
                    );

                    // Set Authentication vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // Log error nhưng không throw exception
            // Cho phép request tiếp tục mà không có authentication
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        // Tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
}
