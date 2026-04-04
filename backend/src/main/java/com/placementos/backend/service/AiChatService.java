package com.placementos.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementos.backend.dto.AiChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiChatService {

    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String openAiApiKey;
    private final String model;

    public AiChatService(
            ObjectMapper objectMapper,
            @Value("${app.ai.openai-api-key:}") String openAiApiKey,
            @Value("${app.ai.model:gpt-4o-mini}") String model
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
        this.openAiApiKey = openAiApiKey == null ? "" : openAiApiKey.trim();
        this.model = model;
    }

    public String generateReply(List<AiChatMessage> messages) {
        if (openAiApiKey.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "AI assistant is not configured on the server. Add OPENAI_API_KEY in backend environment variables."
            );
        }

        try {
            String payload = buildPayload(messages);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_CHAT_URL))
                    .timeout(Duration.ofSeconds(45))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                if (response.statusCode() == 401 || response.statusCode() == 403) {
                    throw new ResponseStatusException(
                            HttpStatus.SERVICE_UNAVAILABLE,
                            "AI assistant is not configured correctly on the server. Check OPENAI_API_KEY in backend environment variables."
                    );
                }
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        extractErrorMessage(response.body())
                );
            }

            String reply = extractReply(response.body());
            if (reply == null || reply.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI assistant returned an empty reply.");
            }
            return reply;
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI assistant request failed. Please try again.");
        }
    }

    private String buildPayload(List<AiChatMessage> messages) throws IOException {
        List<Map<String, String>> formattedMessages = new java.util.ArrayList<>();
        formattedMessages.add(Map.of(
                "role", "system",
                "content", "You are PlacementOS AI Mentor. Help students with coding, interview preparation, aptitude, communication, resume guidance, and company preparation. " +
                        "Be practical, concise, encouraging, and technically correct. Use markdown when useful."
        ));

        for (AiChatMessage msg : messages) {
            String role = normalizeRole(msg.getRole());
            String content = msg.getContent();
            if (content != null && !content.isBlank()) {
                formattedMessages.add(Map.of("role", role, "content", content.trim()));
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", model);
        payload.put("messages", formattedMessages);
        payload.put("temperature", 0.7);

        return objectMapper.writeValueAsString(payload);
    }

    private String normalizeRole(String role) {
        if ("assistant".equalsIgnoreCase(role)) {
            return "assistant";
        }
        return "user";
    }

    private String extractReply(String body) throws IOException {
        JsonNode root = objectMapper.readTree(body);
        JsonNode choices = root.path("choices");
        if (choices.isArray() && !choices.isEmpty()) {
            JsonNode message = choices.get(0).path("message");
            JsonNode content = message.path("content");
            if (!content.isMissingNode() && !content.isNull()) {
                return content.asText();
            }
        }
        return null;
    }

    private String extractErrorMessage(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode errorNode = root.path("error");
            JsonNode errorMessage = errorNode.path("message");
            if (!errorMessage.isMissingNode() && !errorMessage.asText().isBlank()) {
                return "AI assistant error: " + errorMessage.asText();
            }
        } catch (IOException ignored) {
        }
        return "AI assistant request failed with the provider.";
    }
}
