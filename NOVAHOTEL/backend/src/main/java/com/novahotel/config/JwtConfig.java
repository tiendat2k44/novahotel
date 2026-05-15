package com.novahotel.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

/**
 * Cấu hình JWT (JSON Web Token)
 * Xử lý tạo và xác thực JWT tokens
 * 
 * JWT Secret và Expiration time được lấy từ application.properties
 */
@Component
public class JwtConfig {
    /**
     * Secret key để ký JWT token (lấy từ application.properties)
     * Cần ít nhất 32 ký tự để HS256
     */
    @Value("${app.jwt.secret:your_secret_key_must_be_at_least_32_characters_long_for_hs256_algorithm}")
    private String jwtSecret;

    /**
     * Thời gian hết hạn token (milliseconds)
     * Mặc định: 24 giờ (86400000 ms)
     */
    @Value("${app.jwt.expiration:86400000}")
    private Long jwtExpirationMs;

    /**
     * Tạo JWT token cho user ID
     * 
     * @param userId ID của người dùng
     * @return JWT token string
     */
    public String generateToken(String userId) {
        long expiration = System.currentTimeMillis() + jwtExpirationMs;
        String payload = userId + ":" + expiration;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Lấy user ID từ JWT token
     * 
     * @param token JWT token string
     * @return User ID (subject)
     */
    public String getUserIdFromToken(String token) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String s = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = s.split(":", 2);
            return parts.length > 0 ? parts[0] : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Kiểm tra xem token có hợp lệ không
     * 
     * @param token JWT token string
     * @return true nếu token hợp lệ và chưa hết hạn
     */
    public boolean isTokenValid(String token) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String s = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = s.split(":", 2);
            if (parts.length < 2) return false;
            long exp = Long.parseLong(parts[1]);
            return System.currentTimeMillis() <= exp;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Lấy thời gian hết hạn từ token
     * 
     * @param token JWT token string
     * @return Thời gian hết hạn (milliseconds)
     */
    public Long getExpirationFromToken(String token) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(token);
            String s = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = s.split(":", 2);
            if (parts.length < 2) return 0L;
            return Long.parseLong(parts[1]);
        } catch (Exception e) {
            return 0L;
        }
    }
}
