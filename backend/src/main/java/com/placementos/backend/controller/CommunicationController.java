package com.placementos.backend.controller;

import com.placementos.backend.service.AiChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/communication")
public class CommunicationController {

    private final AiChatService aiChatService;

    public CommunicationController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, String>> analyzeResponse(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String answer = request.get("answer");
        
        String feedback = aiChatService.analyzeInterviewResponse(question, answer);
        return ResponseEntity.ok(Map.of("feedback", feedback));
    }
}
