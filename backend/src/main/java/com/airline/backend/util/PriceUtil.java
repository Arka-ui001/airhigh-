package com.airline.backend.util;

import java.util.SplittableRandom;

public final class PriceUtil {
  private PriceUtil() {}

  // Default +/-15% variation around base
  private static final double DEFAULT_MIN_FACTOR = 0.85;
  private static final double DEFAULT_MAX_FACTOR = 1.15;

  // Deterministic 64-bit FNV-1a hash to turn a seed string into a long.
  // The multiplication overflow here is intentional (no exceptions).
  private static long hash64(String s) {
    if (s == null) return 0xcbf29ce484222325L;
    long h = 0xcbf29ce484222325L;       // FNV offset basis
    for (int i = 0; i < s.length(); i++) {
      h ^= s.charAt(i);
      h *= 0x100000001b3L;              // FNV prime (wrap-around overflow is fine)
    }
    return h;
  }

  // Optional helper: deterministic 0..1 random based on seed (kept for compatibility)
  public static double seededRandom(String seed) {
    return new SplittableRandom(hash64(seed)).nextDouble();
  }

  // Main API used by your service
  public static int jitteredPrice(Integer basePrice, String seed) {
    return jitteredPrice(basePrice, seed, DEFAULT_MIN_FACTOR, DEFAULT_MAX_FACTOR);
  }

  // Overload with custom min/max factors if you ever need it
  public static int jitteredPrice(Integer basePrice, String seed, double minFactor, double maxFactor) {
    int base = (basePrice != null) ? basePrice : 0;
    if (base < 0) base = 0;

    // Ensure min <= max
    if (maxFactor < minFactor) {
      double tmp = minFactor; minFactor = maxFactor; maxFactor = tmp;
    }

    SplittableRandom rng = new SplittableRandom(hash64(seed));
    double factor = minFactor + rng.nextDouble() * (maxFactor - minFactor);

    long priceLong = Math.round(base * factor);
    if (priceLong < 0) priceLong = 0;
    if (priceLong > Integer.MAX_VALUE) priceLong = Integer.MAX_VALUE;

    return (int) priceLong;
  }
}