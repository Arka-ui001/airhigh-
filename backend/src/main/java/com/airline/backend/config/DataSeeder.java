package com.airline.backend.config;

import com.airline.backend.model.Flight;
import com.airline.backend.repository.FlightRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final FlightRepository repo;
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void run(String... args) throws Exception {
        repo.deleteAll(); // DEV: reseed each run
        try (InputStream is = new ClassPathResource("data/india-flights.json").getInputStream()) {
            List<Flight> flights = mapper.readValue(is, new TypeReference<>() {});
            repo.saveAll(flights);
            System.out.println("Seeded India flights: " + flights.size());
        }
    }
}