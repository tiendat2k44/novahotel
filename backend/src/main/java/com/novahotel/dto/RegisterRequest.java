package com.novahotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO cho request đăng ký
 * Chứa thông tin cơ bản để tạo tài khoản mới
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    /**
     * Họ tên của người dùng
     */
    private String fullName;

    /**
     * Email của người dùng (dùng làm username duy nhất)
     */
    private String email;

    /**
     * Mật khẩu của người dùng
     */
    private String password;

    /**
     * Số điện thoại của người dùng
     */
    private String phoneNumber;
}
