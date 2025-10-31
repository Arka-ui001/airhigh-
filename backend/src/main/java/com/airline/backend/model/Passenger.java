package com.airline.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {
  private String firstName;
  private String lastName;
  private String mobile;
  private String email;
}