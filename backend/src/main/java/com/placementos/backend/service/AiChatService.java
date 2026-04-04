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
    private static final String GEMINI_CHAT_URL = "https://generativelanguage.googleapis.com/v1/models/";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String openAiApiKey;
    private final String geminiApiKey;
    private final String geminiModel;
    private final String provider;
    private final String model;

    public AiChatService(
            ObjectMapper objectMapper,
            @Value("${app.ai.provider:openai}") String provider,
            @Value("${app.ai.openai-api-key:}") String openAiApiKey,
            @Value("${app.ai.gemini-api-key:}") String geminiApiKey,
            @Value("${app.ai.gemini-model:gemini-pro}") String geminiModel,
            @Value("${app.ai.model:gpt-4o-mini}") String model
    ) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
        this.provider = provider.toLowerCase();
        this.openAiApiKey = openAiApiKey == null ? "" : openAiApiKey.trim();
        this.geminiApiKey = geminiApiKey == null ? "" : geminiApiKey.trim();
        this.geminiModel = geminiModel == null ? "gemini-pro" : geminiModel.trim();
        this.model = model;
    }

    public String generateReply(List<AiChatMessage> messages) {
        if (messages == null || messages.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No messages provided for AI assistant.");
        }
        
        try {
            if ("openai".equalsIgnoreCase(provider)) {
                return generateOpenAiReply(messages);
            }
            return generateGeminiReply(messages);
        } catch (ResponseStatusException e) {
            throw e; // Pass through existing response status exceptions
        } catch (Exception e) {
            e.printStackTrace(); // Log stack trace in Render
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "AI Assistant error: " + e.getMessage());
        }
    }

    private String generateOpenAiReply(List<AiChatMessage> messages) {
        if (openAiApiKey.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "OpenAI is not configured. Add OPENAI_API_KEY.");
        }
        try {
            String payload = buildOpenAiPayload(messages);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_CHAT_URL))
                    .timeout(Duration.ofSeconds(45))
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, extractOpenAiErrorMessage(response.body()));
            }

            String reply = extractOpenAiReply(response.body());
            if (reply == null || reply.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI assistant returned an empty reply.");
            }
            return reply;
        } catch (IOException | InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "OpenAI request failed.");
        }
    }

    private String generateGeminiReply(List<AiChatMessage> messages) {
        if (geminiApiKey.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Gemini is not configured. Add GEMINI_API_KEY.");
        }

        String[] apiVersions = {"v1beta", "v1"};
        String[] modelsToTry = {geminiModel, "gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"};
        String lastError = "";

        try {
            String payload = buildGeminiPayload(messages);
            String maskedKey = geminiApiKey.length() > 8 
                ? geminiApiKey.substring(0, 4) + "..." + geminiApiKey.substring(geminiApiKey.length() - 4)
                : "INVALID_KEY_LENGTH";
            
            System.out.println("[DIAGNOSTIC] Gemini API Key (Masked): " + maskedKey);

            for (String version : apiVersions) {
                for (String modelName : modelsToTry) {
                    if (modelName == null || modelName.isBlank()) continue;
                    
                    // Clean model name (some users accidentally add 'models/' in their env var)
                    String cleanedModel = modelName.startsWith("models/") ? modelName.substring(7) : modelName;

                    try {
                        String url = String.format("https://generativelanguage.googleapis.com/%s/models/%s:generateContent?key=%s", 
                                version, cleanedModel, geminiApiKey);
                        
                        System.out.println("[DIAGNOSTIC] Attempting Gemini: " + version + " / " + cleanedModel);

                        HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create(url))
                                .timeout(Duration.ofSeconds(20))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(payload))
                                .build();

                        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                        
                        if (response.statusCode() == 200) {
                            String reply = extractGeminiReply(response.body());
                            if (reply != null && !reply.isBlank()) {
                                return reply;
                            }
                        } else {
                            lastError = response.body();
                        }
                    } catch (Exception e) {
                        lastError = e.getMessage();
                    }
                }
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini failed after trying multiple models: " + lastError);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini request construction failed.");
        }
    }

    private String buildOpenAiPayload(List<AiChatMessage> messages) throws IOException {
        List<Map<String, String>> formattedMessages = new java.util.ArrayList<>();
        formattedMessages.add(Map.of("role", "system", "content", getSystemInstruction()));

        for (AiChatMessage msg : messages) {
            String role = normalizeRole(msg.getRole());
            if (msg.getContent() != null && !msg.getContent().isBlank()) {
                formattedMessages.add(Map.of("role", role, "content", msg.getContent().trim()));
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", model);
        payload.put("messages", formattedMessages);
        payload.put("temperature", 0.7);

        return objectMapper.writeValueAsString(payload);
    }

    private String buildGeminiPayload(List<AiChatMessage> messages) throws IOException {
        List<Map<String, Object>> contents = new java.util.ArrayList<>();
        boolean isFirstMessage = true;

        for (AiChatMessage msg : messages) {
            String role = "assistant".equalsIgnoreCase(msg.getRole()) ? "model" : "user";
            String content = msg.getContent() != null ? msg.getContent().trim() : "";

            if (!content.isBlank()) {
                // Prepend system instruction to the first user message for maximum compatibility
                if (isFirstMessage && "user".equals(role)) {
                    content = getSystemInstruction() + "\n\n" + content;
                    isFirstMessage = false;
                }

                contents.add(Map.of(
                        "role", role,
                        "parts", List.of(Map.of("text", content))
                ));
            }
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", contents);
        payload.put("generationConfig", Map.of("temperature", 0.7));

        return objectMapper.writeValueAsString(payload);
    }

    private String getSystemInstruction() {
        return "You are PlacementOS AI Mentor. Help students with coding, interview preparation, aptitude, communication, resume guidance, and company preparation. Be practical, concise, encouraging, and technically correct. Use markdown when useful.";
    }

    private String normalizeRole(String role) {
        return "assistant".equalsIgnoreCase(role) ? "assistant" : "user";
    }

    private String extractOpenAiReply(String body) throws IOException {
        JsonNode root = objectMapper.readTree(body);
        JsonNode choices = root.path("choices");
        if (choices.isArray() && !choices.isEmpty()) {
            return choices.get(0).path("message").path("content").asText();
        }
        return null;
    }

    private String extractGeminiReply(String body) throws IOException {
        JsonNode root = objectMapper.readTree(body);
        JsonNode candidates = root.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                return parts.get(0).path("text").asText();
            }
        }
        return null;
    }

    private String extractOpenAiErrorMessage(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            String message = root.path("error").path("message").asText();
            return message.isBlank() ? "OpenAI request failed." : "AI assistant error: " + message;
        } catch (IOException ignored) {
            return "OpenAI request failed.";
        }
    }
}
