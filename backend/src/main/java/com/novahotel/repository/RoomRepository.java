package com.novahotel.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.novahotel.model.Room;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    List<Room> findByStatus(String status);

    // Truy vấn cốt lõi 1: Tìm phòng trống theo khoảng thời gian
    @Query("{'status': 'available', $nor: [ { 'bookings': { $elemMatch: { 'checkIn': { $lt: ?1 }, 'checkOut': { $gt: ?0 } } } } ] }")
    List<Room> findAvailableRooms(Date checkIn, Date checkOut);
}