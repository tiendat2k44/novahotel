package com.novahotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO cho response khi đăng nhập/đăng ký thành công
 * Chứa JWT token và thông tin người dùng
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    /**
     * JWT token để xác thực các request tiếp theo
     */
    private String token;

    /**
     * Kiểu token (thường là "Bearer")
     */
    private String tokenType;

    /**
     * ID của người dùng
     */
    private String userId;

    /**
     * Email của người dùng
     */
    private String email;

    /**
     * Họ tên của người dùng
     */
    private String fullName;

    /**
     * Thời gian hết hạn của token (milliseconds)
     */
    private Long expiresIn;
}
