package com.airline.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
  private String flightId;      // try DB by ID first
  private String date;          // "YYYY-MM-DD" or null
  private Integer passengers;   // optional fallback count

  // Legacy single-passenger fields (fallback if travellers missing)
  private String firstName;
  private String lastName;
  private String mobile;
  private String email;

  // Preferred: multi-passenger
  private List<PassengerDto> travellers;

  // Flight snapshot (required for mock flights not in DB)
  private FlightSnapshot flight;
}