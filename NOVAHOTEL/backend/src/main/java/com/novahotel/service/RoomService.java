package com.novahotel.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.novahotel.dto.RoomFilterRequest;
import com.novahotel.model.Room;
import com.novahotel.repository.RoomRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Trả về Page để hỗ trợ phân trang như controller mong đợi
    public Page<Room> getAllRooms(int page, int size) {
        Pageable p = PageRequest.of(page, size);
        return roomRepository.findAll(p);
    }

    // Giữ lại phương thức cũ dùng Date
    public List<Room> getAvailableRooms(Date checkIn, Date checkOut) {
        return roomRepository.findAvailableRooms(checkIn, checkOut);
    }

    // Overload nhận LocalDate (controller dùng LocalDate)
    public List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        Date d1 = Date.from(checkIn.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date d2 = Date.from(checkOut.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return roomRepository.findAvailableRooms(d1, d2);
    }

    // Hỗ trợ tìm theo RoomFilterRequest (dùng trong search)
    public Page<Room> findAvailableRooms(RoomFilterRequest filter) {
        // Đơn giản: lấy danh sách và trả về PageImpl để tránh thay đổi logic repository
        List<Room> list = getAvailableRooms(filter.getCheckInDate(), filter.getCheckOutDate());
        int page = Math.max(0, filter.getPage() == null ? 0 : filter.getPage());
        int size = Math.max(1, filter.getSize() == null ? 10 : filter.getSize());
        int start = Math.min(page * size, list.size());
        int end = Math.min(start + size, list.size());
        return new PageImpl<>(list.subList(start, end), PageRequest.of(page, size), list.size());
    }

    public List<Room> getRoomsByStatus(String status) {
        return roomRepository.findByStatus(status);
    }

    // Thêm hỗ trợ tìm theo loại phòng
    public List<Room> getRoomsByType(String type) {
        return roomRepository.findByRoomType(type);
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room getRoomById(String roomId) {
        return roomRepository.findById(roomId).orElse(null);
    }
}