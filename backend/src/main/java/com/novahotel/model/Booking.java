package com.novahotel.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    private String id;

    private String bookingId;
    private String userId;
    private String roomId;
    private Date checkIn;
    private Date checkOut;
    private String status;
    private double totalPrice;
    private String specialRequests;
    private Date createdAt;
}