package com.novahotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO generic cho response của tất cả API endpoints
 * Cung cấp cấu trúc response thống nhất với status, message, và data
 * 
 * @param <T> Kiểu dữ liệu trong trường data
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    /**
     * Mã HTTP status code (200, 400, 401, 404, 500, v.v.)
     */
    private Integer statusCode;

    /**
     * Thông báo kết quả (success/error message)
     */
    private String message;

    /**
     * Dữ liệu response chính (có thể null nếu không có dữ liệu)
     */
    private T data;

    /**
     * Thời gian xử lý request (milliseconds)
     */
    private Long timestamp;

    /**
     * Constructor đơn giản với statusCode, message, data
     */
    public ApiResponse(Integer statusCode, String message, T data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * Constructor cho error response (chỉ statusCode và message)
     */
    public ApiResponse(Integer statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.timestamp = System.currentTimeMillis();
    }
}
