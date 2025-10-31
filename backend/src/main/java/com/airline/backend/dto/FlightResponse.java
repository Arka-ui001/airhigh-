package com.airline.backend.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FlightResponse {
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
    private String aircraft;
    private int price;   // INR (jittered)
    private String date; // search date
}