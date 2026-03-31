package com.placementos.backend.dto;

import lombok.Data;

@Data
public class CodeExecutionRequest {
    private String language; // "java", "python", "cpp", "js"
    private String code;     // The finalized runnable code string containing main()
}
