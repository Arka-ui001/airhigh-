package com.airline.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("bookings")
public class Booking {
  @Id
  private String id;

  @Indexed(unique = true)
  private String pnr;
  private String status;

  // Flight snapshot at booking time
  private String flightId;
  private String from;
  private String to;
  private String airline;
  private String airlineCode;
  private String flightNumber;
  private String departTime;
  private String arriveTime;

  private LocalDate travelDate;

  // Pricing
  private Integer unitPrice;
  private Integer passengers;
  private Integer totalPrice;
  private String currency;

  // Primary contact
  private String firstName;
  private String lastName;
  private String email;
  private String mobile;

  private Instant createdAt;

  // NEW: full passenger list
  private List<Passenger> travellers;
}