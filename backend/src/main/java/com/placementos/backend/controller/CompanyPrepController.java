package com.placementos.backend.controller;

import com.placementos.backend.entity.CompanyPrepProfile;
import com.placementos.backend.entity.PracticeProblem;
import com.placementos.backend.entity.PracticeTopic;
import com.placementos.backend.repository.CompanyPrepProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/company-prep")
@RequiredArgsConstructor
public class CompanyPrepController {

    private final CompanyPrepProfileRepository companyPrepProfileRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getCompanies() {
        return ResponseEntity.ok(companyPrepProfileRepository.findAllByOrderByDisplayOrderAscCompanyAsc().stream()
                .map(profile -> Map.<String, Object>of(
                        "company", profile.getCompany(),
                        "aptitudeLevel", profile.getAptitudeLevel(),
                        "logoText", profile.getLogoText(),
                        "brandColor", profile.getBrandColor(),
                        "focusAreas", profile.getFocusAreas().stream()
                                .map(focusArea -> focusArea.getTopic().getName())
                                .toList(),
                        "roundPattern", profile.getRoundPattern()
                ))
                .toList());
    }

    @GetMapping("/{company}")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getCompanyPrep(@PathVariable String company) {
        CompanyPrepProfile profile = companyPrepProfileRepository.findByCompanyIgnoreCase(company)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "No company prep data found for " + company));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("company", profile.getCompany());
        response.put("aptitudeLevel", profile.getAptitudeLevel());
        response.put("logoText", profile.getLogoText());
        response.put("brandColor", profile.getBrandColor());
        response.put("roundPattern", profile.getRoundPattern());
        response.put("focusAreas", profile.getFocusAreas().stream()
                .map(focusArea -> focusArea.getTopic().getName())
                .toList());
        response.put("askedQuestions", profile.getAskedQuestions().stream()
                .map(question -> question.getQuestionText())
                .toList());
        response.put("recommendedProblems", profile.getRecommendedProblems().stream()
                .map(recommendation -> toProblemResponse(recommendation.getPracticeProblem()))
                .toList());
        response.put("prepPlan", profile.getPrepPlan());
        response.put("stats", Map.of(
                "interviewRounds", profile.getInterviewRounds(),
                "onlineAssessmentQuestions", profile.getOnlineAssessmentQuestions(),
                "codingQuestions", profile.getCodingQuestions(),
                "interviewDurationMinutes", profile.getInterviewDurationMinutes()
        ));
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toProblemResponse(PracticeProblem problem) {
        PracticeTopic topic = problem.getTopic();
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", problem.getId());
        item.put("title", problem.getTitle());
        item.put("difficulty", problem.getDifficulty().name());
        item.put("platform", problem.getPlatform().name());
        item.put("problemUrl", problem.getProblemUrl());
        item.put("summary", problem.getSummary());
        item.put("topic", Map.of(
                "name", topic.getName(),
                "slug", topic.getSlug(),
                "accentColor", topic.getAccentColor()
        ));
        return item;
    }
}
