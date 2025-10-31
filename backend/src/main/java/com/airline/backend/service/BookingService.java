package com.airline.backend.service;

import com.airline.backend.dto.*;
import com.airline.backend.model.Booking;
import com.airline.backend.model.Flight;
import com.airline.backend.model.Passenger;
import com.airline.backend.repository.BookingRepository;
import com.airline.backend.repository.FlightRepository;
import com.airline.backend.util.PriceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {

  private final FlightRepository flightRepo;
  private final BookingRepository bookingRepo;

  public BookingResponse create(BookingRequest req) {
    if (isBlank(req.getFlightId()) && req.getFlight() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "flightId or flight snapshot is required");
    }

    // Parse date
    LocalDate travelDate = null;
    if (!isBlank(req.getDate())) {
      try { travelDate = LocalDate.parse(req.getDate()); }
      catch (Exception e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "date must be YYYY-MM-DD"); }
    }

    // Build travellers (preferred) or legacy single pax
    List<Passenger> travellers = buildTravellers(req);
    if (travellers.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one passenger is required");
    }
    int pax = travellers.size();

    // Try DB by id; fallback to snapshot for mock flights
    Flight db = null;
    if (!isBlank(req.getFlightId())) {
      db = flightRepo.findById(req.getFlightId()).orElse(null);
    }

    final String from;
    final String to;
    final String airline;
    final String airlineCode;
    final String flightNumber;
    final String departTime;
    final String arriveTime;
    final Integer durationMinutes;
    final Integer stops;
    final String aircraft;
    final String flightIdForSeed;
    int unitPrice;

    String dateStr = (travelDate != null) ? travelDate.toString() : "any";
    long bucket = System.currentTimeMillis() / (1000L * 60 * 30);

    if (db != null) {
      String F = safeUpper(db.getFrom()), T = safeUpper(db.getTo());
      String seed = db.getId() + "-" + F + "-" + T + "-" + dateStr + "-" + bucket;
      unitPrice = PriceUtil.jitteredPrice(db.getBasePrice(), seed);

      from = db.getFrom(); to = db.getTo();
      airline = db.getAirline(); airlineCode = db.getAirlineCode();
      flightNumber = db.getFlightNumber();
      departTime = db.getDepartTime(); arriveTime = db.getArriveTime();
      durationMinutes = db.getDurationMinutes(); stops = db.getStops();
      aircraft = db.getAircraft();
      flightIdForSeed = db.getId();
    } else {
      FlightSnapshot s = Optional.ofNullable(req.getFlight())
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found"));

      if (isBlank(s.getFrom()) || isBlank(s.getTo())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Snapshot must include from/to");
      }
      from = s.getFrom().trim().toUpperCase();
      to = s.getTo().trim().toUpperCase();
      airline = s.getAirline();
      airlineCode = s.getAirlineCode();
      flightNumber = s.getFlightNumber();
      departTime = s.getDepartTime();
      arriveTime = s.getArriveTime();
      durationMinutes = s.getDurationMinutes();
      stops = s.getStops() == null ? 0 : s.getStops();
      aircraft = s.getAircraft();
      flightIdForSeed = isBlank(s.getId()) ? (airlineCode + "-" + flightNumber + "-" + from + "-" + to) : s.getId();

      if (s.getPrice() != null) {
        unitPrice = Math.max(0, s.getPrice());
      } else {
        int dur = Optional.ofNullable(durationMinutes).orElse(120);
        int base = 2200 + Math.round(dur * 18f);
        String seed = flightIdForSeed + "-" + from + "-" + to + "-" + dateStr + "-" + bucket;
        unitPrice = PriceUtil.jitteredPrice(base, seed);
      }
    }

    int totalPrice = Math.max(0, unitPrice) * pax;

    Passenger primary = travellers.get(0);

    Booking b = Booking.builder()
        .pnr(genPNR())
        .status("CONFIRMED")
        .flightId(flightIdForSeed)
        .from(from)
        .to(to)
        .airline(airline)
        .airlineCode(airlineCode)
        .flightNumber(flightNumber)
        .departTime(departTime)
        .arriveTime(arriveTime)
        .travelDate(travelDate)
        .unitPrice(unitPrice)
        .passengers(pax)
        .totalPrice(totalPrice)
        .currency("INR")
        .firstName(primary.getFirstName())
        .lastName(primary.getLastName())
        .email(primary.getEmail())
        .mobile(primary.getMobile())
        .createdAt(Instant.now())
        .travellers(travellers)
        .build();

    b = bookingRepo.save(b);
    return toResponse(b);
  }

  // ADD BACK: fetch booking by PNR (used by BookingController)
  public BookingResponse getByPnr(String pnr) {
    Booking b = bookingRepo.findByPnr(pnr)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    return toResponse(b);
  }

  private List<Passenger> buildTravellers(BookingRequest req) {
    List<Passenger> out = new ArrayList<>();
    if (req.getTravellers() != null && !req.getTravellers().isEmpty()) {
      for (PassengerDto d : req.getTravellers()) {
        if (isBlank(d.getFirstName()) || isBlank(d.getLastName()) || isBlank(d.getMobile())) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each passenger must include firstName, lastName and mobile");
        }
        out.add(new Passenger(
            d.getFirstName().trim(),
            d.getLastName().trim(),
            d.getMobile().trim(),
            isBlank(d.getEmail()) ? null : d.getEmail().trim()
        ));
      }
      return out;
    }
    // legacy single pax
    if (isBlank(req.getFirstName()) || isBlank(req.getLastName()) || isBlank(req.getMobile())) {
      return out;
    }
    int pax = (req.getPassengers() != null && req.getPassengers() > 0) ? req.getPassengers() : 1;
    for (int i = 0; i < pax; i++) {
      out.add(new Passenger(
          req.getFirstName().trim(),
          req.getLastName().trim(),
          req.getMobile().trim(),
          isBlank(req.getEmail()) ? null : req.getEmail().trim()
      ));
    }
    return out;
  }

  private String safeUpper(String s) { return s == null ? "" : s.trim().toUpperCase(Locale.ROOT); }
  private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

  private BookingResponse toResponse(Booking b) {
    return BookingResponse.builder()
        .id(b.getId())
        .pnr(b.getPnr())
        .status(b.getStatus())
        .unitPrice(b.getUnitPrice())
        .passengers(b.getPassengers())
        .totalPrice(b.getTotalPrice())
        .currency(b.getCurrency())
        .travelDate(b.getTravelDate())
        .createdAt(b.getCreatedAt())
        .flight(BookingResponse.FlightSummary.builder()
            .flightId(b.getFlightId())
            .from(b.getFrom())
            .to(b.getTo())
            .airline(b.getAirline())
            .airlineCode(b.getAirlineCode())
            .flightNumber(b.getFlightNumber())
            .departTime(b.getDepartTime())
            .arriveTime(b.getArriveTime())
            .build())
        .build();
  }

  private String genPNR() {
    final char[] ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
    SecureRandom rand = new SecureRandom();
    StringBuilder sb = new StringBuilder(6);
    for (int i = 0; i < 6; i++) sb.append(ALPHANUM[rand.nextInt(ALPHANUM.length)]);
    return sb.toString();
  }
}