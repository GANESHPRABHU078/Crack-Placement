package com.placementos.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

@ControllerAdvice
@RestController
public class DebugErrorController {

    private static final ConcurrentLinkedQueue<String> ERROR_LOGS = new ConcurrentLinkedQueue<>();

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        String stackTrace = sw.toString();
        
        String logEntry = "[" + LocalDateTime.now() + "] ERROR: " + ex.getMessage() + "\n" + stackTrace;
        
        // Keep only last 10 errors
        if (ERROR_LOGS.size() > 10) {
            ERROR_LOGS.poll();
        }
        ERROR_LOGS.add(logEntry);
        
        if (ex instanceof org.springframework.web.server.ResponseStatusException rse) {
            return ResponseEntity.status(rse.getStatusCode()).body(rse.getReason());
        }
        
        // Throw it again or return 500
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ex.getMessage());
    }

    @GetMapping("/api/debug/errors")
    public List<String> getRecentErrors() {
        return new ArrayList<>(ERROR_LOGS);
    }
}
