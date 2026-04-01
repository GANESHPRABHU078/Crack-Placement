package com.placementos.backend.controller;

import com.placementos.backend.dto.AiChatRequest;
import com.placementos.backend.dto.AiChatResponse;
import com.placementos.backend.service.AiChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final AiChatService aiChatService;

    public AiAssistantController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request) {
        String reply = aiChatService.generateReply(request.getMessages());
        return ResponseEntity.ok(new AiChatResponse(reply));
    }
}
