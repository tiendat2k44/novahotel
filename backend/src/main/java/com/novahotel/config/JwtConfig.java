package com.novahotel.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Cấu hình JWT (JSON Web Token)
 * Xử lý tạo và xác thực JWT tokens
 * 
 * JWT Secret và Expiration time được lấy từ application.properties
 */
@Component
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + jwtExpirationMs);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Lấy user ID từ JWT token
     * 
     * @param token JWT token string
     * @return User ID (subject)
     */
    public String getUserIdFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Kiểm tra xem token có hợp lệ không
     * 
     * @param token JWT token string
     * @return true nếu token hợp lệ và chưa hết hạn
     */
    public boolean isTokenValid(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
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
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .getTime();
    }
}
