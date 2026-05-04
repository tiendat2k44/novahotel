package com.novahotel.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    private String id;

    private String roomId;
    private String roomNumber;
    private String roomType;
    private Price price;
    private String status;
    private List<String> facilities;
    private List<String> images;
    private String description;
    private int maxGuests;
}

// Inner classes cho Price
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class Price {
    private double basePrice;
    private SeasonalPrice seasonalPrice;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class SeasonalPrice {
    private double highSeason;
    private double lowSeason;
}