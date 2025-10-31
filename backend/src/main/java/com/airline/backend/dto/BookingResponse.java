package com.airline.backend.dto;

import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
  private String id;
  private String pnr;
  private String status;

  private Integer unitPrice;
  private Integer passengers;
  private Integer totalPrice;
  private String currency;

  private LocalDate travelDate;
  private Instant createdAt;

  private FlightSummary flight;

  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class FlightSummary {
    private String flightId;
    private String from;
    private String to;
    private String airline;
    private String airlineCode;
    private String flightNumber;
    private String departTime;
    private String arriveTime;
  }
}