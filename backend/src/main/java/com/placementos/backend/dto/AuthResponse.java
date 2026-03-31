package com.placementos.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private int xp;
    private int level;
    private String league;
    private int currentStreak;
    private int problemsSolved;
    private int globalRank;
}
