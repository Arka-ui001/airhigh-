package com.airline.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Document(collection = "flights")
public class Flight {
    @Id
    private String id;
    private String airline;
    private String airlineCode;
    private String flightNumber;
    private String from;
    private String to;
    private String departTime;
    private String arriveTime;
    private int durationMinutes;
    private int stops;
    private int basePrice;
    private String aircraft;
}