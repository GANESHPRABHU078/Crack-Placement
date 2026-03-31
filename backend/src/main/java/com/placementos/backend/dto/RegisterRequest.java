package com.placementos.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @Email @NotBlank private String email;
    @Size(min = 8) @NotBlank private String password;
    private String college;
    private String branch;
    private String gradYear;
    private String primaryGoal;
}
