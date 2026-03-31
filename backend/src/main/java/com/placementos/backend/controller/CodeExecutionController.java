package com.placementos.backend.controller;

import com.placementos.backend.dto.CodeExecutionRequest;
import com.placementos.backend.dto.CodeExecutionResponse;
import com.placementos.backend.service.CodeExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@RequiredArgsConstructor
public class CodeExecutionController {

    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        return ResponseEntity.ok(codeExecutionService.execute(request));
    }
}
