package com.novahotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO cho request lọc phòng trống
 * Truy vấn cốt lõi #1: Tìm phòng trống theo khoảng thời gian
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomFilterRequest {
    /**
     * Ngày check-in (định dạng: YYYY-MM-DD)
     */
    private LocalDate checkInDate;

    /**
     * Ngày check-out (định dạng: YYYY-MM-DD)
     */
    private LocalDate checkOutDate;

    /**
     * Số lượng khách (không bắt buộc)
     */
    private Integer numberOfGuests;

    /**
     * Loại phòng để lọc (không bắt buộc)
     * Ví dụ: "Single Room", "Double Room", "Suite", v.v.
     */
    private String roomType;

    /**
     * Giá tối đa cho phòng (không bắt buộc)
     */
    private Double maxPrice;

    /**
     * Giá tối thiểu cho phòng (không bắt buộc)
     */
    private Double minPrice;

    /**
     * Số trang cho phân trang (mặc định: 0)
     */
    private Integer page;

    /**
     * Kích thước trang (mặc định: 10)
     */
    private Integer size;
}
