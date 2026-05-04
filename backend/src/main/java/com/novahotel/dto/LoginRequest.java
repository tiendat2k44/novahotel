package com.novahotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO cho request login
 * Chứa thông tin email và mật khẩu
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    /**
     * Email của người dùng
     */
    private String email;

    /**
     * Mật khẩu của người dùng
     */
    private String password;
}
