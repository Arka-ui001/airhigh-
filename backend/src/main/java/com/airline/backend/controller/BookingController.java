package com.airline.backend.controller;

import com.airline.backend.dto.BookingRequest;
import com.airline.backend.dto.BookingResponse;
import com.airline.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
@RequiredArgsConstructor
public class BookingController {

  private final BookingService service;

  @PostMapping
  public BookingResponse create(@RequestBody BookingRequest req) {
    return service.create(req);
  }

  @GetMapping("/pnr/{pnr}")
  public BookingResponse getByPnr(@PathVariable String pnr) {
    return service.getByPnr(pnr);
  }
}