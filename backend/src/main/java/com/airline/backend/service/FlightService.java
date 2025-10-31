package com.airline.backend.service;

import com.airline.backend.dto.FlightResponse;
import com.airline.backend.model.Flight;
import com.airline.backend.repository.FlightRepository;
import com.airline.backend.util.FlightMockGenerator;
import com.airline.backend.util.PriceUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightService {
  private static final Logger log = LoggerFactory.getLogger(FlightService.class);

  private final FlightRepository repo;

  public List<FlightResponse> search(String from, String to, LocalDate date, int passengers) {
    String F = safeUpper(from), T = safeUpper(to);

    // 1) Exact DB match
    List<Flight> flights = repo.findByFromIgnoreCaseAndToIgnoreCase(F, T);

    // 2) Your existing prefix fallback
    if (flights.isEmpty() && F.length() >= 2 && T.length() >= 2) {
      flights = repo.findByFromStartingWithIgnoreCaseAndToStartingWithIgnoreCase(
          F.substring(0, 2), T.substring(0, 2));
    }

    // 3) If still none, generate mock flights for any IATA pair
    if (flights.isEmpty()) {
      log.info("No DB flights for {}→{}. Using mock generator.", F, T);
      return FlightMockGenerator.generate(F, T, date, passengers);
    }

    long bucket = System.currentTimeMillis() / (1000L * 60 * 30);
    String dateStr = (date != null) ? date.toString() : "any";

    return flights.stream().map(f -> {
      String seed = f.getId() + "-" + F + "-" + T + "-" + dateStr + "-" + bucket;
      int price = PriceUtil.jitteredPrice(f.getBasePrice(), seed);
      return FlightResponse.builder()
          .id(f.getId())
          .airline(f.getAirline())
          .airlineCode(f.getAirlineCode())
          .flightNumber(f.getFlightNumber())
          .from(f.getFrom())
          .to(f.getTo())
          .departTime(f.getDepartTime())
          .arriveTime(f.getArriveTime())
          .durationMinutes(f.getDurationMinutes())
          .stops(f.getStops())
          .aircraft(f.getAircraft())
          .price(price)
          .date(dateStr)
          .build();
    }).collect(Collectors.toList());
  }

  private String safeUpper(String s) { return s == null ? "" : s.trim().toUpperCase(); }
}