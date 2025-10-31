package com.airline.backend.repository;

import com.airline.backend.model.Flight;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FlightRepository extends MongoRepository<Flight, String> {
    List<Flight> findByFromIgnoreCaseAndToIgnoreCase(String from, String to);
    List<Flight> findByFromStartingWithIgnoreCaseAndToStartingWithIgnoreCase(String from, String to);
}