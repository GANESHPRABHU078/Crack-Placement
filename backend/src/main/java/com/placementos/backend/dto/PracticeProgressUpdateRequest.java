package com.placementos.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PracticeProgressUpdateRequest {
    @NotNull
    private Boolean completed;
}
