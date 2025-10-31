package com.airline.backend.controller;

import com.airline.backend.dto.FlightResponse;
import com.airline.backend.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FlightController {
    private final FlightService service;

    @GetMapping("/search")
    public List<FlightResponse> search(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "1") int passengers
    ) {
        if (!from.matches("(?i)^[A-Z]{3}$") || !to.matches("(?i)^[A-Z]{3}$"))
            throw new IllegalArgumentException("from/to must be 3-letter IATA codes");
        if (from.equalsIgnoreCase(to))
            throw new IllegalArgumentException("from and to cannot be the same");
        return service.search(from, to, date, passengers);
    }
}