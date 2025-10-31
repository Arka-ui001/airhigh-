package com.airline.backend.dto;

import lombok.Data;

@Data
public class PassengerDto {
  private String firstName;
  private String lastName;
  private String mobile;
  private String email;
}