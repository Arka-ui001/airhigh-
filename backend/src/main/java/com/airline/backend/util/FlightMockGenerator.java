package com.airline.backend.util;

import com.airline.backend.dto.FlightResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.SplittableRandom;

public final class FlightMockGenerator {
  private FlightMockGenerator() {}

  private static final Airline[] AIRLINES = new Airline[] {
      new Airline("IndiGo", "6E", new String[]{"A320neo","A321neo"}),
      new Airline("Air India", "AI", new String[]{"A320","A321","B737"}),
      new Airline("Vistara", "UK", new String[]{"A320neo","A321"}),
      new Airline("Akasa Air", "QP", new String[]{"B737 MAX 8"}),
      new Airline("SpiceJet", "SG", new String[]{"B737"}),
      new Airline("Air India Express", "IX", new String[]{"B737"})
  };

  private record Airline(String name, String code, String[] fleet) {}

  private static String pad(int n) { return (n < 10 ? "0" : "") + n; }

  // Simple distance proxy from code letters: 60–180 min
  private static int durationFor(String from, String to) {
    int n = Math.abs(from.charAt(0) - to.charAt(0))
          + Math.abs(from.charAt(1) - to.charAt(1))
          + Math.abs(from.charAt(2) - to.charAt(2));
    return 60 + (n % 121); // 60..180
  }

  // Deterministic RNG from seed (FNV-1a based)
  private static SplittableRandom rng(String seed) {
    long h = 0xcbf29ce484222325L;   // FNV offset
    for (int i = 0; i < seed.length(); i++) {
      h ^= seed.charAt(i);
      h *= 0x100000001b3L;          // FNV prime (overflow intentional)
    }
    return new SplittableRandom(h);
  }

  // Generate results for ANY valid 3-letter IATA pair (even if not in DB)
  public static List<FlightResponse> generate(String from, String to, LocalDate date, int passengers) {
    if (from == null || to == null) return List.of();
    from = from.trim().toUpperCase();
    to = to.trim().toUpperCase();
    if (!from.matches("^[A-Z]{3}$") || !to.matches("^[A-Z]{3}$") || from.equals(to)) return List.of();

    String dateStr = (date != null) ? date.toString() : "any";
    String seed = from + "-" + to + "-" + dateStr;
    SplittableRandom r = rng(seed);

    int count = 3 + Math.abs(seed.hashCode()) % 3; // 3..5 flights
    int baseDur = durationFor(from, to);

    int[] bands = {7, 13, 19}; // morning / afternoon / evening

    List<FlightResponse> out = new ArrayList<>();
    long bucket = System.currentTimeMillis() / (1000L * 60 * 30);

    for (int i = 0; i < count; i++) {
      Airline al = AIRLINES[r.nextInt(AIRLINES.length)];
      int dur = Math.max(55, baseDur + r.nextInt(-12, 13)); // ±12 min
      int stops = r.nextDouble() < 0.18 ? 1 : 0;
      String aircraft = al.fleet()[r.nextInt(al.fleet().length)];

      int depH = Math.min(23, Math.max(5, bands[i % bands.length] + r.nextInt(0, 3)));
      int depM = r.nextInt(0, 60);
      String departTime = pad(depH) + ":" + pad(depM);

      int arrTotal = depH * 60 + depM + dur + (stops == 0 ? 0 : 40);
      int arrH = (arrTotal / 60) % 24;
      int arrM = arrTotal % 60;
      String arriveTime = pad(arrH) + ":" + pad(arrM);

      int basePrice = 2200 + Math.round(dur * 18f);
      String priceSeed = al.code() + "-" + from + "-" + to + "-" + dateStr + "-" + bucket + "-" + i;
      int price = Math.max(999, com.airline.backend.util.PriceUtil.jitteredPrice(basePrice, priceSeed));

      String number = al.code() + (100 + r.nextInt(900)) + (stops == 0 ? "" : "1");
      String id = al.code() + "-" + number + "-" + from + "-" + to + "-" + dateStr + "-" + i;

      out.add(FlightResponse.builder()
          .id(id)
          .airline(al.name())
          .airlineCode(al.code())
          .flightNumber(number)
          .from(from)
          .to(to)
          .departTime(departTime)
          .arriveTime(arriveTime)
          .durationMinutes(dur)
          .stops(stops)
          .aircraft(aircraft)
          .price(price)
          .date(dateStr)
          .build());
    }

    out.sort(Comparator.comparingInt(FlightResponse::getPrice));
    return out;
  }
}