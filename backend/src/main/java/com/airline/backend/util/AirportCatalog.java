package com.airline.backend.util;

import java.util.Set;

public final class AirportCatalog {
  private AirportCatalog() {}

  public static final Set<String> IN_CODES = Set.of(
      "DEL","BOM","BLR","HYD","MAA","CCU","PNQ","AMD",
      "GOX","GOI","COK","TRV","CCJ",
      "NAG","JAI","VNS","LKO","BBI","PAT","GAU",
      "SXR","IXC","ATQ","IDR","BHO","STV","BDQ","RAJ","UDR","IXU",
      "CJB","IXM","TRZ","VTZ","VGA","IXZ","IXA","AJL","IMF","SHL",
      "IXR","JDH","IXL","DED","DHM","IXJ","TIR","IXE","CNN"
  );

  public static boolean isIndiaCode(String code) {
    return code != null && IN_CODES.contains(code.trim().toUpperCase());
  }
}