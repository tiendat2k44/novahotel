package com.novahotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO cho request đặt phòng
 * Chứa thông tin chi tiết để thực hiện booking
 * Truy vấn cốt lõi #2: Đặt phòng (booking)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    /**
     * ID của phòng được đặt
     */
    private String roomId;

    /**
     * Ngày check-in (định dạng: YYYY-MM-DD)
     */
    private LocalDate checkInDate;

    /**
     * Ngày check-out (định dạng: YYYY-MM-DD)
     */
    private LocalDate checkOutDate;

    /**
     * Số lượng khách
     */
    private Integer numberOfGuests;

    /**
     * Ghi chú/yêu cầu đặc biệt từ khách hàng
     */
    private String notes;

    /**
     * Họ tên người liên hệ
     */
    private String contactName;

    /**
     * Email người liên hệ
     */
    private String contactEmail;

    /**
     * Số điện thoại người liên hệ
     */
    private String contactPhone;
}
