package com.airline.backend.repository;

import com.airline.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
  Optional<Booking> findByPnr(String pnr);
}