package com.airline.backend.dto;

import lombok.Data;

@Data
public class FlightSnapshot {
  private String id;
  private String airline;
  private String airlineCode;
  private String flightNumber;
  private String from;
  private String to;
  private String departTime;
  private String arriveTime;
  private Integer durationMinutes;
  private Integer stops;
  private String aircraft;
  private Integer price;   // unit price used by UI for mock flights
}