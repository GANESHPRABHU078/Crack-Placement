package com.placementos.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResponse {
    private String status; // "Accepted", "Compile Error", "Runtime Error", "Time Limit Exceeded"
    private String stdout; // printed output
    private String stderr; // error logs
    private String executionTime; // "12ms"
}
